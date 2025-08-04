import { create } from 'zustand';
import { InterviewSession, InterviewConfig, Question, ChatMessage, InterviewUIState } from '@/types';

interface InterviewStore {
  // Session state
  currentSession: InterviewSession | null;
  isSessionActive: boolean;
  
  // Chat state
  messages: ChatMessage[];
  isAITyping: boolean;
  
  // UI state
  uiState: InterviewUIState;
  
  // Timer state
  timeElapsed: number;
  timerInterval: NodeJS.Timeout | null;
  
  // Actions
  startSession: (config: InterviewConfig, questions: Question[]) => void;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  
  // Message actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setAITyping: (typing: boolean) => void;
  clearMessages: () => void;
  
  // UI actions
  setCurrentView: (view: InterviewUIState['currentView']) => void;
  setCodeLanguage: (language: string) => void;
  toggleRecording: () => void;
  
  // Question actions
  nextQuestion: () => void;
  skipQuestion: () => void;
  
  // Timer actions
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  // Initial state
  currentSession: null,
  isSessionActive: false,
  messages: [],
  isAITyping: false,
  uiState: {
    currentView: 'chat',
    isRecording: false,
    timerStarted: false,
    showHints: false,
    codeLanguage: 'javascript',
  },
  timeElapsed: 0,
  timerInterval: null,
  
  // Session actions
  startSession: (config: InterviewConfig, questions: Question[]) => {
    const sessionId = `session_${Date.now()}`;
    const newSession: InterviewSession = {
      id: sessionId,
      userId: '', // Will be set from auth
      config,
      status: 'active',
      questions,
      currentQuestionIndex: 0,
      startTime: new Date(),
      tokensUsed: 0,
      skipCount: 0,
      maxSkips: 3,
    };
    
    set({
      currentSession: newSession,
      isSessionActive: true,
      messages: [],
      timeElapsed: 0,
      uiState: {
        ...get().uiState,
        timerStarted: true,
      },
    });
    
    // Start timer
    get().startTimer();
  },
  
  endSession: () => {
    const { currentSession, timerInterval } = get();
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        status: 'completed' as const,
        endTime: new Date(),
      };
      
      set({
        currentSession: updatedSession,
        isSessionActive: false,
        uiState: {
          ...get().uiState,
          timerStarted: false,
        },
      });
    }
    
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      set({ timerInterval: null });
    }
  },
  
  pauseSession: () => {
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: {
          ...currentSession,
          status: 'paused',
        },
        isSessionActive: false,
      });
    }
    get().stopTimer();
  },
  
  resumeSession: () => {
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: {
          ...currentSession,
          status: 'active',
        },
        isSessionActive: true,
      });
    }
    get().startTimer();
  },
  
  // Message actions
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
    
    set(state => ({
      messages: [...state.messages, newMessage],
    }));
  },
  
  setAITyping: (typing: boolean) => {
    set({ isAITyping: typing });
  },
  
  clearMessages: () => {
    set({ messages: [] });
  },
  
  // UI actions
  setCurrentView: (view) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        currentView: view,
      },
    }));
  },
  
  setCodeLanguage: (language) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        codeLanguage: language,
      },
    }));
  },
  
  toggleRecording: () => {
    set(state => ({
      uiState: {
        ...state.uiState,
        isRecording: !state.uiState.isRecording,
      },
    }));
  },
  
  // Question actions
  nextQuestion: () => {
    const { currentSession } = get();
    if (currentSession && currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
      set({
        currentSession: {
          ...currentSession,
          currentQuestionIndex: currentSession.currentQuestionIndex + 1,
        },
      });
    }
  },
  
  skipQuestion: () => {
    const { currentSession } = get();
    if (currentSession && currentSession.skipCount < currentSession.maxSkips) {
      set({
        currentSession: {
          ...currentSession,
          currentQuestionIndex: Math.min(
            currentSession.currentQuestionIndex + 1,
            currentSession.questions.length - 1
          ),
          skipCount: currentSession.skipCount + 1,
          tokensUsed: currentSession.tokensUsed + 1, // Skip costs 1 token
        },
      });
    }
  },
  
  // Timer actions
  startTimer: () => {
    const interval = setInterval(() => {
      set(state => ({
        timeElapsed: state.timeElapsed + 1,
      }));
    }, 1000);
    
    set({ timerInterval: interval });
  },
  
  stopTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
      set({ timerInterval: null });
    }
  },
  
  resetTimer: () => {
    get().stopTimer();
    set({ timeElapsed: 0 });
  },
}));