import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  INTERVIEW_SESSIONS: 'interview_sessions',
  INTERVIEW_QUESTIONS: 'interview_questions',
  CHAT_MESSAGES: 'chat_messages',
  TOKEN_TRANSACTIONS: 'token_transactions',
  VOICE_MESSAGES: 'voice_messages',
  WHITEBOARD_DATA: 'whiteboard_data',
  INTERVIEW_REPORTS: 'interview_reports',
} as const;

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          tokens: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          tokens?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          tokens?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      interview_sessions: {
        Row: {
          id: string;
          user_id: string;
          config: any;
          status: string;
          current_question_index: number;
          total_questions: number;
          start_time: string;
          end_time?: string;
          tokens_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          config: any;
          status?: string;
          current_question_index?: number;
          total_questions?: number;
          start_time?: string;
          end_time?: string;
          tokens_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          config?: any;
          status?: string;
          current_question_index?: number;
          total_questions?: number;
          start_time?: string;
          end_time?: string;
          tokens_used?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      interview_questions: {
        Row: {
          id: string;
          session_id: string;
          question: string;
          type: string;
          user_answer?: string;
          ai_evaluation?: any;
          timestamp: string;
          order: number;
        };
        Insert: {
          id?: string;
          session_id: string;
          question: string;
          type: string;
          user_answer?: string;
          ai_evaluation?: any;
          timestamp?: string;
          order: number;
        };
        Update: {
          id?: string;
          session_id?: string;
          question?: string;
          type?: string;
          user_answer?: string;
          ai_evaluation?: any;
          timestamp?: string;
          order?: number;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          timestamp: string;
          type: string;
          metadata?: any;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: string;
          content: string;
          timestamp?: string;
          type: string;
          metadata?: any;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: string;
          content?: string;
          timestamp?: string;
          type?: string;
          metadata?: any;
        };
      };
      token_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          description: string;
          session_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          amount: number;
          description: string;
          session_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          amount?: number;
          description?: string;
          session_id?: string;
          created_at?: string;
        };
      };
    };
  };
}