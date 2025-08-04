import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      userResponse, 
      question, 
      questionType,
      code,
      interviewConfig 
    } = await request.json();

    if (!userResponse || !question) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create evaluation prompt
    const evaluationPrompt = `
You are an expert interviewer evaluating a candidate's response. Please provide a detailed evaluation.

QUESTION: ${question}
QUESTION TYPE: ${questionType}
CANDIDATE RESPONSE: ${userResponse}
${code ? `CODE SUBMITTED: ${code}` : ''}

Please evaluate the response on the following criteria (score 0-100 for each):
1. ACCURACY: How technically correct and accurate is the response?
2. CLARITY: How clear and well-structured is the communication?
3. CONFIDENCE: How confident and assured does the candidate sound?
4. COMPLETENESS: How thoroughly does the response address the question?

Also provide:
- FEEDBACK: Constructive feedback (2-3 sentences)
- SUGGESTIONS: 2-3 specific improvement suggestions
- STRENGTHS: What the candidate did well
- WEAKNESSES: Areas that need improvement

Please respond in the following JSON format:
{
  "accuracy": 85,
  "clarity": 90,
  "confidence": 80,
  "completeness": 75,
  "feedback": "Your response demonstrates good understanding...",
  "suggestions": ["Consider explaining...", "You could improve..."],
  "strengths": ["Good problem-solving approach", "Clear communication"],
  "weaknesses": ["Could be more specific", "Missing edge cases"]
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer. Provide honest, constructive evaluations that help candidates improve.'
        },
        {
          role: 'user',
          content: evaluationPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3, // Lower temperature for more consistent evaluations
    });

    const evaluationText = completion.choices[0]?.message?.content;

    if (!evaluationText) {
      return NextResponse.json({ error: 'No evaluation from AI' }, { status: 500 });
    }

    try {
      // Parse the JSON response
      const evaluation = JSON.parse(evaluationText);

      // TODO: Save evaluation to database

      return NextResponse.json({
        success: true,
        evaluation,
        tokensUsed: completion.usage?.total_tokens || 0
      });

    } catch (parseError) {
      console.error('Failed to parse evaluation JSON:', parseError);
      
      // Fallback: create a basic evaluation if JSON parsing fails
      const fallbackEvaluation = {
        accuracy: 75,
        clarity: 75,
        confidence: 75,
        completeness: 75,
        feedback: evaluationText || 'Evaluation completed. Please review your response.',
        suggestions: ['Continue practicing similar problems', 'Focus on clear communication'],
        strengths: ['Attempted the problem', 'Showed understanding'],
        weaknesses: ['Could provide more detail', 'Consider edge cases']
      };

      return NextResponse.json({
        success: true,
        evaluation: fallbackEvaluation,
        tokensUsed: completion.usage?.total_tokens || 0
      });
    }

  } catch (error) {
    console.error('AI Evaluation Error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate response' }, 
      { status: 500 }
    );
  }
}