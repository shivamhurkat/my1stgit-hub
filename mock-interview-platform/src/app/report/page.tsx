'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  Share2, 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';
import { InterviewReport } from '@/types';

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<InterviewReport | null>(null);

  useEffect(() => {
    // Generate mock report data
    const mockReport: InterviewReport = {
      sessionId: 'session_123',
      overallScore: 78,
      breakdown: {
        technical: 82,
        communication: 75,
        problemSolving: 80,
        confidence: 70,
      },
      strengths: [
        'Strong technical knowledge in algorithms',
        'Clear communication of complex ideas',
        'Good problem-solving approach',
        'Demonstrated logical thinking',
      ],
      weaknesses: [
        'Could provide more specific examples',
        'Need to improve time management',
        'Should practice more system design questions',
        'Could be more confident in responses',
      ],
      recommendations: [
        'Practice more behavioral questions using STAR format',
        'Work on system design problems',
        'Improve time management during interviews',
        'Build confidence through more mock interviews',
      ],
      questionAnalysis: [
        {
          questionId: 'q1',
          score: 85,
          feedback: 'Excellent technical solution with good optimization',
          timeSpent: 180,
        },
        {
          questionId: 'q2',
          score: 70,
          feedback: 'Good approach but could be more thorough',
          timeSpent: 240,
        },
        {
          questionId: 'q3',
          score: 75,
          feedback: 'Clear communication but needs more specific examples',
          timeSpent: 120,
        },
      ],
      generatedAt: new Date(),
    };

    setReport(mockReport);
  }, []);

  const handleDownloadPDF = () => {
    // In real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  const handleShare = () => {
    // In real app, this would share the report
    if (navigator.share) {
      navigator.share({
        title: 'Interview Report',
        text: 'Check out my interview performance report!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Report Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Report</h1>
            <p className="text-gray-600">
              Generated on {report.generatedAt.toLocaleDateString()} at {report.generatedAt.toLocaleTimeString()}
            </p>
          </div>

          {/* Overall Score */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl font-bold text-blue-600">{report.overallScore}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Overall Score</h2>
            <p className="text-gray-600">out of 100</p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(report.breakdown).map(([category, score]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {getScoreIcon(score)}
                </div>
                <h3 className="font-semibold text-gray-900 capitalize mb-1">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {report.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {report.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Question Analysis</h3>
          </div>
          <div className="space-y-4">
            {report.questionAnalysis.map((question, index) => (
              <div key={question.questionId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Question {index + 1}</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{question.timeSpent}s</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      question.score >= 80 ? 'bg-green-100 text-green-700' :
                      question.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {question.score}/100
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{question.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Practice Another Interview
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}