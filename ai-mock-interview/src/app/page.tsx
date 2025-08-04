import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { Brain, Code, MessageSquare, Target, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">AI Interview</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your Interview Skills with{' '}
            <span className="text-indigo-600">AI-Powered Practice</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Practice coding, system design, and behavioral interviews with our AI interviewer. 
            Get real-time feedback and personalized improvement suggestions.
          </p>
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg">
                Start Free Practice
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <Link 
              href="/dashboard"
              className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coding Interviews</h3>
            <p className="text-gray-600">
              Practice data structures, algorithms, and system design problems with our integrated code editor.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Behavioral Questions</h3>
            <p className="text-gray-600">
              Master the STAR method and practice common behavioral interview scenarios.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Company-Specific</h3>
            <p className="text-gray-600">
              Tailored questions and feedback based on your target company's interview style.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Feedback</h3>
            <p className="text-gray-600">
              Get instant, detailed feedback on your answers with personalized improvement suggestions.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Roles</h3>
            <p className="text-gray-600">
              Practice for SDE, PM, Data Scientist, and other tech roles with role-specific questions.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Scoring</h3>
            <p className="text-gray-600">
              Track your progress with detailed scorecards and performance analytics.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to ace your next interview?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of developers who've improved their interview skills with our platform.
            </p>
            
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg">
                  Start Practicing Now
                </button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <Link 
                href="/dashboard"
                className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Continue to Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
