from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_async_session
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.core.security import verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(prefix="/auth", tags=["Auth"])


# @router.post("/login", response_model=TokenResponse)
# async def login(
#     credentials: LoginRequest,
#     form_data: OAuth2PasswordRequestForm = Depends(),
#     session: AsyncSession = Depends(get_async_session),
# ):
#     result = await session.execute(
#         select(User).where(User.email == credentials.email)
#     )
#     user = result.scalar_one_or_none()

#     if not user:
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     if not verify_password(credentials.password, user.hashed_password):
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     access_token = create_access_token({"sub": str(user.id)})

#     return {"access_token": access_token}


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_async_session),
):
    result = await session.execute(
        select(User).where(User.email == form_data.username)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


