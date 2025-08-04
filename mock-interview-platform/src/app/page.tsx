'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Building2, 
  Users, 
  Code, 
  Brain, 
  MessageSquare,
  Play,
  Coins,
  CheckCircle
} from 'lucide-react';
import { Role, Company, RoundType } from '@/types';

const ROLES: { value: Role; label: string; icon: React.ReactNode }[] = [
  { value: 'Software Engineer', label: 'Software Engineer', icon: <Code className="w-5 h-5" /> },
  { value: 'Product Manager', label: 'Product Manager', icon: <Brain className="w-5 h-5" /> },
  { value: 'Data Scientist', label: 'Data Scientist', icon: <Brain className="w-5 h-5" /> },
  { value: 'DevOps Engineer', label: 'DevOps Engineer', icon: <Code className="w-5 h-5" /> },
  { value: 'Frontend Developer', label: 'Frontend Developer', icon: <Code className="w-5 h-5" /> },
  { value: 'Backend Developer', label: 'Backend Developer', icon: <Code className="w-5 h-5" /> },
  { value: 'Full Stack Developer', label: 'Full Stack Developer', icon: <Code className="w-5 h-5" /> },
];

const COMPANIES: { value: Company; label: string; logo: string }[] = [
  { value: 'Google', label: 'Google', logo: '🔍' },
  { value: 'Microsoft', label: 'Microsoft', logo: '🪟' },
  { value: 'Amazon', label: 'Amazon', logo: '📦' },
  { value: 'Meta', label: 'Meta', logo: '📘' },
  { value: 'Apple', label: 'Apple', logo: '🍎' },
  { value: 'Netflix', label: 'Netflix', logo: '📺' },
  { value: 'Flipkart', label: 'Flipkart', logo: '🛒' },
  { value: 'Uber', label: 'Uber', logo: '🚗' },
  { value: 'Airbnb', label: 'Airbnb', logo: '🏠' },
  { value: 'Stripe', label: 'Stripe', logo: '💳' },
];

const ROUND_TYPES: { value: RoundType; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    value: 'HR', 
    label: 'HR Round', 
    icon: <Users className="w-5 h-5" />,
    description: 'Behavioral and cultural fit questions'
  },
  { 
    value: 'Coding', 
    label: 'Coding Round', 
    icon: <Code className="w-5 h-5" />,
    description: 'Algorithm and programming challenges'
  },
  { 
    value: 'System Design', 
    label: 'System Design', 
    icon: <Brain className="w-5 h-5" />,
    description: 'Architecture and scalability questions'
  },
  { 
    value: 'Behavioral', 
    label: 'Behavioral', 
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'STAR format and leadership questions'
  },
];

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedRounds, setSelectedRounds] = useState<RoundType[]>([]);
  const [userTokens, setUserTokens] = useState(10); // Mock data

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setStep(3);
  };

  const handleRoundToggle = (round: RoundType) => {
    setSelectedRounds(prev => 
      prev.includes(round) 
        ? prev.filter(r => r !== round)
        : [...prev, round]
    );
  };

  const handleStartInterview = () => {
    if (!selectedRole || !selectedCompany || selectedRounds.length === 0) {
      alert('Please select all required fields');
      return;
    }

    const config = {
      role: selectedRole,
      company: selectedCompany,
      roundTypes: selectedRounds,
      difficulty: 'medium' as const,
    };

    // Store config in sessionStorage for the interview page
    sessionStorage.setItem('interviewConfig', JSON.stringify(config));
    router.push('/interview');
  };

  const canStartInterview = selectedRole && selectedCompany && selectedRounds.length > 0;
  const interviewCost = 2; // Mock interview costs 2 tokens

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Mock Interviews
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice with realistic interviews tailored to your role and target company. 
            Get instant feedback and improve your skills.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Token Display */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg px-6 py-3 shadow-md flex items-center space-x-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-700">{userTokens} tokens available</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Select Your Role</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => handleRoleSelect(role.value)}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600 group-hover:text-blue-700">
                        {role.icon}
                      </div>
                      <span className="font-semibold text-gray-900">{role.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Select Target Company</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {COMPANIES.map((company) => (
                  <button
                    key={company.value}
                    onClick={() => handleCompanySelect(company.value)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center group"
                  >
                    <div className="text-3xl mb-2">{company.logo}</div>
                    <div className="font-semibold text-gray-900 text-sm">{company.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Select Interview Rounds</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ROUND_TYPES.map((round) => (
                  <button
                    key={round.value}
                    onClick={() => handleRoundToggle(round.value)}
                    className={`p-6 border-2 rounded-lg transition-all duration-200 text-left group ${
                      selectedRounds.includes(round.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`${
                        selectedRounds.includes(round.value) ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {round.icon}
                      </div>
                      <span className="font-semibold text-gray-900">{round.label}</span>
                      {selectedRounds.includes(round.value) && (
                        <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{round.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Review & Start Interview</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Interview Configuration</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium">{selectedRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">{selectedCompany}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rounds:</span>
                    <span className="font-medium">{selectedRounds.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium text-blue-600">{interviewCost} tokens</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleStartInterview}
                  disabled={!canStartInterview || userTokens < interviewCost}
                  className={`px-8 py-4 rounded-lg font-semibold text-lg flex items-center space-x-2 ${
                    canStartInterview && userTokens >= interviewCost
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors duration-200`}
                >
                  <Play className="w-5 h-5" />
                  <span>Start Interview</span>
                </button>
              </div>

              {userTokens < interviewCost && (
                <p className="text-center text-red-600 mt-4">
                  Insufficient tokens. You need {interviewCost} tokens to start an interview.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        {step > 1 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
