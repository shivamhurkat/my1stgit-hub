'use client';

import { InterviewConfig, InterviewQuestion } from '@/types';
import { MessageSquare, Code, Palette, Settings, Mic, MicOff, Download } from 'lucide-react';

interface InterviewSidebarProps {
  config: InterviewConfig;
  currentQuestion: InterviewQuestion | null;
  questions: InterviewQuestion[];
  responses: any[];
  tokensUsed: number;
  voiceEnabled: boolean;
  whiteboardEnabled: boolean;
  onToggleVoice: () => void;
  onToggleWhiteboard: () => void;
  onViewChange: (view: 'chat' | 'code' | 'whiteboard') => void;
}

export default function InterviewSidebar({
  config,
  currentQuestion,
  questions,
  responses,
  tokensUsed,
  voiceEnabled,
  whiteboardEnabled,
  onToggleVoice,
  onToggleWhiteboard,
  onViewChange,
}: InterviewSidebarProps) {
  const getQuestionStatus = (question: InterviewQuestion) => {
    if (currentQuestion?.id === question.id) return 'current';
    const response = responses.find(r => r.questionId === question.id);
    return response ? 'completed' : 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-blue-600 text-white';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'Coding': return <Code className="w-4 h-4" />;
      case 'System Design': return <Palette className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Interview Panel</h3>
        <div className="text-sm text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Tokens Used:</span>
            <span className="font-medium">{tokensUsed}</span>
          </div>
          <div className="flex justify-between">
            <span>Questions:</span>
            <span className="font-medium">{responses.length}/{questions.length}</span>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">View Mode</h4>
        <div className="space-y-2">
          <button
            onClick={() => onViewChange('chat')}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Chat Interface</span>
          </button>
          
          <button
            onClick={() => onViewChange('code')}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Code className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Code Editor</span>
          </button>
          
          <button
            onClick={() => onViewChange('whiteboard')}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Palette className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Whiteboard</span>
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Features</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {voiceEnabled ? <Mic className="w-5 h-5 text-green-600" /> : <MicOff className="w-5 h-5 text-gray-400" />}
              <span className="text-sm font-medium">Voice Analysis</span>
            </div>
            <button
              onClick={onToggleVoice}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                voiceEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {voiceEnabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className={`w-5 h-5 ${whiteboardEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">Whiteboard</span>
            </div>
            <button
              onClick={onToggleWhiteboard}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                whiteboardEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {whiteboardEnabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Questions</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {questions.map((question, index) => {
            const status = getQuestionStatus(question);
            const response = responses.find(r => r.questionId === question.id);
            
            return (
              <div
                key={question.id}
                className={`p-3 rounded-lg border transition-colors ${
                  status === 'current'
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${getStatusColor(status)}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getQuestionIcon(question.type)}
                      <span className="text-xs font-medium text-gray-500">{question.type}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {question.question}
                    </p>
                    {response && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">
                          Score: {response.evaluation?.score || 0}/100
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Download Session</span>
          </button>
          
          <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}