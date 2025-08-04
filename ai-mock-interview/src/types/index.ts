// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  tokens: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interview Configuration Types
export type InterviewRole = 'SDE' | 'Product Manager' | 'Data Scientist' | 'DevOps Engineer' | 'Frontend Developer' | 'Backend Developer';

export type TargetCompany = 'Google' | 'Meta' | 'Amazon' | 'Microsoft' | 'Apple' | 'Netflix' | 'Uber' | 'Flipkart' | 'Zomato' | 'Swiggy';

export type InterviewType = 'HR' | 'Coding' | 'System Design' | 'Behavioral';

export interface InterviewConfig {
  role: InterviewRole;
  company: TargetCompany;
  types: InterviewType[];
  duration: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Interview Session Types
export interface InterviewSession {
  id: string;
  userId: string;
  config: InterviewConfig;
  status: 'active' | 'completed' | 'paused';
  questions: Question[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime?: Date;
  tokensUsed: number;
  skipCount: number;
  maxSkips: number;
}

export interface Question {
  id: string;
  type: InterviewType;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedAnswer?: string;
  codeTemplate?: string;
  language?: string;
  timeLimit?: number; // in minutes
}

export interface UserResponse {
  id: string;
  questionId: string;
  sessionId: string;
  content: string;
  code?: string;
  language?: string;
  timestamp: Date;
  timeSpent: number; // in seconds
  isSkipped: boolean;
}

// AI Evaluation Types
export interface AIEvaluation {
  id: string;
  responseId: string;
  accuracy: number; // 0-100
  clarity: number; // 0-100
  confidence: number; // 0-100
  completeness: number; // 0-100
  feedback: string;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'question' | 'response' | 'feedback' | 'nudge';
}

// Report Types
export interface InterviewReport {
  id: string;
  sessionId: string;
  userId: string;
  overallScore: number; // 0-100
  scores: {
    accuracy: number;
    clarity: number;
    confidence: number;
    communication: number;
    problemSolving: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  questionsAnswered: number;
  questionsSkipped: number;
  totalTimeSpent: number; // in minutes
  generatedAt: Date;
}

// Token Types
export interface TokenTransaction {
  id: string;
  userId: string;
  type: 'debit' | 'credit';
  amount: number;
  reason: 'mock_interview' | 'skip_question' | 'voice_analysis' | 'whiteboard' | 'purchase' | 'bonus';
  sessionId?: string;
  timestamp: Date;
}

export interface TokenPack {
  id: string;
  name: string;
  tokens: number;
  price: number; // in cents
  isPopular?: boolean;
}

// UI State Types
export interface InterviewUIState {
  currentView: 'chat' | 'code' | 'whiteboard' | 'notes';
  isRecording: boolean;
  timerStarted: boolean;
  showHints: boolean;
  codeLanguage: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Prompt Templates
export interface PromptTemplate {
  id: string;
  type: InterviewType;
  role: InterviewRole;
  company: TargetCompany;
  template: string;
  systemPrompt: string;
}

// Code Execution Types
export interface CodeExecution {
  language: string;
  code: string;
  input?: string;
  output?: string;
  error?: string;
  executionTime?: number;
}

// Whiteboard Types
export interface WhiteboardData {
  elements: any[]; // Excalidraw elements
  appState: any; // Excalidraw app state
}

// Resume Types
export interface Resume {
  id: string;
  userId: string;
  filename: string;
  content: string; // extracted text
  skills: string[];
  experience: number; // years
  uploadedAt: Date;
}