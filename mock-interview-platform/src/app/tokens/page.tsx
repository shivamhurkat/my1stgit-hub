'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { TokenManager, TOKEN_COSTS } from '@/lib/tokens';
import { CreditCard, Gift, TrendingUp, Users } from 'lucide-react';

export default function TokensPage() {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadTokenInfo();
    }
  }, [isLoaded, user]);

  const loadTokenInfo = async () => {
    try {
      const balance = await TokenManager.getTokenBalance(user!.id);
      const transactions = await TokenManager.getTransactionHistory(user!.id, 10);
      setBalance(balance);
      setTransactions(transactions);
    } catch (error) {
      console.error('Error loading token info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (amount: number) => {
    // TODO: Integrate with Stripe for actual payments
    alert(`Purchase ${amount} tokens - Stripe integration coming soon!`);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Token Management</h1>
          <p className="text-xl text-gray-600">
            Manage your interview credits and purchase more tokens
          </p>
        </div>

        {/* Current Balance */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Balance</h2>
            <div className="text-6xl font-bold text-blue-600 mb-4">{balance}</div>
            <p className="text-gray-600">tokens available</p>
          </div>
        </div>

        {/* Token Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter Pack</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">50 Tokens</div>
              <div className="text-2xl font-bold text-gray-900 mb-6">$9.99</div>
              <button
                onClick={() => handlePurchase(50)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Purchase
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Pack</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">150 Tokens</div>
              <div className="text-2xl font-bold text-gray-900 mb-6">$24.99</div>
              <button
                onClick={() => handlePurchase(150)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Purchase
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Pack</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">500 Tokens</div>
              <div className="text-2xl font-bold text-gray-900 mb-6">$79.99</div>
              <button
                onClick={() => handlePurchase(500)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Purchase
              </button>
            </div>
          </div>
        </div>

        {/* Token Costs */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Token Costs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">🎯</span>
                  </div>
                  <span className="font-medium">Mock Interview</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{TOKEN_COSTS.mockInterview} tokens</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-semibold">⏭️</span>
                  </div>
                  <span className="font-medium">Skip Question</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{TOKEN_COSTS.skipQuestion} token</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">🎨</span>
                  </div>
                  <span className="font-medium">Whiteboard</span>
                </div>
                <span className="text-lg font-bold text-green-600">{TOKEN_COSTS.whiteboard} token</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">🎤</span>
                  </div>
                  <span className="font-medium">Voice Analysis</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{TOKEN_COSTS.voiceAnalysis} token</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-semibold">❓</span>
                  </div>
                  <span className="font-medium">Follow-up Questions</span>
                </div>
                <span className="text-lg font-bold text-red-600">{TOKEN_COSTS.followUpQuestion} token</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'purchase' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'purchase' ? (
                        <Gift className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'purchase' ? '+' : ''}{transaction.amount} tokens
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referral Program */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mt-8">
          <div className="text-center text-white">
            <h2 className="text-2xl font-semibold mb-4">Refer Friends & Earn Tokens</h2>
            <p className="text-blue-100 mb-6">
              Share your referral link and earn 5 tokens for each friend who signs up
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                <Users className="w-5 h-5" />
                <span>0 referrals</span>
              </div>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Copy Referral Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}