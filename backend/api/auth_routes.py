from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi import status
from pydantic import EmailStr
from datetime import datetime
from bson import ObjectId
from pymongo.errors import DuplicateKeyError, PyMongoError

from backend.utils.db import get_db
from backend.utils.security import hash_password, verify_password, create_access_token, decode_token
from backend.models.auth import UserCreate, UserLogin, TokenResponse, UserPublic

router = APIRouter(prefix="/auth", tags=["auth"])


def _users_col():
    try:
        db = get_db()
        col = db["users"]
        # ensure unique index on email
        col.create_index("email", unique=True)
        return col
    except PyMongoError as e:
        # Surface DB issues clearly
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Database error: {str(e)}")


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = _users_col().find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/signup", response_model=TokenResponse)
def signup(payload: UserCreate):
    try:
        col = _users_col()
        if col.find_one({"email": payload.email.lower()}):
            raise HTTPException(status_code=400, detail="Email already registered")
        doc = {
            "name": payload.name.strip(),
            "email": payload.email.lower(),
            "password_hash": hash_password(payload.password),
            "created_at": datetime.utcnow(),
        }
        res = col.insert_one(doc)
        user_id = str(res.inserted_id)
        token = create_access_token(user_id)
        user_public = UserPublic(id=user_id, name=doc["name"], email=doc["email"]) 
        return TokenResponse(access_token=token, user=user_public)
    except DuplicateKeyError:
        # Race condition on unique index
        raise HTTPException(status_code=400, detail="Email already registered")
    except PyMongoError as e:
        # Database unavailable or other Mongo error
        raise HTTPException(status_code=503, detail=f"Database error: {str(e)}")


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    try:
        col = _users_col()
        user = col.find_one({"email": payload.email.lower()})
        if not user or not verify_password(payload.password, user.get("password_hash", "")):
            raise HTTPException(status_code=400, detail="Invalid email or password")
        token = create_access_token(str(user["_id"]))
        user_public = UserPublic(id=str(user["_id"]), name=user.get("name", "User"), email=user["email"]) 
        return TokenResponse(access_token=token, user=user_public)
    except HTTPException:
        raise
    except PyMongoError as e:
        raise HTTPException(status_code=503, detail=f"Database error: {str(e)}")


@router.get("/me", response_model=UserPublic)
def me(current_user=Depends(get_current_user)):
    return UserPublic(id=str(current_user["_id"]), name=current_user.get("name", "User"), email=current_user["email"]) 
