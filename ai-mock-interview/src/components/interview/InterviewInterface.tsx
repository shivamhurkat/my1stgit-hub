'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/stores/interview-store';
import ChatPanel from './ChatPanel';
import CodeEditor from './CodeEditor';
import Whiteboard from './Whiteboard';
import NotesPanel from './NotesPanel';
import InterviewHeader from './InterviewHeader';
import InterviewTimer from './InterviewTimer';
import { Code, PenTool, FileText, MessageSquare, SkipForward, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterviewInterface() {
  const router = useRouter();
  const { 
    currentSession, 
    isSessionActive, 
    uiState, 
    setCurrentView,
    skipQuestion,
    endSession
  } = useInterviewStore();

  useEffect(() => {
    // If no active session, redirect to dashboard
    if (!currentSession) {
      router.push('/dashboard');
      return;
    }

    // Initialize first question
    // TODO: Send first AI message with initial question
  }, [currentSession, router]);

  const handleViewChange = (view: typeof uiState.currentView) => {
    setCurrentView(view);
  };

  const handleSkip = () => {
    if (currentSession && currentSession.skipCount < currentSession.maxSkips) {
      skipQuestion();
      toast.success('Question skipped');
    } else {
      toast.error('No more skips available');
    }
  };

  const handleEndInterview = () => {
    if (window.confirm('Are you sure you want to end the interview?')) {
      endSession();
      router.push('/report');
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <InterviewHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">AI Interviewer</h2>
              <InterviewTimer />
            </div>
          </div>
          <ChatPanel />
        </div>

        {/* Right Panel - Switchable Content */}
        <div className="w-1/2 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex space-x-1">
              <button
                onClick={() => handleViewChange('chat')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  uiState.currentView === 'chat'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Notes
              </button>
              
              {currentQuestion?.type === 'Coding' && (
                <button
                  onClick={() => handleViewChange('code')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    uiState.currentView === 'code'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Code className="h-4 w-4 inline mr-1" />
                  Code Editor
                </button>
              )}

              {currentQuestion?.type === 'System Design' && (
                <button
                  onClick={() => handleViewChange('whiteboard')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    uiState.currentView === 'whiteboard'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <PenTool className="h-4 w-4 inline mr-1" />
                  Whiteboard
                </button>
              )}

              <button
                onClick={() => handleViewChange('notes')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  uiState.currentView === 'notes'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-1" />
                Notes
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {uiState.currentView === 'code' && <CodeEditor />}
            {uiState.currentView === 'whiteboard' && <Whiteboard />}
            {uiState.currentView === 'notes' && <NotesPanel />}
            {uiState.currentView === 'chat' && <NotesPanel />}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
            </div>
            <div className="text-sm text-gray-600">
              Skips: {currentSession.skipCount}/{currentSession.maxSkips}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              disabled={currentSession.skipCount >= currentSession.maxSkips}
              className="px-4 py-2 text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <SkipForward className="h-4 w-4" />
              <span>Skip Question</span>
            </button>

            <button
              onClick={handleEndInterview}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Flag className="h-4 w-4" />
              <span>End Interview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}