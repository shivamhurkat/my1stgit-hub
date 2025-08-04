# AI-Powered Mock Interview Platform

A comprehensive mock interview platform that uses AI to conduct realistic interviews, provide real-time feedback, and generate detailed performance reports.

## 🚀 Features

### Core Functionality
- **Role & Company Selection**: Choose from various roles (Software Engineer, Product Manager, etc.) and target companies
- **AI Interviewer**: GPT-4 powered interviewer with role-specific questions
- **Real-time Chat**: Interactive conversation with AI interviewer
- **Code Editor**: Built-in code editor with syntax highlighting and execution
- **Whiteboard**: Drawing tools for system design interviews
- **Voice Integration**: Voice recording and AI voice responses (planned)
- **Token System**: Credit-based system for premium features

### Interview Types
- **HR Round**: Behavioral and cultural fit questions
- **Coding Round**: Algorithm and programming challenges
- **System Design**: Architecture and scalability questions
- **Behavioral**: STAR format and leadership questions

### Analytics & Reports
- **Real-time Scoring**: Instant feedback on responses
- **Performance Metrics**: Technical, communication, problem-solving, and confidence scores
- **Detailed Reports**: Comprehensive analysis with strengths, weaknesses, and recommendations
- **Progress Tracking**: Historical performance and improvement trends

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Radix UI**: Accessible UI components

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Supabase**: PostgreSQL database with real-time features
- **OpenAI GPT-4**: AI interviewer and evaluation
- **ElevenLabs**: Text-to-speech (planned)

### Infrastructure
- **Vercel**: Deployment and hosting
- **Supabase**: Database and authentication
- **Stripe**: Payment processing (planned)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

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

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Voice (ElevenLabs)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
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
  name TEXT,
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
  current_question_index INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 5,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview questions table
CREATE TABLE interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  question TEXT NOT NULL,
  type TEXT NOT NULL,
  user_answer TEXT,
  ai_evaluation JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "order" INTEGER NOT NULL
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT DEFAULT 'text',
  metadata JSONB
);

-- Token transactions table
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  session_id UUID REFERENCES interview_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice messages table
CREATE TABLE voice_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  audio_url TEXT NOT NULL,
  transcript TEXT,
  duration INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Whiteboard data table
CREATE TABLE whiteboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  elements JSONB,
  app_state JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview reports table
CREATE TABLE interview_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id),
  overall_score INTEGER NOT NULL,
  breakdown JSONB NOT NULL,
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT[],
  question_analysis JSONB,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_reports ENABLE ROW LEVEL SECURITY;
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── interview/     # Interview session management
│   │   └── tokens/        # Token management
│   ├── interview/         # Interview interface
│   ├── report/           # Report generation
│   └── page.tsx          # Landing page
├── components/            # React components
│   └── interview/        # Interview-specific components
│       ├── ChatInterface.tsx
│       ├── CodeEditor.tsx
│       ├── Whiteboard.tsx
│       ├── Timer.tsx
│       └── ProgressBar.tsx
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Database client
│   ├── openai.ts         # AI interviewer
│   └── tokenManager.ts   # Token management
└── types/                # TypeScript type definitions
    └── index.ts
```

## 🔧 Configuration

### OpenAI Setup
1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env.local` file
3. The AI interviewer uses GPT-4 for question generation and evaluation

### Supabase Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Add them to your `.env.local` file
4. Run the database setup SQL above

### Voice Integration (Optional)
1. Get an ElevenLabs API key from [elevenlabs.io](https://elevenlabs.io)
2. Add it to your `.env.local` file
3. Voice features will be automatically enabled

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to set all environment variables in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY` (optional)

## 📊 Token System

### Token Costs
- **Mock Interview**: 2 tokens
- **Skip Question**: 1 token
- **Voice Analysis**: 1 token
- **Whiteboard**: 1 token
- **Hint**: 1 token
- **Follow-up Question**: 1 token

### Token Management
- New users get 10 free tokens
- Tokens can be purchased through Stripe (planned)
- Token usage is tracked and logged

## 🔮 Future Features

### Planned Enhancements
- **Voice Recognition**: Real-time speech-to-text
- **Adaptive Questions**: AI adjusts difficulty based on performance
- **Video Recording**: Record interview sessions
- **Peer Comparison**: Compare performance with other users
- **Interview Templates**: Pre-built interview scenarios
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed performance insights
- **Interview Scheduling**: Book real human interviewers

### Technical Improvements
- **WebSocket Integration**: Real-time communication
- **Caching**: Redis for performance optimization
- **CDN**: Global content delivery
- **Monitoring**: Application performance monitoring
- **Testing**: Comprehensive test suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/your-server) for community support

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Supabase for database and authentication
- Vercel for hosting and deployment
- TailwindCSS for styling
- Lucide for beautiful icons

---

**Built with ❤️ for the developer community**
