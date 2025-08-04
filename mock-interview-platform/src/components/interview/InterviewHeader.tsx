'use client';

import { InterviewConfig } from '@/types';
import { Clock, SkipForward, AlertCircle } from 'lucide-react';

interface InterviewHeaderProps {
  config: InterviewConfig;
  timeRemaining: number;
  sessionStatus: 'loading' | 'active' | 'completed';
  skipCount: number;
  onSkip: () => void;
}

export default function InterviewHeader({
  config,
  timeRemaining,
  sessionStatus,
  skipCount,
  onSkip,
}: InterviewHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = config.duration * 60;
    const elapsed = totalTime - timeRemaining;
    return Math.min((elapsed / totalTime) * 100, 100);
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600'; // Last 5 minutes
    if (timeRemaining <= 600) return 'text-yellow-600'; // Last 10 minutes
    return 'text-gray-600';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Interview Info */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {config.role} Interview at {config.company}
            </h1>
            <p className="text-sm text-gray-600">
              {config.roundTypes.join(', ')} • {config.duration} minutes
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              sessionStatus === 'active' ? 'bg-green-100 text-green-700' :
              sessionStatus === 'completed' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {sessionStatus === 'active' ? 'In Progress' :
               sessionStatus === 'completed' ? 'Completed' : 'Loading'}
            </span>
          </div>
        </div>

        {/* Timer and Controls */}
        <div className="flex items-center gap-4">
          {/* Skip Counter */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <SkipForward className="w-4 h-4" />
            <span>Skips: {skipCount}/3</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div className="text-right">
              <div className={`text-lg font-mono font-semibold ${getTimeColor()}`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-gray-500">
                {sessionStatus === 'active' ? 'Time remaining' : 'Interview timer'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-32">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              {Math.round(getProgressPercentage())}% complete
            </div>
          </div>

          {/* Skip Button */}
          {sessionStatus === 'active' && skipCount < 3 && (
            <button
              onClick={onSkip}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip Question
            </button>
          )}

          {/* Time Warning */}
          {timeRemaining <= 300 && sessionStatus === 'active' && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700 font-medium">
                Less than 5 minutes remaining!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-gray-600">Current Question</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          <span className="text-gray-600">Upcoming</span>
        </div>
      </div>
    </div>
  );
}