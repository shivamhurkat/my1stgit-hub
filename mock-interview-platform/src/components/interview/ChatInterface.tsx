'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  loading: boolean;
  voiceEnabled: boolean;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  loading,
  voiceEnabled,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !loading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleVoiceInput = () => {
    if (!voiceEnabled) {
      alert('Voice input is not enabled. Please enable it in the sidebar.');
      return;
    }

    setIsRecording(!isRecording);
    // TODO: Implement voice recording and transcription
    // This would integrate with Web Speech API or a service like ElevenLabs
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isAI = message.type === 'ai';
    const hasEvaluation = message.metadata?.evaluation;

    return (
      <div
        key={message.id}
        className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg px-4 py-3 ${
            isAI
              ? 'bg-white border border-gray-200 shadow-sm'
              : 'bg-blue-600 text-white'
          }`}
        >
          <div className="flex items-start gap-3">
            {isAI && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">AI</span>
              </div>
            )}
            <div className="flex-1">
              <div className="whitespace-pre-wrap">{message.content}</div>
              {hasEvaluation && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Score:</span>
                    <span className={`text-sm font-bold ${
                      hasEvaluation.score >= 80 ? 'text-green-600' :
                      hasEvaluation.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {hasEvaluation.score}/100
                    </span>
                  </div>
                  {hasEvaluation.strengths.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-green-600">Strengths:</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {hasEvaluation.strengths.map((strength, index) => (
                          <span key={index} className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded mr-1 mb-1">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasEvaluation.weaknesses.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-red-600">Areas for improvement:</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {hasEvaluation.weaknesses.map((weakness, index) => (
                          <span key={index} className="inline-block bg-red-50 text-red-700 px-2 py-1 rounded mr-1 mb-1">
                            {weakness}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-2xl">👋</span>
            </div>
            <p className="text-lg font-medium">Welcome to your interview!</p>
            <p className="text-sm">The AI interviewer will start the conversation shortly.</p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your response..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            {voiceEnabled && (
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={loading}
                className={`p-3 rounded-lg border transition-colors ${
                  isRecording
                    ? 'bg-red-100 border-red-300 text-red-600'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        
        {!voiceEnabled && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Enable voice input in the sidebar for hands-free responses
          </p>
        )}
      </div>
    </div>
  );
}