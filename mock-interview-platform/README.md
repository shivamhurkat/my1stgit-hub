# AI Mock Interview Platform

A comprehensive AI-powered mock interview platform that provides realistic interview experiences with real-time feedback and evaluation.

## 🚀 Features

### Core Functionality
- **Role-based Interviews**: SDE, Product Manager, Data Scientist, DevOps, Frontend/Backend Developer
- **Company-specific Questions**: Google, Microsoft, Amazon, Meta, Apple, Netflix, Flipkart, Uber, Airbnb, Stripe
- **Multiple Round Types**: HR, Coding, System Design, Behavioral, Technical
- **AI-powered Evaluation**: Real-time feedback with detailed scoring and suggestions
- **Token-based System**: Credit management for premium features

### Interview Experience
- **Chat Interface**: Natural conversation with AI interviewer
- **Code Editor**: Monaco editor with syntax highlighting and live execution
- **Whiteboard**: Drawing tools for system design questions
- **Voice Analysis**: Speech recognition and analysis (premium feature)
- **Skip Questions**: Limited skips with token consumption
- **Timer & Progress**: Real-time tracking of interview progress

### Advanced Features
- **Detailed Reports**: Comprehensive performance analysis with charts
- **PDF Export**: Download interview reports
- **Session History**: Track all past interviews
- **Adaptive Questions**: AI generates follow-up questions based on performance
- **Token Management**: Purchase and manage interview credits

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Monaco Editor** - Code editor (VS Code engine)
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **OpenAI GPT-4** - AI interview generation and evaluation
- **Supabase** - PostgreSQL database with real-time features
- **Clerk** - Authentication and user management

### Additional Services
- **ElevenLabs** - Text-to-speech (voice features)
- **Stripe** - Payment processing (token purchases)

## 📋 Prerequisites

Before running this project, you'll need:

1. **Node.js 18+** and npm
2. **Supabase Account** - Database and authentication
3. **OpenAI API Key** - For AI interview features
4. **Clerk Account** - User authentication
5. **ElevenLabs API Key** - Voice features (optional)
6. **Stripe Account** - Payment processing (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mock-interview-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs (Voice)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Setup

#### Supabase Setup
1. Create a new Supabase project
2. Run the following SQL to create the required tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tokens INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview sessions table
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  config JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  current_question_index INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview questions table
CREATE TABLE interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  type TEXT NOT NULL,
  question TEXT NOT NULL,
  context TEXT,
  code_template TEXT,
  expected_answer TEXT,
  difficulty TEXT DEFAULT 'medium',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview responses table
CREATE TABLE interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  question_id UUID REFERENCES interview_questions(id),
  answer TEXT NOT NULL,
  code TEXT,
  evaluation JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token transactions table
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview reports table
CREATE TABLE interview_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  user_id UUID REFERENCES users(id),
  overall_score INTEGER NOT NULL,
  breakdown JSONB NOT NULL,
  strengths TEXT[] NOT NULL,
  weaknesses TEXT[] NOT NULL,
  recommendations TEXT[] NOT NULL,
  question_analysis JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_reports ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── interview/         # Interview page
│   ├── report/           # Report pages
│   └── layout.tsx        # Root layout
├── components/            # React components
│   └── interview/        # Interview-specific components
├── lib/                  # Utility libraries
│   ├── ai.ts            # OpenAI integration
│   ├── supabase.ts      # Database utilities
│   └── tokens.ts        # Token management
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### OpenAI Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env.local` file
3. The AI service uses GPT-4 for question generation and evaluation

### Clerk Authentication
1. Create a Clerk application
2. Configure your domain and redirect URLs
3. Add the publishable and secret keys to your environment

### Supabase Database
1. Create a new Supabase project
2. Run the database schema SQL
3. Configure RLS policies for your authentication setup
4. Add the connection details to your environment

## 🎯 Usage

### Starting an Interview
1. Sign up/login to the platform
2. Select your target role and company
3. Choose interview round types
4. Set interview duration
5. Click "Start Mock Interview"

### During the Interview
- **Chat Interface**: Type responses to HR and behavioral questions
- **Code Editor**: Write and test code solutions
- **Whiteboard**: Draw system designs
- **Skip Questions**: Use limited skips (consumes tokens)
- **Voice Analysis**: Enable for speech recognition (premium)

### After the Interview
- **Detailed Report**: View comprehensive performance analysis
- **Score Breakdown**: See scores by category
- **Recommendations**: Get personalized improvement suggestions
- **Download PDF**: Export your report

## 💰 Token System

### Token Costs
- **Mock Interview**: 2 tokens
- **Skip Question**: 1 token
- **Voice Analysis**: 1 token
- **Whiteboard**: 1 token
- **Follow-up Questions**: 1 token

### Getting Tokens
- **Free Tier**: 10 tokens on signup
- **Purchase**: Buy token packs (Stripe integration)
- **Referrals**: Earn tokens by referring friends

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Railway
1. Connect your GitHub repository to Railway
2. Add environment variables
3. Deploy with automatic scaling

### Docker
```bash
# Build the image
docker build -t mock-interview-platform .

# Run the container
docker run -p 3000:3000 mock-interview-platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/your-server) for community support

## 🔮 Roadmap

### Phase 2 Features
- [ ] Real-time voice analysis
- [ ] Video recording and analysis
- [ ] Peer-to-peer mock interviews
- [ ] Interview scheduling
- [ ] Company-specific question banks
- [ ] Advanced analytics dashboard

### Phase 3 Features
- [ ] AI-powered resume analysis
- [ ] Interview preparation courses
- [ ] Mock interview marketplace
- [ ] Integration with job platforms
- [ ] Mobile app development

---

Built with ❤️ by the AI Mock Interview Platform team
