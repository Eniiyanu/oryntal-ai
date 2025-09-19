from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.services.market_data_service import market_data_service
from app.services.email_service import email_service
from app.services.otp_store import otp_store
from app.services.twitter_service import twitter_service
from app.db import get_db, Base, engine
from app.services.auth_service import (
	create_user,
	get_user_by_email,
	verify_password,
	create_access_token,
)
from sqlalchemy.orm import Session
from app.services.recommendation_service import recommendation_service
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db import get_db


api_router = APIRouter()
# Initialize tables
Base.metadata.create_all(bind=engine)


class RegisterRequest(BaseModel):
	firstName: Optional[str] = ""
	lastName: Optional[str] = ""
	email: EmailStr
	password: str


@api_router.post("/auth/register")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(
        db,
        email=payload.email,
        password=payload.password,
        first_name=payload.firstName or "",
        last_name=payload.lastName or "",
    )
    otp = email_service.generate_otp()
    otp_store.set_code(payload.email, otp)
    email_service.send_otp_email(payload.email, otp, (payload.firstName or "User"))
    return {"id": user.id, "email": user.email}


class LoginRequest(BaseModel):
	email: EmailStr
	password: str


@api_router.post("/auth/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email, "uid": user.id})
    return {"access_token": token, "token_type": "bearer"}


# Market Data Endpoints
@api_router.get("/market/prices")
async def get_market_prices(symbol: str):
	"""Get real-time market prices for stocks and crypto"""
	try:
		# Try stock first
		stock_data = await market_data_service.get_stock_quote(symbol)
		if stock_data:
			return {"type": "stock", "data": stock_data}
		
		# Try crypto
		crypto_data = await market_data_service.get_crypto_quote(symbol)
		if crypto_data:
			return {"type": "crypto", "data": crypto_data}
		
		raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/market/overview")
async def get_market_overview():
	"""Get comprehensive market overview"""
	try:
		overview = await market_data_service.get_market_overview()
		return overview
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/market/trending/stocks")
async def get_trending_stocks():
	"""Get trending stocks"""
	try:
		trending = await market_data_service.get_trending_stocks()
		return {"trending_stocks": trending}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/market/trending/crypto")
async def get_trending_crypto():
	"""Get trending cryptocurrencies"""
	try:
		trending = await market_data_service.get_trending_crypto()
		return {"trending_crypto": trending}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/market/profile/{symbol}")
async def get_company_profile(symbol: str):
	"""Get company profile information"""
	try:
		profile = await market_data_service.get_company_profile(symbol)
		if profile:
			return profile
		raise HTTPException(status_code=404, detail=f"Profile for {symbol} not found")
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


# Authentication Endpoints
class SendOtpRequest(BaseModel):
	email: EmailStr
	name: Optional[str] = "User"


@api_router.post("/auth/send-otp")
async def send_otp(payload: SendOtpRequest):
	"""Send OTP verification email"""
	try:
		otp = email_service.generate_otp()
		otp_store.set_code(payload.email, otp)
		success = email_service.send_otp_email(payload.email, otp, payload.name or "User")
		
		if success:
			return {"message": "OTP sent successfully", "email": payload.email}
		else:
			raise HTTPException(status_code=500, detail="Failed to send OTP email")
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


class VerifyOtpRequest(BaseModel):
	email: EmailStr
	code: str


@api_router.post("/auth/verify-otp")
async def verify_otp(payload: VerifyOtpRequest):
	"""Verify OTP code"""
	try:
		ok = otp_store.verify_code(payload.email, payload.code)
		if not ok:
			raise HTTPException(status_code=400, detail="Invalid or expired code")
		return {"message": "Email verified"}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


class SendPasswordResetRequest(BaseModel):
	email: EmailStr
	name: Optional[str] = "User"


@api_router.post("/auth/send-password-reset")
async def send_password_reset(payload: SendPasswordResetRequest):
	"""Send password reset email"""
	try:
		# In a real app, you'd generate a secure reset token
		reset_link = f"https://oryntal-ai.com/reset-password?token=secure_token_here"
		success = email_service.send_password_reset_email(payload.email, reset_link, payload.name or "User")
		
		if success:
			return {"message": "Password reset email sent successfully", "email": payload.email}
		else:
			raise HTTPException(status_code=500, detail="Failed to send password reset email")
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


# Twitter search endpoint (basic)
@api_router.get("/social/twitter/search")
async def twitter_search(query: str, max_results: int = 10):
	try:
		result = await twitter_service.search_recent(query=query, max_results=max_results)
		return result
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))


# Placeholder endpoints for future implementation
@api_router.get("/scrapers/reddit")
async def scrape_reddit():
	return {"message": "Reddit scraper not implemented yet"}


@api_router.get("/scrapers/twitter")
async def scrape_twitter():
	return {"message": "Twitter scraper not implemented yet"}


@api_router.post("/analyzer/sentiment")
async def analyze_sentiment(payload: dict):
	return {"message": "Sentiment analysis not implemented yet", "input": payload}


@api_router.get("/recommendations")
async def recommendations(symbol: Optional[str] = None, q: Optional[str] = None):
	if not symbol:
		raise HTTPException(status_code=400, detail="symbol is required")
	texts = []
	# Optionally seed with twitter recent posts about the symbol
	try:
		query = q or f"${symbol} lang:en -is:retweet"
		tweets = await twitter_service.search_recent(query=query, max_results=10)
		for t in tweets.get("data", [])[:5]:
			text = t.get("text")
			if text:
				texts.append(text)
	except Exception:
		pass
	result = await recommendation_service.recommend(symbol, texts)
	return result


