import { supabase, TABLES } from './supabase';
import { TokenTransaction } from '@/types';

export class TokenManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getUserTokens(): Promise<number> {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('tokens')
      .eq('id', this.userId)
      .single();

    if (error) {
      console.error('Error fetching user tokens:', error);
      return 0;
    }

    return data?.tokens || 0;
  }

  async consumeTokens(amount: number, description: string, sessionId?: string): Promise<boolean> {
    const currentTokens = await this.getUserTokens();
    
    if (currentTokens < amount) {
      return false; // Insufficient tokens
    }

    // Start a transaction
    const { data: userData, error: userError } = await supabase
      .from(TABLES.USERS)
      .update({ tokens: currentTokens - amount })
      .eq('id', this.userId)
      .select()
      .single();

    if (userError) {
      console.error('Error updating user tokens:', userError);
      return false;
    }

    // Record the transaction
    const transaction: Omit<TokenTransaction, 'id' | 'createdAt'> = {
      userId: this.userId,
      type: 'consumption',
      amount: -amount,
      description,
      sessionId,
    };

    const { error: transactionError } = await supabase
      .from(TABLES.TOKEN_TRANSACTIONS)
      .insert(transaction);

    if (transactionError) {
      console.error('Error recording token transaction:', transactionError);
      // Rollback user tokens
      await supabase
        .from(TABLES.USERS)
        .update({ tokens: currentTokens })
        .eq('id', this.userId);
      return false;
    }

    return true;
  }

  async addTokens(amount: number, description: string, sessionId?: string): Promise<boolean> {
    const currentTokens = await this.getUserTokens();

    // Update user tokens
    const { error: userError } = await supabase
      .from(TABLES.USERS)
      .update({ tokens: currentTokens + amount })
      .eq('id', this.userId);

    if (userError) {
      console.error('Error updating user tokens:', userError);
      return false;
    }

    // Record the transaction
    const transaction: Omit<TokenTransaction, 'id' | 'createdAt'> = {
      userId: this.userId,
      type: 'purchase',
      amount,
      description,
      sessionId,
    };

    const { error: transactionError } = await supabase
      .from(TABLES.TOKEN_TRANSACTIONS)
      .insert(transaction);

    if (transactionError) {
      console.error('Error recording token transaction:', transactionError);
      return false;
    }

    return true;
  }

  async refundTokens(amount: number, description: string, sessionId?: string): Promise<boolean> {
    return this.addTokens(amount, `Refund: ${description}`, sessionId);
  }

  async getTransactionHistory(limit: number = 10): Promise<TokenTransaction[]> {
    const { data, error } = await supabase
      .from(TABLES.TOKEN_TRANSACTIONS)
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }

    return data || [];
  }

  // Token consumption rules
  static readonly TOKEN_COSTS = {
    MOCK_INTERVIEW: 2,
    SKIP_QUESTION: 1,
    VOICE_ANALYSIS: 1,
    WHITEBOARD: 1,
    HINT: 1,
    FOLLOW_UP: 1,
  } as const;

  // Check if user can afford a specific action
  async canAfford(action: keyof typeof TokenManager.TOKEN_COSTS): Promise<boolean> {
    const currentTokens = await this.getUserTokens();
    const cost = TokenManager.TOKEN_COSTS[action];
    return currentTokens >= cost;
  }

  // Get cost for a specific action
  static getCost(action: keyof typeof TokenManager.TOKEN_COSTS): number {
    return TokenManager.TOKEN_COSTS[action];
  }

  // Initialize user with default tokens (for new users)
  async initializeUser(defaultTokens: number = 10): Promise<boolean> {
    const { error } = await supabase
      .from(TABLES.USERS)
      .upsert({
        id: this.userId,
        tokens: defaultTokens,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error initializing user tokens:', error);
      return false;
    }

    return true;
  }
}

export default TokenManager;