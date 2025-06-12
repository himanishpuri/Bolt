# FinInclude - Financial Inclusion Platform

A comprehensive financial inclusion platform that provides AI-driven alternative credit scoring, financial education, and community support for underbanked individuals.

## 🚀 Features

### Core Features
- **Alternative Credit Scoring**: AI-powered credit assessment using non-traditional data
- **KYC Verification**: DigiLocker integration for government document verification
- **Financial Education**: Interactive modules to improve financial literacy
- **Community Platform**: Forums, events, and peer support
- **Loan Application**: End-to-end loan processing with payment integration
- **Admin Dashboard**: Comprehensive management tools

### Technology Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **AI/ML**: Google Gemini AI for credit scoring and recommendations
- **Payments**: Razorpay integration for processing fees
- **Authentication**: JWT-based auth with role management
- **KYC**: DigiLocker API integration
- **Blockchain**: Polygon for document verification (optional)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- API keys for integrations

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd financial-inclusion-platform
npm install
\`\`\`

### 2. Environment Configuration
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your API keys:
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **RAZORPAY_KEY_ID/SECRET**: Get from [Razorpay Dashboard](https://razorpay.com)
- **DIGILOCKER_CLIENT_ID**: Get from [DigiLocker Partners](https://partners.digilocker.gov.in)
- **DATABASE_URL**: Your PostgreSQL connection string

### 3. Database Setup
\`\`\`bash
# Run the SQL scripts to create tables
psql -d your_database -f scripts/create-database.sql
psql -d your_database -f scripts/seed-data.sql
psql -d your_database -f scripts/update-auth-schema.sql
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🎯 Quick Start (Demo Mode)

Want to try without setup? Visit `/demo` for instant access with pre-configured users:

- **User Demo**: `demo@user.com` / `demo123`
- **Admin Demo**: `admin@fininclude.com` / `admin123`
- **Verified User**: `sarah.kim@email.com` / `password123`

## 📱 Key Pages

### User Journey
1. **Home** (`/`) - Landing page with platform overview
2. **Signup** (`/auth/signup`) - 3-step registration process
3. **KYC** (`/kyc`) - 4-step verification with DigiLocker
4. **Dashboard** (`/dashboard`) - Personal financial overview
5. **Education** (`/education`) - Financial literacy modules
6. **Community** (`/community`) - Forums and events
7. **Loan Application** (`/loans/apply`) - End-to-end loan process

### Admin Features
1. **Admin Dashboard** (`/admin/dashboard`) - Platform management
2. **KYC Management** - Review and approve verifications
3. **Loan Processing** - Approve/reject applications
4. **User Analytics** - Platform insights and metrics

## 🤖 AI Features

### Gemini AI Integration
- **Credit Scoring**: Alternative assessment using multiple data points
- **Financial Recommendations**: Personalized advice based on user profile
- **Chat Support**: Real-time AI assistant for financial queries
- **Risk Assessment**: Bias-free evaluation for loan approvals

### Credit Scoring Factors
- Digital footprint and payment history
- Financial education completion
- Community engagement level
- KYC verification status
- Income stability indicators
- Social verification metrics

## 💳 Payment Integration

### Razorpay Features
- Processing fee collection for loans
- UPI and net banking support
- Secure payment verification
- Transaction history tracking

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Session management
- Password security with hashing

### Data Protection
- Encrypted sensitive data storage
- Secure API endpoints
- CORS protection
- Input validation and sanitization

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User/Admin login
- `POST /api/auth/signup` - User registration

### Credit Scoring
- `GET /api/credit-score` - Get user credit data
- `POST /api/credit-score` - Calculate new score

### KYC & Verification
- `POST /api/kyc/submit` - Submit KYC application
- `POST /api/digilocker/connect` - DigiLocker integration
- `POST /api/blockchain/verify` - Blockchain verification

### Payments
- `POST /api/payments/razorpay` - Create payment order
- `PUT /api/payments/razorpay` - Verify payment

### AI Services
- `POST /api/chat` - AI chat support
- `POST /api/gemini` - General AI queries

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 📊 Database Schema

### Core Tables
- `users` - User profiles and authentication
- `credit_scores` - Alternative credit scoring data
- `education_modules` - Financial literacy content
- `kyc_documents` - Verification documents
- `loan_applications` - Loan processing data
- `community_discussions` - Forum content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs
- **Demo**: Use `/demo` page for testing
- **Setup Help**: Visit `/setup` for configuration guidance

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core platform with AI credit scoring
- ✅ KYC verification system
- ✅ Financial education modules
- ✅ Basic loan application process

### Phase 2 (Planned)
- 📱 Mobile app development
- 🔗 Advanced blockchain integration
- 📈 Enhanced analytics dashboard
- 🌍 Multi-language support

### Phase 3 (Future)
- 🤖 Advanced ML models
- 🏦 Bank partnership integrations
- 📊 Real-time credit monitoring
- 🌐 International expansion

---

Built with ❤️ for financial inclusion and empowerment.
