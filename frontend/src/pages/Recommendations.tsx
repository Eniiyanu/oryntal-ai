import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Brain,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';
import { type Recommendation } from '../lib/api';
import { formatCurrency, formatPercent, getActionColor, getSentimentColor, getSentimentLabel } from '../lib/utils';

// Mock data
const mockRecommendations: Recommendation[] = [
  {
    symbol: 'NVDA',
    action: 'buy',
    confidence: 0.85,
    reasoning: 'Strong AI narrative momentum with 40% positive sentiment spike. Technical indicators show bullish breakout pattern.',
    sentiment: 0.4,
    priceTarget: 500.00,
    timestamp: '2024-01-15T14:30:00Z',
  },
  {
    symbol: 'TSLA',
    action: 'sell',
    confidence: 0.72,
    reasoning: 'Negative sentiment trend (-25% in 24h) with increased bearish mentions. Price action suggests downward pressure.',
    sentiment: -0.25,
    priceTarget: 220.00,
    timestamp: '2024-01-15T14:15:00Z',
  },
  {
    symbol: 'AAPL',
    action: 'hold',
    confidence: 0.68,
    reasoning: 'Mixed signals with neutral sentiment. Wait for clearer direction from upcoming earnings or market catalysts.',
    sentiment: 0.05,
    timestamp: '2024-01-15T14:00:00Z',
  },
  {
    symbol: 'BTC',
    action: 'buy',
    confidence: 0.78,
    reasoning: 'Institutional adoption narrative gaining traction. Sentiment improving with 15% positive shift in crypto community.',
    sentiment: 0.15,
    priceTarget: 50000.00,
    timestamp: '2024-01-15T13:45:00Z',
  },
  {
    symbol: 'MSFT',
    action: 'hold',
    confidence: 0.61,
    reasoning: 'Stable sentiment with moderate AI-related mentions. No significant catalysts in near term.',
    sentiment: 0.08,
    timestamp: '2024-01-15T13:30:00Z',
  },
];

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'hold'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesFilter = filter === 'all' || rec.action === filter;
    const matchesSearch = rec.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy':
        return <TrendingUp className="h-5 w-5" />;
      case 'sell':
        return <TrendingDown className="h-5 w-5" />;
      case 'hold':
        return <Minus className="h-5 w-5" />;
      default:
        return <Minus className="h-5 w-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success-600 bg-success-50';
    if (confidence >= 0.6) return 'text-primary-600 bg-primary-50';
    if (confidence >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-danger-600 bg-danger-50';
  };

  const stats = {
    total: recommendations.length,
    buy: recommendations.filter(r => r.action === 'buy').length,
    sell: recommendations.filter(r => r.action === 'sell').length,
    hold: recommendations.filter(r => r.action === 'hold').length,
    avgConfidence: recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
        <p className="text-gray-600">AI-powered buy, hold, and sell recommendations with detailed reasoning</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Recommendations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Buy Signals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.buy}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-danger-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sell Signals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.sell}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Confidence</p>
              <p className="text-2xl font-semibold text-gray-900">{(stats.avgConfidence * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('buy')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              filter === 'buy'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Buy ({stats.buy})
          </button>
          <button
            onClick={() => setFilter('sell')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              filter === 'sell'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sell ({stats.sell})
          </button>
          <button
            onClick={() => setFilter('hold')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              filter === 'hold'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hold ({stats.hold})
          </button>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No recommendations match your search.' : 'No recommendations available at this time.'}
            </p>
          </div>
        ) : (
          filteredRecommendations.map((rec) => (
            <div key={rec.symbol} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-lg ${getActionColor(rec.action)}`}>
                      {getActionIcon(rec.action)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">${rec.symbol}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(rec.action)}`}>
                        {rec.action.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                        {(rec.confidence * 100).toFixed(0)}% Confidence
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{rec.reasoning}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Sentiment:</span>
                        <span className={`ml-2 font-medium ${getSentimentColor(rec.sentiment)}`}>
                          {getSentimentLabel(rec.sentiment)}
                        </span>
                      </div>
                      {rec.priceTarget && (
                        <div>
                          <span className="text-gray-500">Price Target:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {formatCurrency(rec.priceTarget)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Generated:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {new Date(rec.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
