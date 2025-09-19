import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toString();
}

export function getSentimentColor(sentiment: number): string {
  if (sentiment > 0.1) return 'text-success-600';
  if (sentiment < -0.1) return 'text-danger-600';
  return 'text-gray-600';
}

export function getSentimentLabel(sentiment: number): string {
  if (sentiment > 0.3) return 'Very Bullish';
  if (sentiment > 0.1) return 'Bullish';
  if (sentiment > -0.1) return 'Neutral';
  if (sentiment > -0.3) return 'Bearish';
  return 'Very Bearish';
}

export function getActionColor(action: 'buy' | 'hold' | 'sell'): string {
  switch (action) {
    case 'buy':
      return 'text-success-600 bg-success-50';
    case 'sell':
      return 'text-danger-600 bg-danger-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}
