import OpenAI from 'openai';
import { InterviewConfig, RoundType, AIEvaluation } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt templates for different interview types
export const PROMPT_TEMPLATES = {
  HR: {
    system: `You are an experienced HR interviewer at {company}. You're conducting a {role} interview. 
    Be professional, friendly, and ask behavioral questions that assess:
    - Communication skills
    - Problem-solving approach
    - Team collaboration
    - Leadership potential
    - Cultural fit
    
    Keep responses concise and natural. Ask one question at a time and provide gentle feedback.`,
    
    evaluation: `Evaluate this HR interview response for a {role} position at {company}:
    Question: {question}
    Answer: {answer}
    
    Provide a score (1-100) and brief feedback focusing on:
    - Communication clarity
    - Specific examples provided
    - Professionalism
    - Cultural fit indicators`
  },

  CODING: {
    system: `You are a senior software engineer at {company} conducting a technical interview for a {role} position.
    Ask coding questions appropriate for the role and company level. 
    
    Guidelines:
    - Start with easy questions, progress to harder ones
    - Ask for time/space complexity analysis
    - Encourage the candidate to think aloud
    - Provide hints if they're stuck
    - Evaluate both code quality and problem-solving approach
    
    Keep your responses concise and technical.`,
    
    evaluation: `Evaluate this coding interview response:
    Question: {question}
    Code: {code}
    Explanation: {explanation}
    
    Score (1-100) based on:
    - Correctness of solution
    - Code quality and readability
    - Time/space complexity analysis
    - Problem-solving approach
    - Communication during coding`
  },

  SYSTEM_DESIGN: {
    system: `You are a senior architect at {company} conducting a system design interview for a {role} position.
    Ask system design questions that assess:
    - Scalability thinking
    - Trade-off analysis
    - Technical depth
    - Communication of complex ideas
    
    Start with requirements clarification, then guide through the design process.`,
    
    evaluation: `Evaluate this system design response:
    Question: {question}
    Design: {design}
    Explanation: {explanation}
    
    Score (1-100) based on:
    - Requirements understanding
    - Scalability considerations
    - Trade-off analysis
    - Technical depth
    - Communication clarity`
  },

  BEHAVIORAL: {
    system: `You are a senior manager at {company} conducting a behavioral interview for a {role} position.
    Ask STAR (Situation, Task, Action, Result) format questions about:
    - Leadership experiences
    - Conflict resolution
    - Project management
    - Innovation and creativity
    
    Be encouraging and help candidates structure their responses.`,
    
    evaluation: `Evaluate this behavioral interview response:
    Question: {question}
    Answer: {answer}
    
    Score (1-100) based on:
    - STAR format usage
    - Specific examples provided
    - Quantifiable results
    - Leadership demonstration
    - Communication effectiveness`
  }
};

export class AIInterviewer {
  private config: InterviewConfig;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  constructor(config: InterviewConfig) {
    this.config = config;
    this.initializeConversation();
  }

  private initializeConversation() {
    const systemPrompt = this.getSystemPrompt();
    this.conversationHistory = [
      { role: 'assistant', content: systemPrompt }
    ];
  }

  private getSystemPrompt(): string {
    const { role, company, roundTypes } = this.config;
    const primaryType = roundTypes[0];
    const template = PROMPT_TEMPLATES[primaryType as keyof typeof PROMPT_TEMPLATES];
    
    return template.system
      .replace('{company}', company)
      .replace('{role}', role);
  }

  async generateQuestion(roundType: RoundType, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<string> {
    const prompt = `Generate a ${difficulty} ${roundType.toLowerCase()} question for a ${this.config.role} position at ${this.config.company}. 
    Make it specific to the role and company. Keep it concise and clear.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Could not generate question.';
  }

  async evaluateResponse(
    question: string,
    answer: string,
    roundType: RoundType,
    code?: string
  ): Promise<AIEvaluation> {
    const template = PROMPT_TEMPLATES[roundType as keyof typeof PROMPT_TEMPLATES];
    const evaluationPrompt = template.evaluation
      .replace('{question}', question)
      .replace('{answer}', answer)
      .replace('{code}', code || '')
      .replace('{company}', this.config.company)
      .replace('{role}', this.config.role);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert interview evaluator. Provide structured feedback.' },
        { role: 'user', content: evaluationPrompt }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Parse the AI response to extract structured feedback
    return this.parseEvaluationResponse(content);
  }

  private parseEvaluationResponse(content: string): AIEvaluation {
    // This is a simplified parser - in production, you'd want more robust parsing
    const scoreMatch = content.match(/score[:\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;

    const confidenceMatch = content.match(/confidence[:\s]*(\d+)/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 70;

    const communicationMatch = content.match(/communication[:\s]*(\d+)/i);
    const communication = communicationMatch ? parseInt(communicationMatch[1]) : 70;

    return {
      score: Math.min(100, Math.max(1, score)),
      feedback: content,
      strengths: this.extractStrengths(content),
      weaknesses: this.extractWeaknesses(content),
      suggestions: this.extractSuggestions(content),
      confidence: Math.min(100, Math.max(1, confidence)),
      communication: Math.min(100, Math.max(1, communication)),
    };
  }

  private extractStrengths(content: string): string[] {
    const strengthsMatch = content.match(/strengths?[:\s]*(.*?)(?=\n|weaknesses?|suggestions?|$)/is);
    if (strengthsMatch) {
      return strengthsMatch[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    return ['Good technical understanding', 'Clear communication'];
  }

  private extractWeaknesses(content: string): string[] {
    const weaknessesMatch = content.match(/weaknesses?[:\s]*(.*?)(?=\n|strengths?|suggestions?|$)/is);
    if (weaknessesMatch) {
      return weaknessesMatch[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    return ['Could provide more specific examples'];
  }

  private extractSuggestions(content: string): string[] {
    const suggestionsMatch = content.match(/suggestions?[:\s]*(.*?)(?=\n|strengths?|weaknesses?|$)/is);
    if (suggestionsMatch) {
      return suggestionsMatch[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    return ['Practice with more specific examples', 'Focus on STAR format for behavioral questions'];
  }

  async generateFollowUpQuestion(previousQuestion: string, userAnswer: string): Promise<string> {
    const prompt = `Based on this answer: "${userAnswer}" to the question: "${previousQuestion}", 
    generate a follow-up question that digs deeper or explores a related aspect. 
    Make it relevant to the ${this.config.role} role at ${this.config.company}.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Could not generate follow-up question.';
  }

  async provideHint(question: string, userStuck: boolean): Promise<string> {
    const prompt = `The candidate is stuck on this question: "${question}". 
    Provide a helpful hint that guides them without giving away the complete answer. 
    Make it encouraging and constructive.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    return response.choices[0]?.message?.content || 'Try breaking down the problem into smaller steps.';
  }
}

export default AIInterviewer;