import httpx
import asyncio
from typing import Dict, List, Optional, Any
from app.core.config import settings


class MarketDataService:
    def __init__(self):
        self.alpha_vantage_key = settings.alpha_vantage_api_key
        self.fmp_key = settings.financial_modeling_prep_api_key
        self.coingecko_key = settings.coingecko_api_key

    async def get_stock_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get real-time stock quote using Alpha Vantage"""
        try:
            async with httpx.AsyncClient() as client:
                url = "https://www.alphavantage.co/query"
                params = {
                    "function": "GLOBAL_QUOTE",
                    "symbol": symbol,
                    "apikey": self.alpha_vantage_key
                }
                response = await client.get(url, params=params)
                data = response.json()
                
                if "Global Quote" in data:
                    quote = data["Global Quote"]
                    return {
                        "symbol": quote.get("01. symbol"),
                        "price": float(quote.get("05. price", 0)),
                        "change": float(quote.get("09. change", 0)),
                        "change_percent": quote.get("10. change percent", "0%").replace("%", ""),
                        "volume": int(quote.get("06. volume", 0)),
                        "high": float(quote.get("03. high", 0)),
                        "low": float(quote.get("04. low", 0)),
                        "open": float(quote.get("02. open", 0)),
                        "previous_close": float(quote.get("08. previous close", 0)),
                        "timestamp": quote.get("07. latest trading day")
                    }
                return None
        except Exception as e:
            print(f"Error fetching stock quote for {symbol}: {e}")
            return None

    async def get_crypto_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get real-time crypto quote using CoinGecko"""
        try:
            # Map common symbols to CoinGecko IDs
            crypto_map = {
                "BTC": "bitcoin",
                "ETH": "ethereum",
                "SOL": "solana",
                "ADA": "cardano",
                "DOT": "polkadot",
                "MATIC": "matic-network",
                "AVAX": "avalanche-2",
                "LINK": "chainlink",
                "UNI": "uniswap",
                "ATOM": "cosmos"
            }
            
            crypto_id = crypto_map.get(symbol.upper(), symbol.lower())
            
            async with httpx.AsyncClient() as client:
                url = f"https://api.coingecko.com/api/v3/simple/price"
                params = {
                    "ids": crypto_id,
                    "vs_currencies": "usd",
                    "include_24hr_change": "true",
                    "include_24hr_vol": "true",
                    "include_market_cap": "true"
                }
                
                headers = {}
                if self.coingecko_key:
                    headers["x-cg-demo-api-key"] = self.coingecko_key
                
                response = await client.get(url, params=params, headers=headers)
                data = response.json()
                
                if crypto_id in data:
                    crypto_data = data[crypto_id]
                    return {
                        "symbol": symbol.upper(),
                        "price": crypto_data.get("usd", 0),
                        "change_24h": crypto_data.get("usd_24h_change", 0),
                        "volume_24h": crypto_data.get("usd_24h_vol", 0),
                        "market_cap": crypto_data.get("usd_market_cap", 0),
                        "timestamp": "24h"
                    }
                return None
        except Exception as e:
            print(f"Error fetching crypto quote for {symbol}: {e}")
            return None

    async def get_market_overview(self) -> Dict[str, Any]:
        """Get market overview data"""
        try:
            # Get major indices and crypto data
            symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"]
            crypto_symbols = ["BTC", "ETH", "SOL", "ADA"]
            
            # Fetch stock data
            stock_tasks = [self.get_stock_quote(symbol) for symbol in symbols]
            crypto_tasks = [self.get_crypto_quote(symbol) for symbol in crypto_symbols]
            
            stock_results = await asyncio.gather(*stock_tasks, return_exceptions=True)
            crypto_results = await asyncio.gather(*crypto_tasks, return_exceptions=True)
            
            # Filter out None results and exceptions
            stocks = [result for result in stock_results if isinstance(result, dict)]
            cryptos = [result for result in crypto_results if isinstance(result, dict)]
            
            return {
                "stocks": stocks,
                "cryptocurrencies": cryptos,
                "timestamp": "real-time",
                "total_stocks": len(stocks),
                "total_cryptos": len(cryptos)
            }
        except Exception as e:
            print(f"Error fetching market overview: {e}")
            return {"stocks": [], "cryptocurrencies": [], "error": str(e)}

    async def get_trending_stocks(self) -> List[Dict[str, Any]]:
        """Get trending stocks using Financial Modeling Prep"""
        try:
            async with httpx.AsyncClient() as client:
                url = "https://financialmodelingprep.com/api/v3/stock/actives"
                params = {"apikey": self.fmp_key}
                response = await client.get(url, params=params)
                data = response.json()
                
                trending = []
                for stock in data[:10]:  # Top 10
                    trending.append({
                        "symbol": stock.get("ticker"),
                        "price": stock.get("price", 0),
                        "change": stock.get("changes", 0),
                        "change_percent": stock.get("changesPercentage", "0%").replace("%", ""),
                        "volume": stock.get("volume", 0),
                        "market_cap": stock.get("marketCap", 0)
                    })
                return trending
        except Exception as e:
            print(f"Error fetching trending stocks: {e}")
            return []

    async def get_trending_crypto(self) -> List[Dict[str, Any]]:
        """Get trending cryptocurrencies using CoinGecko"""
        try:
            async with httpx.AsyncClient() as client:
                url = "https://api.coingecko.com/api/v3/coins/markets"
                params = {
                    "vs_currency": "usd",
                    "order": "market_cap_desc",
                    "per_page": 10,
                    "page": 1,
                    "sparkline": False,
                    "price_change_percentage": "24h"
                }
                
                headers = {}
                if self.coingecko_key:
                    headers["x-cg-demo-api-key"] = self.coingecko_key
                
                response = await client.get(url, params=params, headers=headers)
                data = response.json()
                
                trending = []
                for crypto in data:
                    trending.append({
                        "symbol": crypto.get("symbol", "").upper(),
                        "name": crypto.get("name"),
                        "price": crypto.get("current_price", 0),
                        "change_24h": crypto.get("price_change_percentage_24h", 0),
                        "market_cap": crypto.get("market_cap", 0),
                        "volume_24h": crypto.get("total_volume", 0),
                        "image": crypto.get("image")
                    })
                return trending
        except Exception as e:
            print(f"Error fetching trending crypto: {e}")
            return []

    async def get_company_profile(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get company profile using Financial Modeling Prep"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"https://financialmodelingprep.com/api/v3/profile/{symbol}"
                params = {"apikey": self.fmp_key}
                response = await client.get(url, params=params)
                data = response.json()
                
                if data and len(data) > 0:
                    profile = data[0]
                    return {
                        "symbol": profile.get("symbol"),
                        "company_name": profile.get("companyName"),
                        "description": profile.get("description"),
                        "sector": profile.get("sector"),
                        "industry": profile.get("industry"),
                        "website": profile.get("website"),
                        "logo": profile.get("image"),
                        "market_cap": profile.get("mktCap"),
                        "employees": profile.get("fullTimeEmployees"),
                        "ceo": profile.get("ceo"),
                        "country": profile.get("country")
                    }
                return None
        except Exception as e:
            print(f"Error fetching company profile for {symbol}: {e}")
            return None


# Global market data service instance
market_data_service = MarketDataService()
