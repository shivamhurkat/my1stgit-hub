'use client';

import { useState, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/stores/interview-store';
import { Send, Mic, MicOff, Bot, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatPanel() {
  const { 
    messages, 
    isAITyping, 
    addMessage, 
    setAITyping,
    uiState,
    toggleRecording 
  } = useInterviewStore();
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAITyping]);

  useEffect(() => {
    // Send initial greeting message
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: "Hello! I'm your AI interviewer. I'm excited to conduct this interview with you today. Let's start with our first question. Take your time to think through your answer, and feel free to ask for clarification if needed. Ready to begin?",
        type: 'question'
      });
    }
  }, [messages.length, addMessage]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
      type: 'response'
    });

    setIsLoading(true);
    setAITyping(true);

    try {
      const { currentSession } = useInterviewStore.getState();
      if (!currentSession) return;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
          interviewConfig: currentSession.config,
          currentQuestion: currentSession.questions[currentSession.currentQuestionIndex]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.success) {
        addMessage({
          role: 'assistant',
          content: data.response,
          type: 'feedback'
        });
      } else {
        throw new Error(data.error || 'AI response failed');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast.error('Failed to get AI response');
      
      // Add fallback message
      addMessage({
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your response right now. Please try again or continue with the next question.",
        type: 'feedback'
      });
    } finally {
      setAITyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-xs lg:max-w-md ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white ml-2' 
                  : 'bg-gray-200 text-gray-600 mr-2'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <div className={`px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isAITyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your response here..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => toggleRecording()}
              className={`p-3 rounded-lg transition-colors ${
                uiState.isRecording
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={uiState.isRecording ? 'Stop recording' : 'Start voice recording'}
            >
              {uiState.isRecording ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}