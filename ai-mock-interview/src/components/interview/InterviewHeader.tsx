'use client';

import { useInterviewStore } from '@/stores/interview-store';
import { Brain, Building2, User } from 'lucide-react';

export default function InterviewHeader() {
  const { currentSession } = useInterviewStore();

  if (!currentSession) return null;

  const { config } = currentSession;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-900">AI Interview</span>
          </div>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{config.company}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span className="font-medium">{config.role}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {config.types.map((type, index) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-md"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="font-medium">Difficulty:</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${
            config.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            config.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {config.difficulty}
          </span>
        </div>
      </div>
    </header>
  );
}