import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Brain, Settings, History, Coins, Plus } from 'lucide-react';
import InterviewConfigForm from '@/components/interview/InterviewConfigForm';
import TokenBalance from '@/components/ui/TokenBalance';

export default async function Dashboard() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">AI Interview</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <TokenBalance />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Configure your mock interview and start practicing with AI feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interview Configuration */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Settings className="h-5 w-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Configure Interview</h2>
              </div>
              <InterviewConfigForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Interviews Completed</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Practiced</span>
                  <span className="font-semibold">0 hrs</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <History className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-center py-8">
                <p className="text-gray-500">No recent interviews</p>
                <p className="text-sm text-gray-400 mt-1">Start your first interview to see activity here</p>
              </div>
            </div>

            {/* Token Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Coins className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Tokens</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Token Costs:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Mock Interview</span>
                      <span className="font-medium">2 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skip Question</span>
                      <span className="font-medium">1 token</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voice Analysis</span>
                      <span className="font-medium">1 token</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Whiteboard</span>
                      <span className="font-medium">1 token</span>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Buy More Tokens</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}