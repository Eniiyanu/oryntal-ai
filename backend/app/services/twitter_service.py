import httpx
from typing import Dict, Any
from app.core.config import settings


class TwitterService:
	def __init__(self):
		self.bearer = settings.twitter_bearer_token

	async def search_recent(self, query: str, max_results: int = 10) -> Dict[str, Any]:
		url = "https://api.twitter.com/2/tweets/search/recent"
		headers = {"Authorization": f"Bearer {self.bearer}"}
		params = {
			"query": query,
			"max_results": max(10, min(max_results, 100)),
			"tweet.fields": "created_at,public_metrics,lang,entities,author_id",
		}
		async with httpx.AsyncClient(timeout=20) as client:
			resp = await client.get(url, headers=headers, params=params)
			resp.raise_for_status()
			return resp.json()


twitter_service = TwitterService()


