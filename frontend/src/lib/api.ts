import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure POST sends JSON bodies (backend expects JSON, not query params)
api.interceptors.request.use((config) => {
  if (config.method === 'post' && config.data && typeof config.data !== 'string') {
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// API endpoints
export const apiEndpoints = {
  health: () => api.get('/health'),
  
  // Market Data
  getMarketPrices: (symbol: string) => api.get(`/market/prices?symbol=${symbol}`),
  getMarketOverview: () => api.get('/market/overview'),
  getTrendingStocks: () => api.get('/market/trending/stocks'),
  getTrendingCrypto: () => api.get('/market/trending/crypto'),
  getCompanyProfile: (symbol: string) => api.get(`/market/profile/${symbol}`),
  
  // Authentication
  sendOTP: (email: string, name?: string) => api.post('/auth/send-otp', { email, name }),
  verifyOTP: (email: string, code: string) => api.post('/auth/verify-otp', { email, code }),
  sendPasswordReset: (email: string, name?: string) => api.post('/auth/send-password-reset', { email, name }),
  register: (data: { firstName?: string; lastName?: string; email: string; password: string }) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),

  // Twitter search
  twitterSearch: (query: string, maxResults = 10) => api.get(`/social/twitter/search`, { params: { query, max_results: maxResults } }),
  
  // Placeholder endpoints
  scrapeReddit: () => api.get('/scrapers/reddit'),
  scrapeTwitter: () => api.get('/scrapers/twitter'),
  analyzeSentiment: (payload: any) => api.post('/analyzer/sentiment', payload),
  getRecommendations: (symbol?: string) => api.get(`/recommendations${symbol ? `?symbol=${symbol}` : ''}`),
};

// Types
export interface SentimentData {
  symbol: string;
  sentiment: number;
  confidence: number;
  source: 'reddit' | 'twitter';
  timestamp: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface Recommendation {
  symbol: string;
  action: 'buy' | 'hold' | 'sell';
  confidence: number;
  reasoning: string;
  sentiment: number;
  priceTarget?: number;
  timestamp: string;
}

export interface Influencer {
  id: string;
  name: string;
  platform: 'twitter' | 'reddit';
  credibility: number;
  followers: number;
  accuracy: number;
  lastActive: string;
}
