import uuid
from sqlalchemy import Column, ForeignKey, String, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.db.mixins import TimestampMixin
from app.enums import ReportStatusEnum


class Report(Base, TimestampMixin):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reported_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    reason = Column(String, nullable=False)

    status = Column(
        Enum(ReportStatusEnum, name="report_status_enum", create_type=False),
        default=ReportStatusEnum.OPEN,
        nullable=False,
    )

    reporter = relationship("User", foreign_keys=[reporter_id], back_populates="reports_made")
