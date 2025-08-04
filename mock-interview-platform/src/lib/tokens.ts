import { db } from './supabase';

export interface TokenCost {
  mockInterview: number;
  skipQuestion: number;
  voiceAnalysis: number;
  whiteboard: number;
  followUpQuestion: number;
}

export const TOKEN_COSTS: TokenCost = {
  mockInterview: 2,
  skipQuestion: 1,
  voiceAnalysis: 1,
  whiteboard: 1,
  followUpQuestion: 1,
};

export class TokenManager {
  // Check if user has enough tokens for an action
  static async hasEnoughTokens(userId: string, action: keyof TokenCost): Promise<boolean> {
    try {
      const user = await db.getUser(userId);
      const requiredTokens = TOKEN_COSTS[action];
      return user.tokens >= requiredTokens;
    } catch (error) {
      console.error('Error checking token balance:', error);
      return false;
    }
  }

  // Consume tokens for an action
  static async consumeTokens(
    userId: string,
    action: keyof TokenCost,
    description: string
  ): Promise<boolean> {
    try {
      const user = await db.getUser(userId);
      const requiredTokens = TOKEN_COSTS[action];
      
      if (user.tokens < requiredTokens) {
        return false;
      }

      const newBalance = user.tokens - requiredTokens;
      
      // Update user token balance
      await db.updateUserTokens(userId, newBalance);
      
      // Record transaction
      await db.createTokenTransaction({
        user_id: userId,
        type: 'consumption',
        amount: -requiredTokens,
        description,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error consuming tokens:', error);
      return false;
    }
  }

  // Add tokens to user account
  static async addTokens(
    userId: string,
    amount: number,
    description: string
  ): Promise<boolean> {
    try {
      const user = await db.getUser(userId);
      const newBalance = user.tokens + amount;
      
      // Update user token balance
      await db.updateUserTokens(userId, newBalance);
      
      // Record transaction
      await db.createTokenTransaction({
        user_id: userId,
        type: 'purchase',
        amount,
        description,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error adding tokens:', error);
      return false;
    }
  }

  // Get user's token balance
  static async getTokenBalance(userId: string): Promise<number> {
    try {
      const user = await db.getUser(userId);
      return user.tokens;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  // Get user's transaction history
  static async getTransactionHistory(userId: string, limit: number = 10) {
    try {
      const { data, error } = await db.supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  // Check if user can start a mock interview
  static async canStartMockInterview(userId: string): Promise<{
    canStart: boolean;
    currentBalance: number;
    requiredTokens: number;
  }> {
    const currentBalance = await this.getTokenBalance(userId);
    const requiredTokens = TOKEN_COSTS.mockInterview;
    
    return {
      canStart: currentBalance >= requiredTokens,
      currentBalance,
      requiredTokens,
    };
  }

  // Get token costs for display
  static getTokenCosts(): TokenCost {
    return TOKEN_COSTS;
  }

  // Calculate total cost for a session with features
  static calculateSessionCost(features: {
    skipQuestions: number;
    voiceAnalysis: boolean;
    whiteboard: boolean;
    followUpQuestions: number;
  }): number {
    let totalCost = TOKEN_COSTS.mockInterview;
    
    totalCost += features.skipQuestions * TOKEN_COSTS.skipQuestion;
    totalCost += features.voiceAnalysis ? TOKEN_COSTS.voiceAnalysis : 0;
    totalCost += features.whiteboard ? TOKEN_COSTS.whiteboard : 0;
    totalCost += features.followUpQuestions * TOKEN_COSTS.followUpQuestion;
    
    return totalCost;
  }

  // Validate if user can use a specific feature
  static async canUseFeature(
    userId: string,
    feature: keyof TokenCost
  ): Promise<{
    canUse: boolean;
    currentBalance: number;
    requiredTokens: number;
  }> {
    const currentBalance = await this.getTokenBalance(userId);
    const requiredTokens = TOKEN_COSTS[feature];
    
    return {
      canUse: currentBalance >= requiredTokens,
      currentBalance,
      requiredTokens,
    };
  }
}