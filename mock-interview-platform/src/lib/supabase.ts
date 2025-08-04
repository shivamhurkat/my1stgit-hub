import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const db = {
  // User management
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserTokens(userId: string, tokens: number) {
    const { data, error } = await supabase
      .from('users')
      .update({ tokens })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Interview sessions
  async createInterviewSession(session: Omit<Database['public']['Tables']['interview_sessions']['Insert'], 'id'>) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getInterviewSession(sessionId: string) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select(`
        *,
        questions:interview_questions(*),
        responses:interview_responses(*)
      `)
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateInterviewSession(sessionId: string, updates: Partial<Database['public']['Tables']['interview_sessions']['Update']>) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Interview responses
  async saveInterviewResponse(response: Omit<Database['public']['Tables']['interview_responses']['Insert'], 'id'>) {
    const { data, error } = await supabase
      .from('interview_responses')
      .insert(response)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Token transactions
  async createTokenTransaction(transaction: Omit<Database['public']['Tables']['token_transactions']['Insert'], 'id'>) {
    const { data, error } = await supabase
      .from('token_transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Reports
  async saveInterviewReport(report: Omit<Database['public']['Tables']['interview_reports']['Insert'], 'id'>) {
    const { data, error } = await supabase
      .from('interview_reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getInterviewReport(reportId: string) {
    const { data, error } = await supabase
      .from('interview_reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // User sessions
  async getUserSessions(userId: string) {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};