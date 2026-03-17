import uuid
from sqlalchemy import Column, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin
from app.enums import ExchangeStatusEnum


class Exchange(Base, TimestampMixin):
    __tablename__ = "exchanges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    requester_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    requested_book_id = Column(UUID(as_uuid=True), ForeignKey("exchange_books.id", ondelete="CASCADE"), nullable=False)

    status = Column(
        Enum(ExchangeStatusEnum, name="exchange_status_enum", create_type=False),
        default=ExchangeStatusEnum.PENDING,
        nullable=False,
    )

    requester = relationship("User", foreign_keys=[requester_id], back_populates="sent_exchanges")
    owner = relationship("User", foreign_keys=[owner_id], back_populates="received_exchanges")

    requested_book = relationship("ExchangeBook", back_populates="requested_exchanges")

    review = relationship("Review", back_populates="exchange", uselist=False)
