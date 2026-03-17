from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from uuid import UUID

from app.db.session import get_async_session
from app.models.exchange import Exchange
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewResponse,UserReviewsResponse
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/{exchange_id}", response_model=ReviewResponse)
async def create_review(
    exchange_id: UUID,
    review_data: ReviewCreate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    # Get exchange
    result = await session.execute(
        select(Exchange).where(Exchange.id == exchange_id)
    )
    exchange = result.scalar_one_or_none()

    if not exchange:
        raise HTTPException(status_code=404, detail="Exchange not found")

    # Must be accepted
    if exchange.status != "ACCEPTED":
        raise HTTPException(status_code=400, detail="Exchange not completed")

    # Must be part of exchange
    if current_user.id not in [exchange.requester_id, exchange.owner_id]:
        raise HTTPException(status_code=403, detail="Not allowed")

    # Check if review already exists
    
    existing = await session.execute(
    select(Review).where(
        Review.exchange_id == exchange_id,
        Review.reviewer_id == current_user.id
        )
    )

    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You already reviewed this exchange")


    # Determine who is being reviewed
    reviewed_user_id = (
        exchange.owner_id
        if current_user.id == exchange.requester_id
        else exchange.requester_id
    )

    review = Review(
        exchange_id=exchange_id,
        reviewer_id=current_user.id,
        reviewed_user_id=reviewed_user_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )

    session.add(review)
    await session.commit()
    await session.refresh(review)

    return review


@router.get("/user/{user_id}", response_model=UserReviewsResponse)
async def get_user_reviews(
    user_id: UUID,
    skip: int = 0,
    limit: int = 10,
    session: AsyncSession = Depends(get_async_session),
):
    # Check user exists
    user_result = await session.execute(
        select(User).where(User.id == user_id)
    )
    user = user_result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get reviews
    result = await session.execute(
    select(Review).where(Review.reviewed_user_id == user_id)
    .offset(skip)
    .limit(limit)
)
    reviews = result.scalars().all()

    count_result = await session.execute(
        select(func.count(Review.id))
        .where(Review.reviewed_user_id == user_id)
)
    
    # Calculate average
    avg_result = await session.execute(
        select(func.avg(Review.rating)).where(Review.reviewed_user_id == user_id)
    )
    average_rating = avg_result.scalar()



    return {
        "user_id": user_id,
        "average_rating": round(float(average_rating), 2) if average_rating else 0.0,
        "total_reviews": count_result.scalar(),
        "reviews": reviews,
    }


#leaderbord top rated users
@router.get("/leaderboard")
async def get_leaderboard(
    limit: int = 10,
    session: AsyncSession = Depends(get_async_session),
):
    result = await session.execute(
        select(
            Review.reviewed_user_id,
            func.avg(Review.rating).label("average_rating"),
            func.count(Review.id).label("total_reviews")
        )
        .group_by(Review.reviewed_user_id)
        .order_by(desc("average_rating"), desc("total_reviews"))
        .limit(limit)
    )

    rows = result.all()

    leaderboard = [
        {
            "user_id": row.reviewed_user_id,
            "average_rating": round(float(row.average_rating), 2),
            "total_reviews": row.total_reviews,
        }
        for row in rows
    ]

    return leaderboard

from app.core.security import get_current_admin


#admin

