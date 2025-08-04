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
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get session details
    const session = await db.getInterviewSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get all questions and responses for the session
    const { data: questions, error: questionsError } = await db.supabase
      .from('interview_questions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    const { data: responses, error: responsesError } = await db.supabase
      .from('interview_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (questionsError || responsesError) {
      return NextResponse.json({ error: 'Failed to fetch session data' }, { status: 500 });
    }

    // Generate AI report
    const config = session.config as InterviewConfig;
    const aiReport = await AIService.generateReport(sessionId, questions, responses, config);

    // Calculate overall score from individual question scores
    const totalScore = responses.reduce((sum, response) => {
      const evaluation = response.evaluation as any;
      return sum + (evaluation?.score || 0);
    }, 0);
    const averageScore = responses.length > 0 ? Math.round(totalScore / responses.length) : 0;

    // Create report data
    const reportData = {
      session_id: sessionId,
      user_id: userId,
      overall_score: aiReport.overallScore || averageScore,
      breakdown: aiReport.breakdown || {
        technical: averageScore,
        communication: averageScore,
        problemSolving: averageScore,
        confidence: averageScore,
      },
      strengths: aiReport.strengths || [],
      weaknesses: aiReport.weaknesses || [],
      recommendations: aiReport.recommendations || [],
      question_analysis: responses.map((response, index) => ({
        questionId: response.question_id,
        question: questions[index]?.question || 'Unknown question',
        userAnswer: response.answer,
        evaluation: response.evaluation,
        category: questions[index]?.category || 'General',
      })),
      generated_at: new Date().toISOString(),
    };

    // Save report to database
    const report = await db.saveInterviewReport(reportData);

    // Update session status to completed
    await db.updateInterviewSession(sessionId, {
      status: 'completed',
      end_time: new Date().toISOString(),
      score: reportData.overall_score,
    });

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        questionAnalysis: reportData.question_analysis,
      },
    });

  } catch (error) {
    console.error('Error generating report:', error);
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
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
    }

    // Get report
    const report = await db.getInterviewReport(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report,
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}