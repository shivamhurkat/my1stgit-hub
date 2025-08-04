# AI Mock Interview Platform

An AI-powered mock interview platform that helps users practice technical interviews with real-time feedback and scoring.

## 🚀 Features

### Core Features
- **Role-specific interviews**: SDE, Product Manager, Data Scientist, DevOps Engineer, Frontend/Backend Developer
- **Company-tailored questions**: Google, Meta, Amazon, Microsoft, Apple, Netflix, Uber, Flipkart, Zomato, Swiggy
- **Multiple interview types**: HR, Coding, System Design, Behavioral
- **AI-powered feedback**: Real-time evaluation and suggestions using GPT-4
- **Interactive code editor**: Monaco Editor with multiple programming languages
- **Whiteboard for system design**: Canvas-based drawing tools
- **Real-time chat interface**: Conversational AI interviewer
- **Comprehensive reports**: Detailed scoring and improvement suggestions

### Advanced Features
- **Token-based system**: Credit system for interview sessions and premium features
- **Voice recording**: Audio capture for communication analysis
- **Resume upload**: Personalized questions based on your background
- **Progress tracking**: Session history and performance analytics
- **Responsive design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT-4
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **State Management**: Zustand
- **Icons**: Lucide React
- **Styling**: TailwindCSS with custom components

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-mock-interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Authentication - Get from https://clerk.com
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
   CLERK_SECRET_KEY=sk_test_your_key
   
   # OpenAI - Get from https://platform.openai.com
   OPENAI_API_KEY=sk-your_openai_key
   
   # Supabase - Get from https://supabase.com
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── ai/           # AI-related endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   ├── sessions/     # Interview session management
│   │   └── tokens/       # Token management
│   ├── dashboard/        # Dashboard page
│   ├── interview/        # Interview interface
│   └── report/           # Interview reports
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── interview/        # Interview-related components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── openai.ts         # OpenAI configuration
│   ├── supabase.ts       # Supabase client
│   └── tokens.ts         # Token management utilities
├── stores/               # Zustand state stores
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## 🎯 Usage

### Starting an Interview

1. **Sign up/Login** using Clerk authentication
2. **Configure your interview**:
   - Select your target role (e.g., SDE, Product Manager)
   - Choose target company (e.g., Google, Meta)
   - Pick interview types (HR, Coding, System Design, Behavioral)
   - Set difficulty level and duration
   - Enable optional features (Whiteboard, Voice Analysis)
3. **Review token cost** and start the interview
4. **Interact with the AI interviewer** through the chat interface
5. **Use specialized tools**:
   - Code Editor for coding questions
   - Whiteboard for system design
   - Notes panel for organizing thoughts
6. **Complete the interview** and view your detailed report

### Interview Interface

- **Left Panel**: AI chat interface with conversation history
- **Right Panel**: Switchable between Code Editor, Whiteboard, and Notes
- **Header**: Interview context (role, company, difficulty)
- **Timer**: Real-time countdown and elapsed time
- **Actions**: Skip questions (limited), End interview

### Report Features

- **Overall Score**: 0-100 rating with visual indicators
- **Score Breakdown**: Individual metrics (Accuracy, Clarity, Confidence, etc.)
- **Skills Assessment**: Radar chart visualization
- **Detailed Feedback**: Strengths, weaknesses, and improvement suggestions
- **Recommendations**: Personalized next steps for improvement

## 🔧 Configuration

### Token System

- **Default tokens**: 10 per new user
- **Mock interview cost**: 2 tokens
- **Skip question**: 1 token
- **Voice analysis**: 1 token
- **Whiteboard access**: 1 token

### Interview Types

- **HR**: General questions about background and motivation
- **Coding**: Data structures, algorithms, and programming problems
- **System Design**: Scalability, architecture, and design patterns
- **Behavioral**: STAR method questions about past experiences

## 🔌 API Endpoints

### AI Endpoints
- `POST /api/ai/chat` - AI conversation
- `POST /api/ai/evaluate` - Response evaluation

### Session Management
- `POST /api/sessions/create` - Create interview session
- `GET /api/sessions/[id]` - Get session details
- `PUT /api/sessions/[id]` - Update session

### Token Management
- `GET /api/tokens/balance` - Get user token balance
- `POST /api/tokens/deduct` - Deduct tokens
- `POST /api/tokens/purchase` - Purchase token packs

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Railway
1. Connect repository to Railway
2. Configure environment variables
3. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 TODO / Roadmap

### High Priority
- [ ] Implement token/credit system with database persistence
- [ ] Set up Supabase database schema and integration
- [ ] Add voice recording and analysis functionality
- [ ] Implement resume parsing and personalized questions
- [ ] Add code execution environment

### Medium Priority
- [ ] Create admin dashboard for analytics
- [ ] Add interview session recording/playback
- [ ] Implement peer comparison and percentile scoring
- [ ] Add more programming languages for code editor
- [ ] Create mobile app version

### Low Priority
- [ ] Add team/organization features
- [ ] Implement AI-powered interview scheduling
- [ ] Create interview preparation courses
- [ ] Add gamification elements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Join our Discord community (coming soon)
4. Email support: support@aimockinterview.com

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Clerk for authentication
- Supabase for database
- Vercel for hosting
- All contributors and beta testers

---

**Built with ❤️ for the developer community**
