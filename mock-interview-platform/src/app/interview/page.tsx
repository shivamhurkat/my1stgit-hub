'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Code, 
  PenTool, 
  SkipForward, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { InterviewConfig, ChatMessage, InterviewSession } from '@/types';
import ChatInterface from '@/components/interview/ChatInterface';
import CodeEditor from '@/components/interview/CodeEditor';
import Whiteboard from '@/components/interview/Whiteboard';
import Timer from '@/components/interview/Timer';
import ProgressBar from '@/components/interview/ProgressBar';

type PanelType = 'chat' | 'code' | 'whiteboard';

export default function InterviewPage() {
  const router = useRouter();
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [activePanel, setActivePanel] = useState<PanelType>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentCode, setCurrentCode] = useState<string>('');
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [maxSkips] = useState(3);
  const [sessionStartTime] = useState<Date>(new Date());
  const [totalQuestions] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Load config from sessionStorage
  useEffect(() => {
    const savedConfig = sessionStorage.getItem('interviewConfig');
    if (!savedConfig) {
      router.push('/');
      return;
    }

    try {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      initializeSession(parsedConfig);
    } catch (error) {
      console.error('Error parsing interview config:', error);
      router.push('/');
    }
  }, [router]);

  const initializeSession = (config: InterviewConfig) => {
    const session: InterviewSession = {
      id: `session_${Date.now()}`,
      userId: 'user_123', // Mock user ID
      config,
      status: 'active',
      currentQuestionIndex: 0,
      totalQuestions,
      startTime: new Date(),
      tokensUsed: 0,
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSession(session);
    
    // Start with first question
    generateNextQuestion();
  };

  const generateNextQuestion = async () => {
    if (!config) return;

    setIsLoading(true);
    try {
      // Mock question generation - in real app, this would call the AI
      const mockQuestions = {
        'Software Engineer': [
          'Implement a function to find the longest palindrome substring in a given string.',
          'Design a system to handle rate limiting for an API.',
          'Explain the difference between REST and GraphQL APIs.',
        ],
        'Product Manager': [
          'How would you prioritize features for a new mobile app?',
          'Design a product roadmap for the next 6 months.',
          'How would you measure the success of a feature launch?',
        ],
        'Data Scientist': [
          'Explain the bias-variance tradeoff in machine learning.',
          'How would you handle missing data in a dataset?',
          'Design an A/B testing framework for a recommendation system.',
        ],
      };

      const roleQuestions = mockQuestions[config.role as keyof typeof mockQuestions] || mockQuestions['Software Engineer'];
      const question = roleQuestions[currentQuestionIndex % roleQuestions.length];
      
      setCurrentQuestion(question);
      
      // Add AI message
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sessionId: session?.id || '',
        role: 'assistant',
        content: question,
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update session
      if (session) {
        setSession(prev => prev ? {
          ...prev,
          currentQuestionIndex: currentQuestionIndex + 1,
          questions: [...prev.questions, {
            id: `q_${Date.now()}`,
            sessionId: prev.id,
            question,
            type: 'text',
            timestamp: new Date(),
            order: currentQuestionIndex,
          }],
        } : null);
      }
      
      setCurrentQuestionIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error generating question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId: session?.id || '',
      role: 'user',
      content,
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg_${Date.now()}`,
        sessionId: session?.id || '',
        role: 'assistant',
        content: 'Thank you for your response. Let me ask you a follow-up question...',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Generate next question after a delay
      setTimeout(() => {
        generateNextQuestion();
      }, 2000);
    }, 1500);
  };

  const handleSkipQuestion = () => {
    if (skipsUsed >= maxSkips) {
      alert('You have used all your skips for this interview.');
      return;
    }

    setSkipsUsed(prev => prev + 1);
    generateNextQuestion();
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // In real app, this would start/stop voice recording
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // In real app, this would mute/unmute AI voice
  };

  const handleEndInterview = () => {
    if (confirm('Are you sure you want to end the interview?')) {
      // Navigate to report page
      router.push('/report');
    }
  };

  const handleCodeRun = (code: string) => {
    // Mock code execution
    console.log('Running code:', code);
    // In real app, this would execute the code and show results
  };

  if (!config || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {config.role} Interview - {config.company}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <Timer startTime={sessionStartTime} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Skips:</span>
              <span className="text-sm font-medium">
                {skipsUsed}/{maxSkips}
              </span>
            </div>
            
            <button
              onClick={handleSkipQuestion}
              disabled={skipsUsed >= maxSkips}
              className={`px-3 py-1 rounded text-sm flex items-center space-x-1 ${
                skipsUsed >= maxSkips
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
            
            <button
              onClick={handleEndInterview}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              End Interview
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <ProgressBar 
            current={currentQuestionIndex} 
            total={totalQuestions} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Chat Interface */}
        <div className="w-1/2 border-r border-gray-200 bg-white">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Interview Chat</h2>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onVoiceMessage={handleVoiceToggle}
                isLoading={isLoading}
              />
            </div>
            
            {/* Voice Controls */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleVoiceToggle}
                  className={`p-2 rounded-full ${
                    isRecording 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={handleMuteToggle}
                  className={`p-2 rounded-full ${
                    isMuted 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Dynamic Content */}
        <div className="w-1/2 bg-white">
          <div className="h-full flex flex-col">
            {/* Panel Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActivePanel('chat')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                  activePanel === 'chat'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Notes</span>
                </div>
              </button>
              
              <button
                onClick={() => setActivePanel('code')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                  activePanel === 'code'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Code Editor</span>
                </div>
              </button>
              
              <button
                onClick={() => setActivePanel('whiteboard')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
                  activePanel === 'whiteboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <PenTool className="w-4 h-4" />
                  <span>Whiteboard</span>
                </div>
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {activePanel === 'chat' && (
                <div className="h-full p-4">
                  <div className="bg-gray-50 rounded-lg p-4 h-full">
                    <h3 className="font-semibold mb-3">Current Question</h3>
                    <p className="text-gray-700 mb-4">{currentQuestion}</p>
                    
                    <h3 className="font-semibold mb-3">Your Notes</h3>
                    <textarea
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Take notes here..."
                    />
                  </div>
                </div>
              )}
              
              {activePanel === 'code' && (
                <CodeEditor
                  language="javascript"
                  code={currentCode}
                  onChange={setCurrentCode}
                  onRun={handleCodeRun}
                />
              )}
              
              {activePanel === 'whiteboard' && (
                <Whiteboard />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}