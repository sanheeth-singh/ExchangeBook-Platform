import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column


class UUIDMixin:
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False
    )


from sqlalchemy import DateTime, func


class TimestampMixin:
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )


from sqlalchemy import Boolean


class SoftDeleteMixin:
    is_deleted = Column(
        Boolean,
        default=False,
        nullable=False
    )
