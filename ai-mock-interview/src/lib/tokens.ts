import { TokenTransaction } from '@/types';

// Token costs configuration
export const TOKEN_COSTS = {
  MOCK_INTERVIEW: parseInt(process.env.MOCK_INTERVIEW_COST || '2'),
  SKIP_QUESTION: parseInt(process.env.SKIP_QUESTION_COST || '1'),
  VOICE_ANALYSIS: parseInt(process.env.VOICE_ANALYSIS_COST || '1'),
  WHITEBOARD: parseInt(process.env.WHITEBOARD_COST || '1'),
} as const;

export const DEFAULT_USER_TOKENS = parseInt(process.env.DEFAULT_USER_TOKENS || '10');

// Token validation functions
export function hasEnoughTokens(userTokens: number, requiredTokens: number): boolean {
  return userTokens >= requiredTokens;
}

export function calculateInterviewCost(
  interviewTypes: string[],
  features: {
    hasWhiteboard?: boolean;
    hasVoiceAnalysis?: boolean;
  } = {}
): number {
  let totalCost = TOKEN_COSTS.MOCK_INTERVIEW;
  
  if (features.hasWhiteboard) {
    totalCost += TOKEN_COSTS.WHITEBOARD;
  }
  
  if (features.hasVoiceAnalysis) {
    totalCost += TOKEN_COSTS.VOICE_ANALYSIS;
  }
  
  return totalCost;
}

export function calculateSkipCost(skipCount: number): number {
  return skipCount * TOKEN_COSTS.SKIP_QUESTION;
}

// Token transaction helpers
export function createTokenTransaction(
  userId: string,
  type: 'debit' | 'credit',
  amount: number,
  reason: TokenTransaction['reason'],
  sessionId?: string
): Omit<TokenTransaction, 'id'> {
  return {
    userId,
    type,
    amount,
    reason,
    sessionId,
    timestamp: new Date(),
  };
}

// Token pack configurations
export const TOKEN_PACKS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 20,
    price: 999, // $9.99
    isPopular: false,
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    tokens: 50,
    price: 1999, // $19.99
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    tokens: 100,
    price: 3499, // $34.99
    isPopular: false,
  },
] as const;

// Utility to format token amounts
export function formatTokens(amount: number): string {
  return `${amount} token${amount !== 1 ? 's' : ''}`;
}

// Utility to get token cost description
export function getTokenCostDescription(reason: TokenTransaction['reason']): string {
  switch (reason) {
    case 'mock_interview':
      return 'Mock Interview Session';
    case 'skip_question':
      return 'Skip Question';
    case 'voice_analysis':
      return 'Voice Analysis';
    case 'whiteboard':
      return 'Whiteboard Access';
    case 'purchase':
      return 'Token Purchase';
    case 'bonus':
      return 'Bonus Tokens';
    default:
      return 'Token Transaction';
  }
}