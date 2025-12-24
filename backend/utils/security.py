from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from passlib.context import CryptContext

from .settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes or settings.JWT_EXPIRE_MINUTES)
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
