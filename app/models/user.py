import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin

from sqlalchemy import Enum, Boolean
from app.enums import UserRole



class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(
        Enum(UserRole),
        default=UserRole.USER,
        nullable=False
        )
    
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    books = relationship("ExchangeBook", back_populates="owner", cascade="all, delete")
    sent_exchanges = relationship(
        "Exchange",
        foreign_keys="Exchange.requester_id",
        back_populates="requester",
    )
    received_exchanges = relationship(
        "Exchange",
        foreign_keys="Exchange.owner_id",
        back_populates="owner",
    )
    reviews_given = relationship(
        "Review",
        foreign_keys="Review.reviewer_id",
        back_populates="reviewer",
    )
    reviews_received = relationship(
        "Review",
        foreign_keys="Review.reviewed_user_id",
        back_populates="reviewed_user",
    )
    reports_made = relationship(
        "Report",
        foreign_keys="Report.reporter_id",
        back_populates="reporter",
    )

    
