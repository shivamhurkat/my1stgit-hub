'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { InterviewConfig, ChatMessage, InterviewQuestion, AIEvaluation } from '@/types';
import { AIService } from '@/lib/ai';
import { db } from '@/lib/supabase';
import { TokenManager } from '@/lib/tokens';
import ChatInterface from '@/components/interview/ChatInterface';
import CodeEditor from '@/components/interview/CodeEditor';
import Whiteboard from '@/components/interview/Whiteboard';
import InterviewHeader from '@/components/interview/InterviewHeader';
import InterviewSidebar from '@/components/interview/InterviewSidebar';

export default function InterviewPage() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'code' | 'whiteboard'>('chat');
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'active' | 'completed'>('loading');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [tokensUsed, setTokensUsed] = useState<number>(0);
  const [skipCount, setSkipCount] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [whiteboardEnabled, setWhiteboardEnabled] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }

    initializeInterview();
  }, [isLoaded, user]);

  useEffect(() => {
    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && sessionStatus === 'active') {
      endInterview();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, sessionStatus]);

  const initializeInterview = async () => {
    try {
      setLoading(true);
      
      // Parse config from URL
      const configParam = searchParams.get('config');
      if (!configParam) {
        throw new Error('No interview configuration provided');
      }

      const parsedConfig: InterviewConfig = JSON.parse(decodeURIComponent(configParam));
      setConfig(parsedConfig);
      setTimeRemaining(parsedConfig.duration * 60);

      // Create interview session
      const session = await db.createInterviewSession({
        user_id: user!.id,
        config: parsedConfig,
        status: 'active',
        start_time: new Date().toISOString(),
        current_question_index: 0,
        tokens_used: 0,
      });

      setSessionId(session.id);

      // Generate questions
      const generatedQuestions = await AIService.generateQuestions(parsedConfig, 5);
      setQuestions(generatedQuestions);

      // Generate introduction
      const introduction = await AIService.generateIntroduction(parsedConfig);
      
      // Add introduction message
      const introMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: introduction,
        timestamp: new Date(),
      };

      setMessages([introMessage]);

      // Start with first question
      if (generatedQuestions.length > 0) {
        await askQuestion(generatedQuestions[0]);
      }

      setSessionStatus('active');
    } catch (error) {
      console.error('Error initializing interview:', error);
      alert('Failed to start interview. Please try again.');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async (question: InterviewQuestion) => {
    setCurrentQuestion(question);
    
    const questionMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'ai',
      content: question.question,
      timestamp: new Date(),
      metadata: {
        questionId: question.id,
      },
    };

    setMessages(prev => [...prev, questionMessage]);

    // Set appropriate view based on question type
    if (question.type === 'Coding') {
      setCurrentView('code');
    } else if (question.type === 'System Design') {
      setCurrentView('whiteboard');
    } else {
      setCurrentView('chat');
    }
  };

  const handleUserResponse = async (response: string, code?: string) => {
    if (!currentQuestion || !config) return;

    setLoading(true);

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'user',
        content: response,
        timestamp: new Date(),
        metadata: {
          questionId: currentQuestion.id,
          code,
        },
      };

      setMessages(prev => [...prev, userMessage]);

      // Evaluate response
      const evaluation = await AIService.evaluateResponse(
        currentQuestion,
        response,
        code,
        config
      );

      // Save response to database
      await db.saveInterviewResponse({
        session_id: sessionId!,
        question_id: currentQuestion.id,
        answer: response,
        code: code || null,
        evaluation,
        timestamp: new Date().toISOString(),
        duration: 0, // TODO: Calculate actual duration
      });

      // Add AI feedback message
      const feedbackMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: `Evaluation: ${evaluation.feedback}\n\nScore: ${evaluation.score}/100\n\nStrengths: ${evaluation.strengths.join(', ')}\nAreas for improvement: ${evaluation.weaknesses.join(', ')}`,
        timestamp: new Date(),
        metadata: {
          evaluation,
        },
      };

      setMessages(prev => [...prev, feedbackMessage]);
      setResponses(prev => [...prev, { questionId: currentQuestion.id, answer: response, evaluation }]);

      // Move to next question or end interview
      const currentIndex = questions.findIndex(q => q.id === currentQuestion.id);
      if (currentIndex < questions.length - 1) {
        await askQuestion(questions[currentIndex + 1]);
      } else {
        await endInterview();
      }
    } catch (error) {
      console.error('Error handling user response:', error);
      alert('Failed to process response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipQuestion = async () => {
    if (!currentQuestion || skipCount >= 3) return;

    // Check if user has enough tokens
    const canSkip = await TokenManager.canUseFeature(user!.id, 'skipQuestion');
    if (!canSkip.canUse) {
      alert('Insufficient tokens to skip question.');
      return;
    }

    // Consume tokens
    await TokenManager.consumeTokens(
      user!.id,
      'skipQuestion',
      `Skipped question: ${currentQuestion.question}`
    );

    setSkipCount(prev => prev + 1);
    setTokensUsed(prev => prev + 1);

    // Move to next question
    const currentIndex = questions.findIndex(q => q.id === currentQuestion.id);
    if (currentIndex < questions.length - 1) {
      await askQuestion(questions[currentIndex + 1]);
    } else {
      await endInterview();
    }
  };

  const endInterview = async () => {
    if (!sessionId || !config) return;

    setSessionStatus('completed');
    setLoading(true);

    try {
      // Generate final report
      const report = await AIService.generateReport(sessionId, questions, responses, config);

      // Save report to database
      await db.saveInterviewReport({
        session_id: sessionId,
        user_id: user!.id,
        overall_score: report.overallScore,
        breakdown: report.breakdown,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.recommendations,
        question_analysis: report.questionAnalysis,
        generated_at: new Date().toISOString(),
      });

      // Update session status
      await db.updateInterviewSession(sessionId, {
        status: 'completed',
        end_time: new Date().toISOString(),
        score: report.overallScore,
        tokens_used: tokensUsed,
      });

      // Navigate to report page
      router.push(`/report/${sessionId}`);
    } catch (error) {
      console.error('Error ending interview:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = async () => {
    if (!voiceEnabled) {
      const canUse = await TokenManager.canUseFeature(user!.id, 'voiceAnalysis');
      if (!canUse.canUse) {
        alert('Insufficient tokens for voice analysis.');
        return;
      }
      await TokenManager.consumeTokens(user!.id, 'voiceAnalysis', 'Voice analysis enabled');
      setTokensUsed(prev => prev + 1);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const toggleWhiteboard = async () => {
    if (!whiteboardEnabled) {
      const canUse = await TokenManager.canUseFeature(user!.id, 'whiteboard');
      if (!canUse.canUse) {
        alert('Insufficient tokens for whiteboard.');
        return;
      }
      await TokenManager.consumeTokens(user!.id, 'whiteboard', 'Whiteboard enabled');
      setTokensUsed(prev => prev + 1);
    }
    setWhiteboardEnabled(!whiteboardEnabled);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Interview...</h1>
          <p className="text-gray-600">Please wait while we set up your interview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InterviewHeader
        config={config}
        timeRemaining={timeRemaining}
        sessionStatus={sessionStatus}
        skipCount={skipCount}
        onSkip={handleSkipQuestion}
      />

      <div className="flex h-screen">
        {/* Main Interview Area */}
        <div className="flex-1 flex flex-col">
          {/* Current View */}
          <div className="flex-1 p-6">
            {currentView === 'chat' && (
              <ChatInterface
                messages={messages}
                onSendMessage={handleUserResponse}
                loading={loading}
                voiceEnabled={voiceEnabled}
              />
            )}
            
            {currentView === 'code' && (
              <CodeEditor
                question={currentQuestion}
                onSubmit={handleUserResponse}
                loading={loading}
              />
            )}
            
            {currentView === 'whiteboard' && (
              <Whiteboard
                question={currentQuestion}
                onSubmit={handleUserResponse}
                loading={loading}
                enabled={whiteboardEnabled}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <InterviewSidebar
          config={config}
          currentQuestion={currentQuestion}
          questions={questions}
          responses={responses}
          tokensUsed={tokensUsed}
          voiceEnabled={voiceEnabled}
          whiteboardEnabled={whiteboardEnabled}
          onToggleVoice={toggleVoice}
          onToggleWhiteboard={toggleWhiteboard}
          onViewChange={setCurrentView}
        />
      </div>
    </div>
  );
}