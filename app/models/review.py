import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin


class Review(Base, TimestampMixin):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    exchange_id = Column(UUID(as_uuid=True), ForeignKey("exchanges.id", ondelete="CASCADE"), nullable=False)

    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reviewed_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    rating = Column(Integer, nullable=False)
    comment = Column(String)

    exchange = relationship("Exchange", back_populates="review")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewed_user = relationship("User", foreign_keys=[reviewed_user_id], back_populates="reviews_received")

# this is added after migrations make it work in next upgrade
    __table_args__ = (
        UniqueConstraint("exchange_id", "reviewer_id", name="unique_review_per_user"),
    )
