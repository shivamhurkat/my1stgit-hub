import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';
import TokenManager from '@/lib/tokenManager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const tokenManager = new TokenManager(userId);
    const tokens = await tokenManager.getUserTokens();
    const transactions = await tokenManager.getTransactionHistory();

    return NextResponse.json({
      success: true,
      data: {
        tokens,
        transactions,
      }
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, amount, description, sessionId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const tokenManager = new TokenManager(userId);

    switch (action) {
      case 'consume':
        if (!amount || !description) {
          return NextResponse.json(
            { success: false, error: 'Amount and description required' },
            { status: 400 }
          );
        }

        const consumed = await tokenManager.consumeTokens(amount, description, sessionId);
        if (!consumed) {
          return NextResponse.json(
            { success: false, error: 'Insufficient tokens' },
            { status: 400 }
          );
        }

        const remainingTokens = await tokenManager.getUserTokens();
        return NextResponse.json({
          success: true,
          data: {
            tokens: remainingTokens,
            consumed: amount,
          }
        });

      case 'add':
        if (!amount || !description) {
          return NextResponse.json(
            { success: false, error: 'Amount and description required' },
            { status: 400 }
          );
        }

        const added = await tokenManager.addTokens(amount, description, sessionId);
        if (!added) {
          return NextResponse.json(
            { success: false, error: 'Failed to add tokens' },
            { status: 500 }
          );
        }

        const newTokenCount = await tokenManager.getUserTokens();
        return NextResponse.json({
          success: true,
          data: {
            tokens: newTokenCount,
            added: amount,
          }
        });

      case 'refund':
        if (!amount || !description) {
          return NextResponse.json(
            { success: false, error: 'Amount and description required' },
            { status: 400 }
          );
        }

        const refunded = await tokenManager.refundTokens(amount, description, sessionId);
        if (!refunded) {
          return NextResponse.json(
            { success: false, error: 'Failed to refund tokens' },
            { status: 500 }
          );
        }

        const refundedTokenCount = await tokenManager.getUserTokens();
        return NextResponse.json({
          success: true,
          data: {
            tokens: refundedTokenCount,
            refunded: amount,
          }
        });

      case 'initialize':
        const initialized = await tokenManager.initializeUser(10); // Default 10 tokens
        if (!initialized) {
          return NextResponse.json(
            { success: false, error: 'Failed to initialize user' },
            { status: 500 }
          );
        }

        const initialTokens = await tokenManager.getUserTokens();
        return NextResponse.json({
          success: true,
          data: {
            tokens: initialTokens,
            initialized: true,
          }
        });

      case 'check_affordability':
        if (!amount) {
          return NextResponse.json(
            { success: false, error: 'Amount required' },
            { status: 400 }
          );
        }

        const canAfford = await tokenManager.canAfford(amount as any);
        const currentTokens = await tokenManager.getUserTokens();
        
        return NextResponse.json({
          success: true,
          data: {
            canAfford,
            tokens: currentTokens,
            required: TokenManager.getCost(amount as any),
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Token API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}