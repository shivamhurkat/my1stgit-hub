// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  tokens: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interview Configuration Types
export type Role = 'SDE' | 'Product Manager' | 'Data Scientist' | 'DevOps Engineer' | 'Frontend Developer' | 'Backend Developer';
export type Company = 'Google' | 'Microsoft' | 'Amazon' | 'Meta' | 'Apple' | 'Netflix' | 'Flipkart' | 'Uber' | 'Airbnb' | 'Stripe';
export type RoundType = 'HR' | 'Coding' | 'System Design' | 'Behavioral' | 'Technical';

export interface InterviewConfig {
  role: Role;
  company: Company;
  roundTypes: RoundType[];
  duration: number; // in minutes
}

// Interview Session Types
export interface InterviewSession {
  id: string;
  userId: string;
  config: InterviewConfig;
  status: 'pending' | 'active' | 'completed' | 'paused';
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  tokensUsed: number;
  score?: number;
}

export interface InterviewQuestion {
  id: string;
  type: RoundType;
  question: string;
  context?: string;
  codeTemplate?: string;
  expectedAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface InterviewResponse {
  id: string;
  questionId: string;
  answer: string;
  code?: string;
  evaluation: AIEvaluation;
  timestamp: Date;
  duration: number; // in seconds
}

export interface AIEvaluation {
  score: number; // 0-100
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  confidence: number; // 0-100
  communication: number; // 0-100
}

// Chat and Communication Types
export interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    questionId?: string;
    evaluation?: AIEvaluation;
    code?: string;
    voiceUrl?: string;
  };
}

// Token System Types
export interface TokenTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'consumption' | 'refund';
  amount: number;
  description: string;
  timestamp: Date;
}

// Report Types
export interface InterviewReport {
  sessionId: string;
  userId: string;
  overallScore: number;
  breakdown: {
    technical: number;
    communication: number;
    problemSolving: number;
    confidence: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  questionAnalysis: QuestionAnalysis[];
  generatedAt: Date;
}

export interface QuestionAnalysis {
  questionId: string;
  question: string;
  userAnswer: string;
  evaluation: AIEvaluation;
  category: string;
}

// Voice and Audio Types
export interface VoiceConfig {
  enabled: boolean;
  voiceId: string;
  speed: number;
  pitch: number;
}

// Whiteboard Types
export interface WhiteboardData {
  elements: any[];
  appState: any;
  files: any;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: 'question' | 'evaluation' | 'feedback' | 'timer' | 'voice';
  data: any;
  timestamp: Date;
}