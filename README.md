# 🚀 SysBot: AI-Powered Real-Time Interview Simulator (v2.0)

A comprehensive AI-powered interview simulation platform that provides realistic multi-round interview experiences tailored to specific job roles and experience levels.

## 🎯 Features

- **Role-Specific Interviews**: Customized interview pipelines for different job roles
- **Multi-Round System**: Complete interview process simulation (Aptitude → Technical → Coding → Voice → HR)
- **AI-Powered**: Dynamic question generation and real-time evaluation using Gemini AI
- **Resume Analysis**: Questions adapted based on uploaded resume
- **Voice Interviews**: Real-time speech recognition and synthesis
- **Code Editor**: Monaco editor for coding challenges
- **Performance Analytics**: Comprehensive scoring and feedback system
- **PDF Reports**: Downloadable interview performance reports

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI Engine**: Google Gemini AI
- **Database**: Supabase
- **Code Editor**: Monaco Editor
- **Voice**: Web Speech API
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key
- Supabase account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intervoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🎮 How to Use

### 1. Start Interview
- Select your target job role
- Choose experience level
- Upload resume (optional)
- Click "Start Interview Simulation"

### 2. Interview Process
- **Setup**: AI generates personalized interview pipeline
- **Rounds**: Complete each round (MCQ, Coding, Voice)
- **Evaluation**: Real-time scoring and feedback
- **Progression**: Pass criteria required to advance

### 3. Results
- Comprehensive performance report
- Round-wise analysis
- Strengths and improvement areas
- Downloadable PDF report

## 📋 Supported Job Roles

- **Engineering**: Frontend, Backend, Full Stack, DevOps
- **Data**: Data Scientist, Data Analyst
- **Product**: Product Manager
- **Design**: UI/UX Designer

## 🔧 Configuration

### Gemini AI Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local` as `GEMINI_API_KEY`

### Supabase Setup (Optional)

1. Create project at [Supabase](https://supabase.com)
2. Get URL and anon key
3. Add to `.env.local`

## 🏗️ Project Structure

```
intervoice/
├── app/                    # Next.js app directory
│   ├── interview/         # Interview flow pages
│   │   ├── setup/        # Interview setup
│   │   ├── round/        # Round execution
│   │   └── results/      # Results and reports
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   └── rounds/           # Round-specific components
│       ├── MCQRound.tsx  # Multiple choice questions
│       ├── VoiceRound.tsx # Voice interviews
│       └── CodingRound.tsx # Coding challenges
├── lib/                  # Utility libraries
│   ├── gemini.ts        # Gemini AI service
│   └── supabase.ts      # Supabase client
├── types/               # TypeScript definitions
└── public/              # Static assets
```

## 🎯 Round Types

### 1. MCQ Rounds
- Aptitude and logical reasoning
- Technical fundamentals
- Domain-specific questions
- Timed with auto-submission

### 2. Coding Rounds
- Algorithm and data structure problems
- Multiple language support (JS, Python, Java)
- Real-time code execution
- Test case validation

### 3. Voice Rounds
- Technical discussions
- Behavioral interviews
- Speech recognition and synthesis
- AI-powered evaluation

## 📊 Scoring System

- **MCQ**: Percentage of correct answers
- **Coding**: Test case pass rate + code quality
- **Voice**: Technical accuracy + communication + confidence
- **Overall**: Weighted average across all rounds

## 🔮 Future Enhancements

- [ ] Company-specific interview simulations
- [ ] Advanced AI evaluation models
- [ ] Video interview support
- [ ] Collaborative coding sessions
- [ ] Interview scheduling system
- [ ] Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@sysbot.ai
- Documentation: [docs.sysbot.ai](https://docs.sysbot.ai)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent content generation
- Monaco Editor for code editing experience
- Web Speech API for voice capabilities
- Supabase for backend infrastructure

---

**Built with ❤️ for better interview preparation**