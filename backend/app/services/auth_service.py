from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
	return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
	return pwd_context.verify(password, password_hash)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
	to_encode = data.copy()
	expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
	to_encode.update({"exp": expire})
	encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
	return encoded_jwt


def get_user_by_email(db: Session, email: str) -> Optional[User]:
	return db.query(User).filter(User.email == email.lower()).first()


def create_user(db: Session, *, email: str, password: str, first_name: str = "", last_name: str = "") -> User:
	user = User(
		email=email.lower(),
		first_name=first_name,
		last_name=last_name,
		password_hash=hash_password(password),
	)
	db.add(user)
	db.commit()
	db.refresh(user)
	return user


