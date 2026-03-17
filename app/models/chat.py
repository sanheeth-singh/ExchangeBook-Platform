import uuid
from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin


class ChatMessage(Base, TimestampMixin):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    exchange_id = Column(
        UUID(as_uuid=True),
        ForeignKey("exchanges.id", ondelete="CASCADE"),
        nullable=False
    )

    sender_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    message = Column(String, nullable=False)

    exchange = relationship("Exchange")
    sender = relationship("User")
