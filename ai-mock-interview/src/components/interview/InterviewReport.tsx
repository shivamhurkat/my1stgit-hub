'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/stores/interview-store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Download, Home, RotateCcw, Share } from 'lucide-react';
import Link from 'next/link';

export default function InterviewReport() {
  const router = useRouter();
  const { currentSession, timeElapsed } = useInterviewStore();
  const [reportData, setReportData] = useState({
    overallScore: 82,
    scores: {
      accuracy: 85,
      clarity: 80,
      confidence: 78,
      communication: 85,
      problemSolving: 80
    },
    strengths: [
      'Clear problem-solving approach',
      'Good communication skills',
      'Strong technical foundation',
      'Handles pressure well'
    ],
    weaknesses: [
      'Could be more specific in explanations',
      'Consider edge cases more thoroughly',
      'Practice system design patterns'
    ],
    suggestions: [
      'Practice more coding problems on LeetCode',
      'Review system design fundamentals',
      'Work on explaining complex concepts simply',
      'Practice whiteboard interviews'
    ],
    questionsAnswered: 5,
    questionsSkipped: 1,
    totalTimeSpent: Math.floor(timeElapsed / 60)
  });

  useEffect(() => {
    // If no session data, redirect to dashboard
    if (!currentSession || currentSession.status !== 'completed') {
      router.push('/dashboard');
    }
  }, [currentSession, router]);

  const scoreData = [
    { name: 'Accuracy', score: reportData.scores.accuracy },
    { name: 'Clarity', score: reportData.scores.clarity },
    { name: 'Confidence', score: reportData.scores.confidence },
    { name: 'Communication', score: reportData.scores.communication },
    { name: 'Problem Solving', score: reportData.scores.problemSolving },
  ];

  const radarData = [
    { subject: 'Technical Skills', A: reportData.scores.accuracy, fullMark: 100 },
    { subject: 'Communication', A: reportData.scores.communication, fullMark: 100 },
    { subject: 'Problem Solving', A: reportData.scores.problemSolving, fullMark: 100 },
    { subject: 'Confidence', A: reportData.scores.confidence, fullMark: 100 },
    { subject: 'Clarity', A: reportData.scores.clarity, fullMark: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Report</h1>
              <p className="text-gray-600 mt-1">
                {currentSession.config.role} at {currentSession.config.company}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold ${getScoreBg(reportData.overallScore)} ${getScoreColor(reportData.overallScore)}`}>
              {reportData.overallScore}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Overall Score</h2>
            <p className="text-gray-600 mt-2">
              You performed {reportData.overallScore >= 80 ? 'excellently' : reportData.overallScore >= 60 ? 'well' : 'adequately'} in this interview
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Score Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills Assessment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Score" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interview Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Interview Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{reportData.questionsAnswered}</div>
              <div className="text-sm text-gray-600 mt-1">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{reportData.questionsSkipped}</div>
              <div className="text-sm text-gray-600 mt-1">Questions Skipped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{reportData.totalTimeSpent}</div>
              <div className="text-sm text-gray-600 mt-1">Minutes Spent</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Strengths</h3>
            <ul className="space-y-3">
              {reportData.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvement Areas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
            <ul className="space-y-3">
              {reportData.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations for Next Steps</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {reportData.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-gray-700">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Link 
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Practice Again</span>
          </Link>
        </div>
      </div>
    </div>
  );
}