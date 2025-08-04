'use client';

import { useInterviewStore } from '@/stores/interview-store';
import { Clock } from 'lucide-react';

export default function InterviewTimer() {
  const { timeElapsed, currentSession } = useInterviewStore();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    if (!currentSession) return 0;
    const totalTime = currentSession.config.duration * 60; // Convert minutes to seconds
    return Math.max(0, totalTime - timeElapsed);
  };

  const remainingTime = getRemainingTime();
  const isUrgent = remainingTime < 300; // Less than 5 minutes

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-500' : 'text-gray-500'}`} />
      <div className="text-sm">
        <div className={`font-mono font-medium ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
          {formatTime(remainingTime)}
        </div>
        <div className="text-xs text-gray-500">remaining</div>
      </div>
    </div>
  );
}