import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.db.session import get_async_session
from app.models.exchange_book import ExchangeBook
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserWithBooks

from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from app.core.security import hash_password, get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_async_session),
):
    new_user = User(
        id=uuid.uuid4(),
        email=user_data.email,
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
    )

    session.add(new_user)

    try:
        await session.commit()
        await session.refresh(new_user)
        return new_user

    except IntegrityError as e:
        await session.rollback()

        error_message = str(e.orig)

        if "email" in error_message and "username" in error_message:
            raise HTTPException(
                status_code=400,
                detail="Email and Username already exist"
            )

        elif "email" in error_message:
            raise HTTPException(
                status_code=400,
                detail="User already exists with this email"
            )

        elif "username" in error_message:
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )
        elif len("username")<4:
            raise HTTPException(
                status_code=400,
                detail="not Allowed")

        # ⚠️ fallback
        raise HTTPException(
            status_code=400,
            detail="User already exists or invalid entry"
        )


@router.get("/me", response_model=UserWithBooks)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):

    result = await session.execute(
        select(User)
        .options(
            selectinload(User.books))
        .where(User.id == current_user.id)
    )

    user = result.scalar_one_or_none()

    return user


@router.get("/{user_id}", response_model=UserWithBooks)
async def get_user(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await session.execute(
        select(User)
        .options(selectinload(User.books))
        .where(User.id == user_id)
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user



