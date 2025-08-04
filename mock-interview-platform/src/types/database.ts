export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          tokens: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          tokens?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          tokens?: number
          created_at?: string
          updated_at?: string
        }
      }
      interview_sessions: {
        Row: {
          id: string
          user_id: string
          config: Json
          status: string
          start_time: string
          end_time: string | null
          current_question_index: number
          tokens_used: number
          score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          config: Json
          status?: string
          start_time?: string
          end_time?: string | null
          current_question_index?: number
          tokens_used?: number
          score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          config?: Json
          status?: string
          start_time?: string
          end_time?: string | null
          current_question_index?: number
          tokens_used?: number
          score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      interview_questions: {
        Row: {
          id: string
          session_id: string
          type: string
          question: string
          context: string | null
          code_template: string | null
          expected_answer: string | null
          difficulty: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          type: string
          question: string
          context?: string | null
          code_template?: string | null
          expected_answer?: string | null
          difficulty?: string
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          type?: string
          question?: string
          context?: string | null
          code_template?: string | null
          expected_answer?: string | null
          difficulty?: string
          category?: string
          created_at?: string
        }
      }
      interview_responses: {
        Row: {
          id: string
          session_id: string
          question_id: string
          answer: string
          code: string | null
          evaluation: Json
          timestamp: string
          duration: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          answer: string
          code?: string | null
          evaluation: Json
          timestamp?: string
          duration?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string
          answer?: string
          code?: string | null
          evaluation?: Json
          timestamp?: string
          duration?: number
          created_at?: string
        }
      }
      token_transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          description: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          description: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          description?: string
          timestamp?: string
          created_at?: string
        }
      }
      interview_reports: {
        Row: {
          id: string
          session_id: string
          user_id: string
          overall_score: number
          breakdown: Json
          strengths: string[]
          weaknesses: string[]
          recommendations: string[]
          question_analysis: Json
          generated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          overall_score: number
          breakdown: Json
          strengths: string[]
          weaknesses: string[]
          recommendations: string[]
          question_analysis: Json
          generated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          overall_score?: number
          breakdown?: Json
          strengths?: string[]
          weaknesses?: string[]
          recommendations?: string[]
          question_analysis?: Json
          generated_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}