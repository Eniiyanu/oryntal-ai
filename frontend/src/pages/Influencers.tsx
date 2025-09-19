import React, { useState, useEffect } from 'react';
import { 
  Twitter, 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  Star,
  Users,
  Activity
} from 'lucide-react';
import { type Influencer } from '../lib/api';
import { formatNumber } from '../lib/utils';

// Mock data
const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Elon Musk',
    platform: 'twitter',
    credibility: 0.85,
    followers: 150000000,
    accuracy: 0.72,
    lastActive: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Cathie Wood',
    platform: 'twitter',
    credibility: 0.78,
    followers: 2500000,
    accuracy: 0.68,
    lastActive: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    name: 'WSB_Official',
    platform: 'reddit',
    credibility: 0.65,
    followers: 15000000,
    accuracy: 0.45,
    lastActive: '2024-01-15T08:45:00Z',
  },
  {
    id: '4',
    name: 'CryptoWhale',
    platform: 'twitter',
    credibility: 0.72,
    followers: 850000,
    accuracy: 0.58,
    lastActive: '2024-01-15T07:20:00Z',
  },
  {
    id: '5',
    name: 'StockGuru',
    platform: 'reddit',
    credibility: 0.68,
    followers: 3200000,
    accuracy: 0.62,
    lastActive: '2024-01-15T06:10:00Z',
  },
];

export default function Influencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'credibility' | 'followers' | 'accuracy'>('credibility');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setInfluencers(mockInfluencers);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const sortedInfluencers = [...influencers].sort((a, b) => {
    switch (sortBy) {
      case 'credibility':
        return b.credibility - a.credibility;
      case 'followers':
        return b.followers - a.followers;
      case 'accuracy':
        return b.accuracy - a.accuracy;
      default:
        return 0;
    }
  });

  const getCredibilityColor = (credibility: number) => {
    if (credibility >= 0.8) return 'text-success-600 bg-success-50';
    if (credibility >= 0.6) return 'text-primary-600 bg-primary-50';
    if (credibility >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-danger-600 bg-danger-50';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.7) return 'text-success-600';
    if (accuracy >= 0.5) return 'text-yellow-600';
    return 'text-danger-600';
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
        <h1 className="text-2xl font-bold text-gray-900">Influencers</h1>
        <p className="text-gray-600">Track key voices and their credibility scores</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Influencers</p>
              <p className="text-2xl font-semibold text-gray-900">{influencers.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Credibility</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(influencers.reduce((acc, inf) => acc + inf.credibility, 0) / influencers.length * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Accuracy</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(influencers.reduce((acc, inf) => acc + inf.accuracy, 0) / influencers.length * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Influencers Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Influencer Rankings</h3>
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setSortBy('credibility')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'credibility'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Credibility
            </button>
            <button
              onClick={() => setSortBy('followers')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'followers'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setSortBy('accuracy')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                sortBy === 'accuracy'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Accuracy
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Influencer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Followers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInfluencers.map((influencer) => (
                <tr key={influencer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          {influencer.platform === 'twitter' ? (
                            <Twitter className="h-5 w-5 text-blue-400" />
                          ) : (
                            <MessageCircle className="h-5 w-5 text-orange-400" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{influencer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      influencer.platform === 'twitter' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {influencer.platform === 'twitter' ? 'Twitter' : 'Reddit'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatNumber(influencer.followers)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCredibilityColor(influencer.credibility)}`}>
                      {(influencer.credibility * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getAccuracyColor(influencer.accuracy)}`}>
                      {(influencer.accuracy * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(influencer.lastActive).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
