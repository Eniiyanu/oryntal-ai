import time
from typing import Dict, Tuple


class InMemoryOtpStore:
	def __init__(self):
		self._store: Dict[str, Tuple[str, float]] = {}

	def set_code(self, email: str, code: str, ttl_seconds: int = 600) -> None:
		expires_at = time.time() + ttl_seconds
		self._store[email.lower()] = (code, expires_at)

	def verify_code(self, email: str, code: str) -> bool:
		record = self._store.get(email.lower())
		if not record:
			return False
		stored_code, expires_at = record
		if time.time() > expires_at:
			# expire
			self._store.pop(email.lower(), None)
			return False
		if stored_code == code:
			self._store.pop(email.lower(), None)
			return True
		return False


otp_store = InMemoryOtpStore()


