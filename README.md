# AcademiQ - AI-Driven Faculty Analytics and Research Publication Summarization System

A comprehensive web application that automates faculty research profile management, summarizes academic publications using AI, and provides institutional analytics.

## 🎯 Features

### Core Functionality
- **🔐 User Authentication**: Secure sign-in/registration system for faculty, admin, and students
- **📄 Publication Management**: Upload, manage, and organize research publications
- **🤖 AI-Powered Summarization**: Generate extractive (TextRank) and abstractive (BART) summaries
- **👥 Faculty Profiles**: Comprehensive faculty directory with detailed profiles
- **🏆 Ranking System**: Institutional leaderboard based on research impact
- **📊 Analytics Dashboard**: Visual insights into publication trends and metrics
- **💬 Feedback System**: Student feedback with sentiment analysis

### Technical Features
- **File Upload**: Support for PDF and Word documents with automatic text extraction
- **Real-time Updates**: Dynamic content updates across all pages
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI/UX**: Built with shadcn/ui components
- **TypeScript**: Full type safety throughout the application

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Zustand, TanStack Query

### Backend
- **API**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: bcryptjs for password hashing
- **File Processing**: 
  - PDF parsing with pdf-parse
  - Word document processing with mammoth
- **AI/NLP**: 
  - z-ai-web-dev-sdk for AI summarization
  - Custom TextRank implementation
  - Sentiment analysis

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Development Server**: Nodemon with hot reload

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── publications/  # Publication management
│   │   ├── faculty/       # Faculty directory
│   │   ├── rankings/      # Ranking system
│   │   ├── analytics/     # Analytics data
│   │   ├── feedback/      # Feedback system
│   │   └── user/          # User management
│   ├── auth/              # Authentication pages
│   ├── feed/              # Research feed
│   ├── faculty/           # Faculty directory
│   ├── rankings/          # Rankings page
│   ├── analytics/         # Analytics dashboard
│   ├── profile/           # User profile
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── FeedbackDialog.tsx
│   └── FeedbackView.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── db.ts            # Database client
│   ├── socket.ts        # Socket.io configuration
│   └── utils.ts         # Utility functions
└── globals.css          # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd academiq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses the following main entities:

### User
- Authentication and profile information
- Role-based access (faculty, admin, student)
- Department and specialization details

### Publication
- Research paper metadata
- File storage information
- AI-generated summaries (extractive, abstractive, hybrid)
- Citation tracking

### Feedback
- Student feedback on publications and faculty
- Sentiment analysis results
- Anonymous or attributed feedback

## 🔐 Authentication System

- **Registration**: Users can sign up with role selection
- **Login**: Secure authentication with password verification
- **Session Management**: Client-side session storage (production should use secure cookies)
- **Role-Based Access**: Different features based on user roles

## 🤖 AI Summarization Pipeline

### Extractive Summarization (TextRank)
- Graph-based ranking algorithm
- Identifies important sentences
- Preserves original text structure

### Abstractive Summarization (BART-like)
- Uses z-ai-web-dev-sdk for AI generation
- Creates novel sentences
- Captures semantic meaning

### Hybrid Approach
- Combines both methods
- Optimizes for coherence and importance
- Provides comprehensive summaries

## 📈 Analytics Features

### Publication Trends
- Year-over-year publication counts
- Citation trends
- Departmental comparisons

### Faculty Performance
- Individual faculty rankings
- Publication metrics
- Impact factors

### Visualizations
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Area charts for cumulative data

## 🔍 Feedback System

### Collection
- Star ratings (1-5)
- Text feedback
- Optional user information

### Sentiment Analysis
- Positive/negative/neutral classification
- Sentiment scoring
- Real-time analysis

### Display
- Summary statistics
- Individual feedback cards
- Sentiment distribution

## 🎨 UI/UX Features

### Design Principles
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: Semantic HTML and ARIA support
- **Dark Mode**: Theme support with next-themes
- **Micro-interactions**: Subtle animations and transitions

### Components
- **Cards**: Consistent content containers
- **Navigation**: Intuitive menu system
- **Forms**: User-friendly input validation
- **Dialogs**: Modal interactions
- **Charts**: Data visualization

## 📱 Page Structure

### Landing Page (/)
- Hero section with value proposition
- Feature highlights
- Call-to-action for registration
- Navigation to sign-in/sign-up

### Authentication (/auth/signin, /auth/register)
- User registration with role selection
- Secure login system
- Form validation
- Error handling

### Research Feed (/feed)
- Latest publications display
- AI-powered summaries
- Filter and search functionality
- Navigation to other sections

### Faculty Directory (/faculty)
- Browse all faculty members
- Department filtering
- Search functionality
- Individual profile links

### Rankings (/rankings)
- Leaderboard system
- Multiple ranking criteria
- Top performers podium
- Ranking methodology

### Analytics (/analytics)
- Comprehensive dashboard
- Interactive charts
- Export functionality
- Time-based filtering

### Profile (/profile)
- User profile management
- Publication upload and management
- File processing
- AI summarization integration

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database

# Code Quality
npm run lint         # Run ESLint
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: SQLite database connection string
- `NEXTAUTH_SECRET`: Authentication secret (for production)

### Database Configuration
- Uses SQLite for development
- Prisma ORM for database operations
- Automatic schema migrations

## 🚀 Deployment

### Production Considerations
1. **Database**: Migrate to PostgreSQL or MongoDB
2. **Authentication**: Implement secure session management
3. **File Storage**: Use cloud storage (AWS S3, etc.)
4. **AI Services**: Configure production AI endpoints
5. **Security**: Implement HTTPS and security headers

### Build Process
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Z.ai Web Development SDK** for AI summarization capabilities
- **Next.js** team for the excellent framework
- **shadcn/ui** for beautiful UI components
- **Prisma** for the modern database toolkit
- **Academic institutions** that inspired this project

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**AcademiQ** - Empowering academic excellence through AI-driven research management and analytics.