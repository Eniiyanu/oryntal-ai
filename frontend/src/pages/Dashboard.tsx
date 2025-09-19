import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users,
  DollarSign,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { apiEndpoints, type SentimentData, type MarketData } from '../lib/api';
import { formatCurrency, formatPercent, getSentimentColor, getSentimentLabel } from '../lib/utils';

// Mock data for demonstration
const mockSentimentData = [
  { time: '00:00', sentiment: 0.2, mentions: 45 },
  { time: '04:00', sentiment: 0.1, mentions: 52 },
  { time: '08:00', sentiment: 0.3, mentions: 78 },
  { time: '12:00', sentiment: 0.4, mentions: 95 },
  { time: '16:00', sentiment: 0.2, mentions: 67 },
  { time: '20:00', sentiment: 0.1, mentions: 43 },
];

// Remove mockTopStocks and mockTopCryptos; we'll derive from marketData

type AssetRow = { symbol: string; price: number; change: number; changePercent: number; sentiment?: number; mentions?: number };

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'stocks' | 'crypto'>('stocks');
  const [marketData, setMarketData] = useState<any>(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('');

  const fetchMarketData = async () => {
    try {
      setRefreshing(true);
      setError('');
      
      // Fetch market overview
      const overviewResponse = await apiEndpoints.getMarketOverview();
      setMarketData(overviewResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to load market data');
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const stats = [
    {
      name: 'Total Mentions',
      value: '12,543',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Activity,
    },
    {
      name: 'Active Influencers',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      name: 'Avg Sentiment',
      value: '+0.15',
      change: '+0.03',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      name: 'Alerts Today',
      value: '23',
      change: '-5',
      changeType: 'negative' as const,
      icon: AlertTriangle,
    },
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Real-time market sentiment and trending assets</p>
        </div>
        <button
          onClick={fetchMarketData}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sentiment Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sentiment" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mentions Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mentions Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockSentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mentions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trending Assets */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Trending Assets</h3>
          <div className="flex items-center space-x-3">
            <input
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              placeholder="Filter symbol..."
              className="input-field h-9 w-40"
            />
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab('stocks')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'stocks'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Stocks
              </button>
              <button
                onClick={() => setActiveTab('crypto')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'crypto'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Crypto
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sentiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mentions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {((): AssetRow[] => {
                const assets: AssetRow[] = (activeTab === 'stocks'
                  ? (marketData?.stocks || []).map((s: any) => ({ symbol: s.symbol, price: s.price, change: s.change, changePercent: parseFloat(s.change_percent || 0) }))
                  : (marketData?.cryptocurrencies || []).map((c: any) => ({ symbol: c.symbol, price: c.price, change: c.change_24h, changePercent: c.change_24h }))
                ) as AssetRow[];
                const filtered = filter ? assets.filter(a => a.symbol?.toUpperCase().includes(filter.toUpperCase())) : assets;
                const start = (page - 1) * pageSize;
                return filtered.slice(start, start + pageSize);
              })().map((asset) => (
                <tr key={asset.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{asset.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(asset.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm flex items-center ${
                      asset.change >= 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {asset.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {formatPercent(asset.changePercent)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getSentimentColor(asset.sentiment ?? 0)}`}>
                      {getSentimentLabel(asset.sentiment ?? 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{(asset.mentions ?? 0).toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">Page {page}</div>
          <div className="space-x-2">
            <button className="btn-secondary py-1" disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</button>
            <button className="btn-primary py-1" onClick={() => setPage(p => p+1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
