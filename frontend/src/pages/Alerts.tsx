import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Bell,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import { formatCurrency, formatPercent, getSentimentColor } from '../lib/utils';

interface Alert {
  id: string;
  type: 'sentiment_spike' | 'price_alert' | 'volume_spike' | 'influencer_mention';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  symbol?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  sentiment?: number;
  timestamp: string;
  read: boolean;
}

// Mock data
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'sentiment_spike',
    severity: 'high',
    title: 'Sentiment Spike Detected',
    description: 'AAPL sentiment jumped 45% in the last hour with 2,340 new mentions',
    symbol: 'AAPL',
    sentiment: 0.45,
    timestamp: '2024-01-15T14:30:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'price_alert',
    severity: 'medium',
    title: 'Price Movement Alert',
    description: 'TSLA dropped 5.2% in the last 30 minutes',
    symbol: 'TSLA',
    price: 248.87,
    change: -13.45,
    changePercent: -5.2,
    timestamp: '2024-01-15T14:15:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'influencer_mention',
    severity: 'critical',
    title: 'Elon Musk Mention',
    description: 'Elon Musk tweeted about DOGE, causing 15,000+ mentions in 10 minutes',
    symbol: 'DOGE',
    timestamp: '2024-01-15T13:45:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'volume_spike',
    severity: 'medium',
    title: 'Volume Spike',
    description: 'NVDA trading volume increased 300% above average',
    symbol: 'NVDA',
    timestamp: '2024-01-15T13:20:00Z',
    read: true,
  },
  {
    id: '5',
    type: 'sentiment_spike',
    severity: 'low',
    title: 'Sentiment Change',
    description: 'BTC sentiment improved by 12% in the last hour',
    symbol: 'BTC',
    sentiment: 0.12,
    timestamp: '2024-01-15T12:55:00Z',
    read: true,
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread':
        return !alert.read;
      case 'critical':
        return alert.severity === 'critical';
      default:
        return true;
    }
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sentiment_spike':
        return <TrendingUp className="h-5 w-5" />;
      case 'price_alert':
        return <TrendingDown className="h-5 w-5" />;
      case 'volume_spike':
        return <AlertTriangle className="h-5 w-5" />;
      case 'influencer_mention':
        return <Bell className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600">Real-time market and sentiment alerts</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">{criticalCount} Critical</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">{unreadCount} Unread</span>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-secondary text-sm"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-lg bg-gray-100 p-1 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'unread'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'critical'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Critical ({criticalCount})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'unread' ? 'All alerts have been read.' : 
               filter === 'critical' ? 'No critical alerts at this time.' : 
               'No alerts to display.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`card border-l-4 ${getSeverityColor(alert.severity)} ${
                !alert.read ? 'ring-2 ring-primary-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                      {!alert.read && (
                        <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    
                    {/* Alert Details */}
                    <div className="flex items-center space-x-4 text-sm">
                      {alert.symbol && (
                        <span className="font-medium text-gray-900">${alert.symbol}</span>
                      )}
                      {alert.price && (
                        <span className="text-gray-600">{formatCurrency(alert.price)}</span>
                      )}
                      {alert.change !== undefined && alert.changePercent !== undefined && (
                        <span className={`font-medium ${
                          alert.change >= 0 ? 'text-success-600' : 'text-danger-600'
                        }`}>
                          {formatPercent(alert.changePercent)}
                        </span>
                      )}
                      {alert.sentiment !== undefined && (
                        <span className={`font-medium ${getSentimentColor(alert.sentiment)}`}>
                          Sentiment: {(alert.sentiment * 100).toFixed(1)}%
                        </span>
                      )}
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {!alert.read && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
