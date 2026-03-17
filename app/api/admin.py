from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.db.session import get_async_session
from app.models.review import Review
from app.models.user import User
from app.models.exchange_book import ExchangeBook
from app.core.security import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.delete("/reviews/{review_id}")
async def delete_review_admin(
    review_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    admin: User = Depends(get_current_admin),
):
    result = await session.execute(
        select(Review).where(Review.id == review_id)
    )
    review = result.scalar_one_or_none()

    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    await session.delete(review)
    await session.commit()

    return {"detail": "Review deleted successfully"}


#ban users
@router.patch("/users/{user_id}/ban")
async def ban_user(
    user_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    admin: User = Depends(get_current_admin),
):
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    await session.commit()

    return {"detail": "User banned successfully"}


#unban users
@router.patch("/users/{user_id}/unban")
async def unban_user(
    user_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    admin: User = Depends(get_current_admin),
):
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = True
    await session.commit()

    return {"detail": "User unbanned successfully"}


#delete book
@router.delete("/books/{book_id}")
async def delete_book_admin(
    book_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    admin: User = Depends(get_current_admin),
):
    result = await session.execute(
        select(ExchangeBook).where(ExchangeBook.id == book_id)
    )
    book = result.scalar_one_or_none()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    await session.delete(book)
    await session.commit()

    return {"detail": "Book deleted by admin"}
