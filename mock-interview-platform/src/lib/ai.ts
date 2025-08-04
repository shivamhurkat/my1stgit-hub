import OpenAI from 'openai';
import { InterviewConfig, InterviewQuestion, AIEvaluation, RoundType } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt templates for different interview types
const PROMPT_TEMPLATES = {
  coding: `You are an expert technical interviewer at {company}. You're conducting a coding interview for a {role} position.

Context: {context}
Question: {question}

Instructions:
1. Evaluate the candidate's code solution
2. Assess problem-solving approach, code quality, and efficiency
3. Provide constructive feedback
4. Rate on a scale of 0-100

Evaluation criteria:
- Code correctness (30%)
- Algorithm efficiency (25%)
- Code readability (20%)
- Problem-solving approach (15%)
- Edge case handling (10%)

Respond in JSON format:
{
  "score": number,
  "feedback": "detailed feedback",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "confidence": number,
  "communication": number
}`,

  systemDesign: `You are an expert system design interviewer at {company}. You're conducting a system design interview for a {role} position.

Question: {question}

Instructions:
1. Evaluate the candidate's system design approach
2. Assess scalability, reliability, and technical depth
3. Provide constructive feedback
4. Rate on a scale of 0-100

Evaluation criteria:
- System architecture (30%)
- Scalability considerations (25%)
- Technical depth (20%)
- Communication clarity (15%)
- Trade-off analysis (10%)

Respond in JSON format:
{
  "score": number,
  "feedback": "detailed feedback",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "confidence": number,
  "communication": number
}`,

  hr: `You are an HR interviewer at {company}. You're conducting a behavioral interview for a {role} position.

Question: {question}

Instructions:
1. Evaluate the candidate's response quality
2. Assess communication skills and experience relevance
3. Provide constructive feedback
4. Rate on a scale of 0-100

Evaluation criteria:
- Communication clarity (30%)
- Experience relevance (25%)
- Problem-solving approach (20%)
- Cultural fit (15%)
- Confidence level (10%)

Respond in JSON format:
{
  "score": number,
  "feedback": "detailed feedback",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "confidence": number,
  "communication": number
}`
};

export class AIService {
  // Generate interview questions based on configuration
  static async generateQuestions(config: InterviewConfig, count: number = 5): Promise<InterviewQuestion[]> {
    const prompt = `Generate ${count} interview questions for a ${config.role} position at ${config.company}.
    
    Round types: ${config.roundTypes.join(', ')}
    
    For each question, provide:
    - Question text
    - Type (coding/system design/hr)
    - Difficulty (easy/medium/hard)
    - Category
    - Context (if needed)
    - Code template (for coding questions)
    
    Respond in JSON format:
    [
      {
        "question": "question text",
        "type": "coding|system design|hr",
        "difficulty": "easy|medium|hard",
        "category": "category name",
        "context": "context if needed",
        "codeTemplate": "code template for coding questions"
      }
    ]`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from OpenAI');

      const questions = JSON.parse(response);
      return questions.map((q: any, index: number) => ({
        id: `q_${Date.now()}_${index}`,
        ...q,
        expectedAnswer: null,
      }));
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  }

  // Evaluate user response
  static async evaluateResponse(
    question: InterviewQuestion,
    userAnswer: string,
    userCode?: string,
    config: InterviewConfig
  ): Promise<AIEvaluation> {
    const template = PROMPT_TEMPLATES[question.type as keyof typeof PROMPT_TEMPLATES] || PROMPT_TEMPLATES.hr;
    
    const prompt = template
      .replace('{company}', config.company)
      .replace('{role}', config.role)
      .replace('{context}', question.context || '')
      .replace('{question}', question.question);

    const fullPrompt = `${prompt}

Candidate's Answer: ${userAnswer}
${userCode ? `Candidate's Code:\n${userCode}` : ''}

Please evaluate the response and provide feedback.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: fullPrompt }],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from OpenAI');

      const evaluation = JSON.parse(response);
      return evaluation;
    } catch (error) {
      console.error('Error evaluating response:', error);
      // Return default evaluation on error
      return {
        score: 50,
        feedback: 'Unable to evaluate response at this time.',
        strengths: ['Response provided'],
        weaknesses: ['Evaluation unavailable'],
        suggestions: ['Try again later'],
        confidence: 50,
        communication: 50,
      };
    }
  }

  // Generate follow-up questions based on user's weak areas
  static async generateFollowUpQuestion(
    previousQuestion: InterviewQuestion,
    userAnswer: string,
    evaluation: AIEvaluation,
    config: InterviewConfig
  ): Promise<InterviewQuestion> {
    const prompt = `Based on the candidate's response to the previous question and their evaluation, generate a follow-up question that addresses their weak areas.

Previous Question: ${previousQuestion.question}
Candidate's Answer: ${userAnswer}
Evaluation: ${evaluation.feedback}
Weaknesses: ${evaluation.weaknesses.join(', ')}

Generate a follow-up question that:
1. Addresses the identified weaknesses
2. Is appropriate for a ${config.role} position at ${config.company}
3. Has the same difficulty level or slightly easier
4. Helps the candidate improve

Respond with just the question text.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const question = completion.choices[0]?.message?.content;
      if (!question) throw new Error('No response from OpenAI');

      return {
        id: `q_followup_${Date.now()}`,
        type: previousQuestion.type,
        question: question.trim(),
        context: null,
        codeTemplate: previousQuestion.codeTemplate,
        expectedAnswer: null,
        difficulty: previousQuestion.difficulty,
        category: previousQuestion.category,
      };
    } catch (error) {
      console.error('Error generating follow-up question:', error);
      throw error;
    }
  }

  // Generate interview report
  static async generateReport(
    sessionId: string,
    questions: InterviewQuestion[],
    responses: any[],
    config: InterviewConfig
  ): Promise<any> {
    const prompt = `Generate a comprehensive interview report for a ${config.role} candidate at ${config.company}.

Questions and Responses:
${questions.map((q, i) => `
Question ${i + 1}: ${q.question}
Response: ${responses[i]?.answer || 'No response'}
Evaluation: ${JSON.stringify(responses[i]?.evaluation || {})}
`).join('\n')}

Generate a detailed report including:
1. Overall score (0-100)
2. Breakdown by category (technical, communication, problem-solving, confidence)
3. Key strengths
4. Areas for improvement
5. Specific recommendations
6. Summary of performance

Respond in JSON format:
{
  "overallScore": number,
  "breakdown": {
    "technical": number,
    "communication": number,
    "problemSolving": number,
    "confidence": number
  },
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "summary": "overall performance summary"
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error('No response from OpenAI');

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // Generate interview introduction
  static async generateIntroduction(config: InterviewConfig): Promise<string> {
    const prompt = `Generate a welcoming introduction for a ${config.role} interview at ${config.company}.

Round types: ${config.roundTypes.join(', ')}

Make it professional, welcoming, and informative. Include:
1. Welcome message
2. Brief overview of the interview process
3. What to expect
4. Encouragement

Keep it concise (2-3 sentences).`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'Welcome to your interview!';
    } catch (error) {
      console.error('Error generating introduction:', error);
      return 'Welcome to your interview! Let\'s begin.';
    }
  }
}