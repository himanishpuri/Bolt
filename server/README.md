# Stock Pulse - Node.js Backend

A comprehensive stock market and investment platform built with Node.js, Express.js, and MongoDB. This application has been migrated from Django to provide a modern, scalable backend solution.

## Features

### 🔐 Authentication System
- Custom user registration and login with JWT tokens
- Secure password hashing with bcrypt
- Token refresh and blacklisting functionality
- User profile management with areas of interest

### 📈 Investment Section
- **Portfolio Management**: Create and manage investment portfolios
- **Backtesting**: Analyze portfolio performance over time
- **Moving Averages**: Calculate SMA and EMA for stocks
- **Top Stocks**: View top performing and worst performing stocks
- **Sector Analysis**: Get sector information for stock symbols

### 📰 News Section
- **News Analysis**: AI-powered stock news analysis and sentiment
- **Market Sentiment**: Overall market sentiment analysis
- **Personalized News**: News based on user's areas of interest
- **Chat Sessions**: Interactive news analysis sessions

### 📚 Learning Section
- **YouTube Integration**: Search for educational content
- **Educational Chat**: AI-powered learning assistance
- **Learning Resources**: Curated educational materials
- **Personalized Recommendations**: Learning content based on user interests
- **Progress Tracking**: Track learning progress

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Stock Data**: Yahoo Finance API
- **AI Integration**: On-Demand.io API
- **Real-time**: Socket.io
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Redis (optional, for caching)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/stock_pulse
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   
   # Server
   PORT=8000
   NODE_ENV=development
   
   # API Keys
   API_KEY=your-on-demand-api-key
   YOUTUBE_API_KEY=your-youtube-api-key
   
   # Redis (optional)
   REDIS_URL=redis://localhost:6379
   
   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/users` - Get all users (staff only)
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile

### Investment (`/investment`)
- `GET /investment/backtesting` - Portfolio performance analysis
- `GET /investment/moving-averages/:ticker` - Moving averages for stock
- `GET /investment/top-stocks` - Top performing stocks
- `GET /investment/sector/:symbol` - Get sector for symbol
- `GET /investment/portfolios` - Get user portfolios
- `POST /investment/portfolios` - Create new portfolio
- `GET /investment/portfolios/:id` - Get specific portfolio
- `PUT /investment/portfolios/:id` - Update portfolio
- `DELETE /investment/portfolios/:id` - Delete portfolio

### News (`/news`)
- `GET /news/chat-session` - Get news analysis for user's interests
- `GET /news/stock-news/:ticker` - Get news analysis for specific stock
- `GET /news/market-sentiment` - Overall market sentiment
- `GET /news/portfolios` - Portfolio-related news endpoints
- `POST /news/portfolios` - Create portfolio via news section
- `GET /news/portfolios/:id` - Get portfolio details
- `PUT /news/portfolios/:id` - Update portfolio
- `DELETE /news/portfolios/:id` - Delete portfolio

### Learning (`/learning`)
- `GET /learning/youtube-search` - Search YouTube for educational content
- `GET /learning/educational-chat` - AI-powered educational content
- `GET /learning/resources/:concept` - Get learning resources for concept
- `GET /learning/recommendations` - Personalized learning recommendations
- `POST /learning/progress` - Track learning progress

### Health Check
- `GET /health` - Application health status

## Migration from Django

This application has been successfully migrated from Django to Node.js with the following key changes:

### Architecture Changes
- **ORM**: Django ORM → Mongoose ODM
- **Database**: SQLite → MongoDB
- **Authentication**: Django Sessions + SimpleJWT → Custom JWT implementation
- **API Framework**: Django REST Framework → Express.js with custom middleware
- **WebSockets**: Django Channels → Socket.io
- **Task Queue**: Celery → Node.js native async/await

### Feature Parity
All Django features have been preserved and enhanced:
- ✅ Custom user authentication system
- ✅ Portfolio management and backtesting
- ✅ Stock data analysis (moving averages, etc.)
- ✅ News analysis with AI integration
- ✅ YouTube educational content search
- ✅ Real-time capabilities
- ✅ API validation and error handling

### Performance Improvements
- **Async/Await**: Better handling of asynchronous operations
- **Connection Pooling**: MongoDB connection pooling
- **Caching**: Redis integration for improved performance
- **Rate Limiting**: Built-in rate limiting for API protection

## Development

### Project Structure
```
server/
├── index.js              # Main application entry point
├── models/               # Mongoose models
│   ├── User.js          # User model (equivalent to Django's CustomUser)
│   └── Portfolio.js     # Portfolio model
├── routes/              # Express routes
│   ├── auth.js         # Authentication endpoints
│   ├── investment.js   # Investment-related endpoints
│   ├── news.js         # News analysis endpoints
│   └── learning.js     # Learning platform endpoints
├── middleware/          # Custom middleware
│   └── auth.js         # Authentication middleware
├── utils/              # Utility functions
│   └── jwt.js          # JWT utilities
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

### Running Tests
```bash
npm test
```

### Code Style
```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure MongoDB Atlas or production database
- [ ] Set up Redis for caching
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure SSL/TLS

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 8000

CMD ["npm", "start"]
```

## API Documentation

### Authentication Flow
1. Register: `POST /auth/register`
2. Login: `POST /auth/login` (returns access + refresh tokens)
3. Access protected routes with: `Authorization: Bearer <access_token>`
4. Refresh token when expired: `POST /auth/refresh`
5. Logout: `POST /auth/logout`

### Error Handling
All endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error message",
  "errors": ["Validation errors array"]
}
```

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable via environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License

## Support

For issues and questions, please create an issue in the repository or contact the development team. 