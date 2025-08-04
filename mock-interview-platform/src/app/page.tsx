'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Role, Company, RoundType, InterviewConfig } from '@/types';
import { TokenManager } from '@/lib/tokens';
import React from 'react'; // Added missing import for React

const ROLES: Role[] = [
  'SDE',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
];

const COMPANIES: Company[] = [
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'Apple',
  'Netflix',
  'Flipkart',
  'Uber',
  'Airbnb',
  'Stripe',
];

const ROUND_TYPES: RoundType[] = ['HR', 'Coding', 'System Design', 'Behavioral', 'Technical'];

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [config, setConfig] = useState<Partial<InterviewConfig>>({
    role: 'SDE',
    company: 'Google',
    roundTypes: ['Coding'],
    duration: 30,
  });
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{
    canStart: boolean;
    currentBalance: number;
    requiredTokens: number;
  } | null>(null);

  // Check token balance when user is loaded
  React.useEffect(() => {
    if (isLoaded && user) {
      checkTokenBalance();
    }
  }, [isLoaded, user]);

  const checkTokenBalance = async () => {
    if (!user) return;
    
    const tokenCheck = await TokenManager.canStartMockInterview(user.id);
    setTokenInfo(tokenCheck);
  };

  const handleConfigChange = (key: keyof InterviewConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRoundTypeToggle = (roundType: RoundType) => {
    setConfig(prev => ({
      ...prev,
      roundTypes: prev.roundTypes?.includes(roundType)
        ? prev.roundTypes?.filter(rt => rt !== roundType)
        : [...(prev.roundTypes || []), roundType],
    }));
  };

  const handleStartInterview = async () => {
    if (!user || !tokenInfo?.canStart) return;

    setLoading(true);
    try {
      // Consume tokens for the interview
      const success = await TokenManager.consumeTokens(
        user.id,
        'mockInterview',
        `Mock interview for ${config.role} at ${config.company}`
      );

      if (success) {
        // Navigate to interview page with config
        router.push(`/interview?config=${encodeURIComponent(JSON.stringify(config))}`);
      } else {
        alert('Failed to start interview. Please check your token balance.');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Mock Interview Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice interviews with AI-powered feedback and evaluation
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Mock Interview Platform
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Practice interviews with AI-powered feedback and evaluation
          </p>
          {tokenInfo && (
            <div className="inline-flex items-center gap-4 bg-white rounded-lg px-6 py-3 shadow-sm">
              <span className="text-gray-600">Tokens:</span>
              <span className={`font-semibold ${tokenInfo.canStart ? 'text-green-600' : 'text-red-600'}`}>
                {tokenInfo.currentBalance} / {tokenInfo.requiredTokens}
              </span>
              {!tokenInfo.canStart && (
                <button
                  onClick={() => router.push('/tokens')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Get More Tokens
                </button>
              )}
            </div>
          )}
        </div>

        {/* Interview Configuration */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Configure Your Interview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleConfigChange('role', role)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      config.role === role
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Company
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COMPANIES.map((company) => (
                  <button
                    key={company}
                    onClick={() => handleConfigChange('company', company)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      config.company === company
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Round Types */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Interview Rounds
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {ROUND_TYPES.map((roundType) => (
                <button
                  key={roundType}
                  onClick={() => handleRoundTypeToggle(roundType)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    config.roundTypes?.includes(roundType)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {roundType}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Interview Duration: {config.duration} minutes
            </label>
            <input
              type="range"
              min="15"
              max="60"
              step="15"
              value={config.duration}
              onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>15 min</span>
              <span>30 min</span>
              <span>45 min</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Start Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleStartInterview}
              disabled={loading || !tokenInfo?.canStart || !config.roundTypes?.length}
              className={`px-8 py-4 rounded-lg text-lg font-semibold transition-colors ${
                loading || !tokenInfo?.canStart || !config.roundTypes?.length
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Starting Interview...' : 'Start Mock Interview'}
            </button>
            
            {!tokenInfo?.canStart && (
              <p className="text-red-600 text-sm mt-2">
                Insufficient tokens. You need {tokenInfo?.requiredTokens} tokens to start.
              </p>
            )}
            
            {!config.roundTypes?.length && (
              <p className="text-red-600 text-sm mt-2">
                Please select at least one interview round.
              </p>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="max-w-4xl mx-auto mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Sessions</h3>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-center py-8">
              No recent sessions. Start your first mock interview!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
