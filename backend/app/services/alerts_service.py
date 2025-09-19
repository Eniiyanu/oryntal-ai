from typing import List, Dict, Any
import asyncio
from app.services.market_data_service import market_data_service
from app.services.twitter_service import twitter_service
from app.services.recommendation_service import recommendation_service


class AlertsService:
	async def generate(self) -> List[Dict[str, Any]]:
		alerts: List[Dict[str, Any]] = []
		# Sample universe
		symbols = ["AAPL", "TSLA", "NVDA", "MSFT", "BTC", "ETH"]
		for sym in symbols:
			# Price/volume alerts from market services
			stock = await market_data_service.get_stock_quote(sym)
			crypto = None
			if not stock:
				crypto = await market_data_service.get_crypto_quote(sym)
			asset = stock or crypto
			if not asset:
				continue
			change = asset.get("change") or asset.get("change_24h") or 0
			if change and abs(float(change)) >= 3:
				alerts.append({
					"id": f"price-{sym}",
					"type": "price_alert",
					"severity": "high" if abs(float(change)) >= 5 else "medium",
					"title": "Price Movement Alert",
					"description": f"{sym} moved {float(change):.2f}% in the last day",
					"symbol": sym,
					"changePercent": float(change),
					"timestamp": "now",
					"read": False,
				})
			# Sentiment spikes from tweets
			try:
				res = await twitter_service.search_recent(query=f"${sym} lang:en -is:retweet", max_results=10)
				texts = [t.get("text", "") for t in res.get("data", [])]
				reco = await recommendation_service.recommend(sym, texts)
				if abs(float(reco.get("sentiment", 0))) >= 0.4:
					alerts.append({
						"id": f"sentiment-{sym}",
						"type": "sentiment_spike",
						"severity": "high",
						"title": "Sentiment Spike",
						"description": f"{sym} sentiment={reco.get('sentiment')}",
						"symbol": sym,
						"sentiment": reco.get("sentiment", 0),
						"timestamp": "now",
						"read": False,
					})
			except Exception:
				pass
		return alerts


alerts_service = AlertsService()


