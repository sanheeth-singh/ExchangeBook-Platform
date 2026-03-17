from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import List

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: UUID
    exchange_id: UUID
    reviewer_id: UUID
    reviewed_user_id: UUID
    rating: int
    comment: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class UserReviewItem(BaseModel):
    id: UUID
    exchange_id: UUID
    reviewer_id: UUID
    rating: int
    comment: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class UserReviewsResponse(BaseModel):
    user_id: UUID
    average_rating: float
    total_reviews: int
    reviews: List[UserReviewItem]
