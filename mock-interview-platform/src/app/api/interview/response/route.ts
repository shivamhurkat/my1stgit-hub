import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/supabase';
import { AIService } from '@/lib/ai';
import { InterviewConfig } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, questionId, answer, code, config } = body;

    if (!sessionId || !questionId || !answer || !config) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the question details
    const { data: questionData, error: questionError } = await db.supabase
      .from('interview_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError || !questionData) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Evaluate the response using AI
    const evaluation = await AIService.evaluateResponse(
      {
        id: questionData.id,
        type: questionData.type as any,
        question: questionData.question,
        context: questionData.context,
        codeTemplate: questionData.code_template,
        expectedAnswer: questionData.expected_answer,
        difficulty: questionData.difficulty as any,
        category: questionData.category,
      },
      answer,
      code,
      config as InterviewConfig
    );

    // Save the response to database
    const response = await db.saveInterviewResponse({
      session_id: sessionId,
      question_id: questionId,
      answer,
      code: code || null,
      evaluation,
      timestamp: new Date().toISOString(),
      duration: 0, // TODO: Calculate actual duration
    });

    return NextResponse.json({
      success: true,
      response,
      evaluation,
    });

  } catch (error) {
    console.error('Error processing interview response:', error);
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

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get all responses for a session
    const { data: responses, error } = await db.supabase
      .from('interview_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      responses,
    });

  } catch (error) {
    console.error('Error fetching interview responses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}