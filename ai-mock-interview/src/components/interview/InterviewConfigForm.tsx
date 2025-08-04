'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InterviewRole, TargetCompany, InterviewType, InterviewConfig } from '@/types';
import { calculateInterviewCost } from '@/lib/tokens';
import { Play, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES: InterviewRole[] = [
  'SDE',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer'
];

const COMPANIES: TargetCompany[] = [
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Netflix',
  'Uber',
  'Flipkart',
  'Zomato',
  'Swiggy'
];

const INTERVIEW_TYPES: InterviewType[] = [
  'HR',
  'Coding',
  'System Design',
  'Behavioral'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export default function InterviewConfigForm() {
  const router = useRouter();
  const [config, setConfig] = useState<Partial<InterviewConfig>>({
    role: 'SDE',
    company: 'Google',
    types: ['Coding'],
    duration: 45,
    difficulty: 'Medium'
  });
  const [features, setFeatures] = useState({
    hasWhiteboard: false,
    hasVoiceAnalysis: false
  });
  const [loading, setLoading] = useState(false);

  const handleTypeToggle = (type: InterviewType) => {
    const currentTypes = config.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    setConfig({ ...config, types: newTypes });
  };

  const calculateCost = () => {
    return calculateInterviewCost(config.types || [], features);
  };

  const handleStartInterview = async () => {
    if (!config.role || !config.company || !config.types?.length) {
      toast.error('Please complete all required fields');
      return;
    }

    const cost = calculateCost();
    // TODO: Check if user has enough tokens

    setLoading(true);
    try {
      // Import the store action
      const { useInterviewStore } = await import('@/stores/interview-store');
      
      // Create sample questions based on selected types
      const sampleQuestions = config.types?.map((type, index) => ({
        id: `q_${index}`,
        type,
        content: getSampleQuestion(type, config.role!, config.company!),
        difficulty: config.difficulty!,
        timeLimit: type === 'Coding' ? 30 : 15
      })) || [];

      // Start the interview session
      useInterviewStore.getState().startSession(config as any, sampleQuestions);
      
      toast.success('Starting your interview...');
      router.push('/interview');
    } catch (error) {
      toast.error('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const getSampleQuestion = (type: InterviewType, role: string, company: string) => {
    const questions = {
      'HR': `Tell me about yourself and why you're interested in working at ${company} as a ${role}.`,
      'Coding': `Given an array of integers, find the two numbers that add up to a specific target. Return the indices of these two numbers.`,
      'System Design': `Design a URL shortening service like bit.ly. Consider scalability, reliability, and performance requirements.`,
      'Behavioral': `Tell me about a time when you had to work with a difficult team member. How did you handle the situation and what was the outcome?`
    };
    return questions[type] || 'Sample interview question';
  };

  return (
    <div className="space-y-6">
      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Click to upload your resume for personalized questions
          </p>
          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
        </div>
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role *
        </label>
        <select
          value={config.role}
          onChange={(e) => setConfig({ ...config, role: e.target.value as InterviewRole })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {ROLES.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Company Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Company *
        </label>
        <select
          value={config.company}
          onChange={(e) => setConfig({ ...config, company: e.target.value as TargetCompany })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {COMPANIES.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      {/* Interview Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interview Types *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INTERVIEW_TYPES.map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.types?.includes(type) || false}
                onChange={() => handleTypeToggle(type)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty and Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={config.difficulty}
            onChange={(e) => setConfig({ ...config, difficulty: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {DIFFICULTIES.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <select
            value={config.duration}
            onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
          </select>
        </div>
      </div>

      {/* Additional Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Features
        </label>
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={features.hasWhiteboard}
                onChange={(e) => setFeatures({ ...features, hasWhiteboard: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Whiteboard for System Design</span>
            </div>
            <span className="text-xs text-gray-500">+1 token</span>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={features.hasVoiceAnalysis}
                onChange={(e) => setFeatures({ ...features, hasVoiceAnalysis: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Voice Analysis & Feedback</span>
            </div>
            <span className="text-xs text-gray-500">+1 token</span>
          </label>
        </div>
      </div>

      {/* Cost Summary and Start Button */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Total Cost:</p>
            <p className="text-lg font-semibold text-gray-900">
              {calculateCost()} tokens
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Your Balance:</p>
            <p className="text-lg font-semibold text-yellow-600">10 tokens</p>
          </div>
        </div>

        <button
          onClick={handleStartInterview}
          disabled={loading || !config.types?.length}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <Play className="h-5 w-5" />
          <span>{loading ? 'Starting...' : 'Start Interview'}</span>
        </button>
      </div>
    </div>
  );
}