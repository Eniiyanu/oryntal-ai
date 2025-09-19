import os
from typing import List, Dict, Any
import httpx

from app.services.market_data_service import market_data_service
from app.core.config import settings


class RecommendationService:
	def __init__(self):
		self.hf_api_key = os.getenv("HUGGINGFACE_API_KEY", "")
		self.model = "ProsusAI/finbert"

	async def _analyze_sentences(self, texts: List[str]) -> List[Dict[str, Any]]:
		# Use Hugging Face Inference API for FinBERT sentiment
		headers = {"Authorization": f"Bearer {self.hf_api_key}"} if self.hf_api_key else {}
		url = f"https://api-inference.huggingface.co/models/{self.model}"
		async with httpx.AsyncClient(timeout=40) as client:
			resp = await client.post(url, headers=headers, json={"inputs": texts})
			resp.raise_for_status()
			return resp.json()

	@staticmethod
	def _score_to_numeric(labels: List[Dict[str, Any]]) -> float:
		# Convert FinBERT output into a numeric sentiment score [-1, 1]
		label_map = {"positive": 1.0, "neutral": 0.0, "negative": -1.0}
		if not labels:
			return 0.0
		best = max(labels, key=lambda x: x.get("score", 0))
		return label_map.get(best.get("label", "neutral").lower(), 0.0) * float(best.get("score", 0))

	async def recommend(self, symbol: str, recent_texts: List[str]) -> Dict[str, Any]:
		# Analyze sentiment
		try:
			results = await self._analyze_sentences(recent_texts or [f"Outlook for {symbol}."])
		except Exception:
			results = []
		sentiment_scores = []
		if isinstance(results, list):
			for item in results:
				if isinstance(item, list):
					sentiment_scores.append(self._score_to_numeric(item))
				elif isinstance(item, dict) and "label" in item:
					sentiment_scores.append(self._score_to_numeric([item]))
		sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.0

		# Get price trend
		market = await market_data_service.get_stock_quote(symbol) or await market_data_service.get_crypto_quote(symbol)
		price = float(market.get("price", 0)) if market else 0
		change = float(market.get("change", market.get("change_24h", 0))) if market else 0

		# Simple rules combining sentiment and price momentum
		action = "hold"
		confidence = max(0.5, min(0.95, abs(sentiment) + (0.1 if change else 0)))
		if sentiment > 0.2 and change >= 0:
			action = "buy"
		elif sentiment < -0.2 and change <= 0:
			action = "sell"

		return {
			"symbol": symbol.upper(),
			"action": action,
			"confidence": round(confidence, 2),
			"reasoning": f"Sentiment={sentiment:.2f}, price change={change:.2f}.",
			"sentiment": round(sentiment, 2),
			"price": price,
		}


recommendation_service = RecommendationService()


