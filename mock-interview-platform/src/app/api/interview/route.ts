import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import AIInterviewer from '@/lib/openai';
import { InterviewConfig, InterviewSession, ChatMessage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config, sessionId, message, questionId } = body;

    switch (action) {
      case 'create_session':
        return await createInterviewSession(config);
      
      case 'generate_question':
        return await generateQuestion(sessionId, config);
      
      case 'evaluate_response':
        return await evaluateResponse(sessionId, questionId, message);
      
      case 'send_message':
        return await sendMessage(sessionId, message);
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createInterviewSession(config: InterviewConfig) {
  try {
    const session: Omit<InterviewSession, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: 'user_123', // Mock user ID - in real app, get from auth
      config,
      status: 'active',
      currentQuestionIndex: 0,
      totalQuestions: 5,
      startTime: new Date(),
      tokensUsed: 0,
      questions: [],
    };

    const { data, error } = await supabase
      .from(TABLES.INTERVIEW_SESSIONS)
      .insert({
        user_id: session.userId,
        config: session.config,
        status: session.status,
        current_question_index: session.currentQuestionIndex,
        total_questions: session.totalQuestions,
        start_time: session.startTime.toISOString(),
        tokens_used: session.tokensUsed,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        ...session,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    });
  } catch (error) {
    console.error('Error creating interview session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

async function generateQuestion(sessionId: string, config: InterviewConfig) {
  try {
    const aiInterviewer = new AIInterviewer(config);
    const roundTypes = config.roundTypes;
    const currentRound = roundTypes[Math.floor(Math.random() * roundTypes.length)];
    
    const question = await aiInterviewer.generateQuestion(currentRound);

    // Save question to database
    const { data: questionData, error: questionError } = await supabase
      .from(TABLES.INTERVIEW_QUESTIONS)
      .insert({
        session_id: sessionId,
        question,
        type: currentRound.toLowerCase(),
        timestamp: new Date().toISOString(),
        order: 0, // Will be updated based on current index
      })
      .select()
      .single();

    if (questionError) {
      console.error('Error saving question:', questionError);
    }

    return NextResponse.json({
      success: true,
      data: {
        question,
        type: currentRound,
        questionId: questionData?.id,
      }
    });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}

async function evaluateResponse(sessionId: string, questionId: string, message: string) {
  try {
    // Get the question details
    const { data: questionData, error: questionError } = await supabase
      .from(TABLES.INTERVIEW_QUESTIONS)
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError || !questionData) {
      return NextResponse.json(
        { success: false, error: 'Question not found' },
        { status: 404 }
      );
    }

    // Get session config
    const { data: sessionData, error: sessionError } = await supabase
      .from(TABLES.INTERVIEW_SESSIONS)
      .select('config')
      .eq('id', sessionId)
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    const config = sessionData.config as InterviewConfig;
    const aiInterviewer = new AIInterviewer(config);
    
    const evaluation = await aiInterviewer.evaluateResponse(
      questionData.question,
      message,
      questionData.type as any,
    );

    // Update question with user answer and evaluation
    const { error: updateError } = await supabase
      .from(TABLES.INTERVIEW_QUESTIONS)
      .update({
        user_answer: message,
        ai_evaluation: evaluation,
      })
      .eq('id', questionId);

    if (updateError) {
      console.error('Error updating question:', updateError);
    }

    return NextResponse.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('Error evaluating response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to evaluate response' },
      { status: 500 }
    );
  }
}

async function sendMessage(sessionId: string, message: string) {
  try {
    const chatMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      sessionId,
      role: 'user',
      content: message,
      type: 'text',
    };

    const { data, error } = await supabase
      .from(TABLES.CHAT_MESSAGES)
      .insert({
        session_id: chatMessage.sessionId,
        role: chatMessage.role,
        content: chatMessage.content,
        type: chatMessage.type,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        ...chatMessage,
        timestamp: new Date(data.timestamp),
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from(TABLES.INTERVIEW_SESSIONS)
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Get chat messages
    const { data: messages, error: messagesError } = await supabase
      .from(TABLES.CHAT_MESSAGES)
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
    }

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from(TABLES.INTERVIEW_QUESTIONS)
      .select('*')
      .eq('session_id', sessionId)
      .order('order', { ascending: true });

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        session: {
          id: session.id,
          userId: session.user_id,
          config: session.config,
          status: session.status,
          currentQuestionIndex: session.current_question_index,
          totalQuestions: session.total_questions,
          startTime: new Date(session.start_time),
          endTime: session.end_time ? new Date(session.end_time) : undefined,
          tokensUsed: session.tokens_used,
          createdAt: new Date(session.created_at),
          updatedAt: new Date(session.updated_at),
          questions: questions || [],
        },
        messages: messages || [],
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}