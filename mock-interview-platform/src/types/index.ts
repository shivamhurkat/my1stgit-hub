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
export interface InterviewConfig {
  role: Role;
  company: Company;
  roundTypes: RoundType[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export type Role = 
  | 'Software Engineer'
  | 'Product Manager'
  | 'Data Scientist'
  | 'DevOps Engineer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer';

export type Company = 
  | 'Google'
  | 'Microsoft'
  | 'Amazon'
  | 'Meta'
  | 'Apple'
  | 'Netflix'
  | 'Flipkart'
  | 'Uber'
  | 'Airbnb'
  | 'Stripe';

export type RoundType = 'HR' | 'Coding' | 'System Design' | 'Behavioral';

// Interview Session Types
export interface InterviewSession {
  id: string;
  userId: string;
  config: InterviewConfig;
  status: 'pending' | 'active' | 'completed' | 'paused';
  currentQuestionIndex: number;
  totalQuestions: number;
  startTime: Date;
  endTime?: Date;
  tokensUsed: number;
  questions: InterviewQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  question: string;
  type: 'text' | 'coding' | 'system_design' | 'behavioral';
  userAnswer?: string;
  aiEvaluation?: AIEvaluation;
  timestamp: Date;
  order: number;
}

export interface AIEvaluation {
  score: number; // 1-100
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  confidence: number; // 1-100
  communication: number; // 1-100
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'system_design' | 'voice';
  metadata?: {
    codeLanguage?: string;
    executionResult?: string;
    voiceUrl?: string;
  };
}

// Report Types
export interface InterviewReport {
  sessionId: string;
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
  score: number;
  feedback: string;
  timeSpent: number; // in seconds
}

// Token System Types
export interface TokenTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'consumption' | 'refund';
  amount: number;
  description: string;
  sessionId?: string;
  createdAt: Date;
}

// Voice Types
export interface VoiceMessage {
  id: string;
  sessionId: string;
  audioUrl: string;
  transcript: string;
  duration: number; // in seconds
  timestamp: Date;
}

// Whiteboard Types
export interface WhiteboardData {
  id: string;
  sessionId: string;
  elements: any[]; // Excalidraw elements
  appState: any; // Excalidraw app state
  timestamp: Date;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface InterviewPanelProps {
  session: InterviewSession;
  onQuestionComplete: (questionId: string, answer: string) => void;
  onSessionEnd: () => void;
}

export interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  readOnly?: boolean;
}

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onVoiceMessage: () => void;
  isLoading: boolean;
}