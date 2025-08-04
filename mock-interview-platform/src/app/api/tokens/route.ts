import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { TokenManager } from '@/lib/tokens';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const balance = await TokenManager.getTokenBalance(userId);
    const transactions = await TokenManager.getTransactionHistory(userId, 10);
    const costs = TokenManager.getTokenCosts();

    return NextResponse.json({
      success: true,
      balance,
      transactions,
      costs,
    });

  } catch (error) {
    console.error('Error fetching token information:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, amount, description } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action required' }, { status: 400 });
    }

    let success = false;

    if (action === 'consume') {
      const { feature, description: desc } = body;
      if (!feature) {
        return NextResponse.json({ error: 'Feature required for consumption' }, { status: 400 });
      }
      success = await TokenManager.consumeTokens(userId, feature, desc || description);
    } else if (action === 'add') {
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Valid amount required' }, { status: 400 });
      }
      success = await TokenManager.addTokens(userId, amount, description || 'Token purchase');
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!success) {
      return NextResponse.json({ error: 'Failed to process token transaction' }, { status: 500 });
    }

    const newBalance = await TokenManager.getTokenBalance(userId);

    return NextResponse.json({
      success: true,
      balance: newBalance,
    });

  } catch (error) {
    console.error('Error processing token transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}