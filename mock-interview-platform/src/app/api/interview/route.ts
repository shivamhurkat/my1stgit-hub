import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/supabase';
import { AIService } from '@/lib/ai';
import { TokenManager } from '@/lib/tokens';
import { InterviewConfig } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { config }: { config: InterviewConfig } = body;

    if (!config) {
      return NextResponse.json({ error: 'Interview configuration required' }, { status: 400 });
    }

    // Check if user has enough tokens
    const canStart = await TokenManager.canStartMockInterview(userId);
    if (!canStart.canStart) {
      return NextResponse.json({
        error: 'Insufficient tokens',
        currentBalance: canStart.currentBalance,
        requiredTokens: canStart.requiredTokens,
      }, { status: 402 });
    }

    // Consume tokens
    const tokenConsumed = await TokenManager.consumeTokens(
      userId,
      'mockInterview',
      `Mock interview for ${config.role} at ${config.company}`
    );

    if (!tokenConsumed) {
      return NextResponse.json({ error: 'Failed to consume tokens' }, { status: 500 });
    }

    // Create interview session
    const session = await db.createInterviewSession({
      user_id: userId,
      config,
      status: 'active',
      start_time: new Date().toISOString(),
      current_question_index: 0,
      tokens_used: 2, // Base cost for mock interview
    });

    // Generate questions
    const questions = await AIService.generateQuestions(config, 5);

    // Save questions to database
    for (const question of questions) {
      await db.supabase
        .from('interview_questions')
        .insert({
          session_id: session.id,
          type: question.type,
          question: question.question,
          context: question.context,
          code_template: question.codeTemplate,
          expected_answer: question.expectedAnswer,
          difficulty: question.difficulty,
          category: question.category,
        });
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      questions,
    });

  } catch (error) {
    console.error('Error creating interview session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Get specific session
      const session = await db.getInterviewSession(sessionId);
      return NextResponse.json({ success: true, session });
    } else {
      // Get user's sessions
      const sessions = await db.getUserSessions(userId);
      return NextResponse.json({ success: true, sessions });
    }

  } catch (error) {
    console.error('Error fetching interview sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}