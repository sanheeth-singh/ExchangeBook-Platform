from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")  # 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

#refresh token implementaion pending 


pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")



def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



#creating auth dependencies

from fastapi import Depends, HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_async_session
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_async_session),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


#admin

async def get_current_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user



#chat function
from fastapi import WebSocket
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.models.user import User
from app.core.config import settings


async def get_current_user_ws(websocket: WebSocket, session):

    # 1️⃣ Get token from query params
    token = websocket.query_params.get("token")

    if not token:
        print("WebSocket auth failed: No token provided")
        return None

    try:
        # 2️⃣ Decode JWT
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id: str | None = payload.get("sub")

        if user_id is None:
            print("WebSocket auth failed: No user id in token")
            return None

    except JWTError as e:
        print("WebSocket JWT decode error:", e)
        return None

    # 3️⃣ Fetch user from DB
    result = await session.execute(
        select(User).where(User.id == UUID(user_id))
    )

    user = result.scalar_one_or_none()

    if not user:
        print("WebSocket auth failed: user not found")



        print("WS QUERY PARAMS:", websocket.query_params)
        print("TOKEN:", token)

    return user