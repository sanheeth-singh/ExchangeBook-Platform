import enum


class ExchangeStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"


class ReportStatusEnum(str, enum.Enum):
    OPEN = "OPEN"
    UNDER_REVIEW = "UNDER_REVIEW"
    RESOLVED = "RESOLVED"
    REJECTED = "REJECTED"


class BookConditionEnum(str, enum.Enum):
    NEW = "NEW"
    LIKE_NEW = "LIKE_NEW"
    GOOD = "GOOD"
    FAIR = "FAIR"
    POOR = "POOR"

class UserRole(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"
