import uuid
from sqlalchemy import Column, String, ForeignKey, Enum,Boolean, DateTime,func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin
from app.enums import BookConditionEnum


class ExchangeBook(Base, TimestampMixin):
    __tablename__ = "exchange_books"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    description = Column(String)

    condition = Column(
        Enum(BookConditionEnum, name="book_condition_enum", create_type=False),
        nullable=False,
    )

    owner = relationship("User", back_populates="books")

    requested_exchanges = relationship(
        "Exchange",
        foreign_keys="Exchange.requested_book_id",
        back_populates="requested_book",
    )
    
    is_available = Column(Boolean, default=True, nullable=False)


