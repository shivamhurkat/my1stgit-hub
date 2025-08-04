import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { openai, generateSystemPrompt } from '@/lib/openai';
import { InterviewRole, TargetCompany, InterviewType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      message, 
      conversationHistory, 
      interviewConfig,
      currentQuestion 
    } = await request.json();

    if (!message || !interviewConfig) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate system prompt based on interview configuration
    const systemPrompt = generateSystemPrompt(
      interviewConfig.types[0] as InterviewType, // Use first type for now
      interviewConfig.role as InterviewRole,
      interviewConfig.company as TargetCompany
    );

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // TODO: Save conversation to database
    // TODO: Update token usage

    return NextResponse.json({
      success: true,
      response: aiResponse,
      tokensUsed: completion.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' }, 
      { status: 500 }
    );
  }
}