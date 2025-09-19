# Oryntal AI - The Future of Investing is Listening

An AI-powered platform that scrapes trending stock and crypto discussions, tracks influential voices, analyzes sentiment, and generates actionable recommendations.

## 🚀 Features

- **Real-time Data Collection**: Scrapes discussions from Reddit and Twitter
- **Sentiment Analysis**: Advanced NLP with VADER and FinBERT models
- **Influencer Tracking**: Monitors key voices with credibility scoring
- **AI Recommendations**: Buy/Hold/Sell signals with detailed reasoning
- **Modern Dashboard**: React-based UI with real-time updates

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and real-time data
- **PRAW** - Reddit API wrapper
- **Twitter API v2** - Social media data
- **Hugging Face Transformers** - Sentiment analysis

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 🏃‍♂️ Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Redis

### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/oryntal_ai
REDIS_URL=redis://localhost:6379
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

**Frontend (.env.local)**
```
REACT_APP_API_URL=http://localhost:8000
```

## 📊 API Endpoints

- `GET /health` - Health check
- `GET /scrapers/reddit` - Reddit data collection
- `GET /scrapers/twitter` - Twitter data collection
- `POST /analyzer/sentiment` - Sentiment analysis
- `GET /market/prices` - Market data
- `GET /recommendations` - AI recommendations

## 🎯 Core Features

### 1. Data Collection
- **Reddit**: r/WallStreetBets, r/CryptoCurrency, r/investing
- **Twitter**: Cashtag tracking ($AAPL, $BTC, etc.)
- **Real-time**: WebSocket connections for live updates

### 2. Sentiment Analysis
- **VADER**: Fast sentiment scoring for short texts
- **FinBERT**: Financial context-aware analysis
- **Emoji/Meme**: Special handling for social media language

### 3. Influencer Tracking
- **Credibility Scoring**: Historical accuracy tracking
- **Platform Monitoring**: Twitter and Reddit influencers
- **Impact Analysis**: Weighted influence on market sentiment

### 4. AI Recommendations
- **Multi-signal**: Combines sentiment, price action, and influence
- **Explainability**: Detailed reasoning for each recommendation
- **Confidence Scoring**: Probability-based confidence levels

## 🎨 UI Components

### Dashboard
- Real-time sentiment charts
- Trending stocks and crypto
- Market overview statistics
- Interactive data tables

### Influencers
- Credibility rankings
- Platform-specific metrics
- Historical accuracy tracking
- Follower growth analysis

### Alerts
- Real-time notifications
- Severity-based filtering
- Custom alert rules
- Historical alert logs

### Recommendations
- AI-generated signals
- Detailed reasoning
- Confidence scoring
- Price target predictions

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Docker Setup
```bash
docker-compose up -d
```

## 📈 Roadmap

- [ ] Real-time WebSocket connections
- [ ] Advanced charting with TradingView
- [ ] Mobile app (React Native)
- [ ] Portfolio integration
- [ ] Social trading features
- [ ] Advanced ML models

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@oryntal.ai

---

**Oryntal AI** - The future of investing is listening. 🚀
