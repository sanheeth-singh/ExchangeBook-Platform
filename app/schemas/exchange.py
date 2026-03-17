from pydantic import BaseModel
from uuid import UUID
from app.enums import ExchangeStatusEnum
from datetime import datetime
class ExchangeCreate(BaseModel):
    requested_book_id: UUID


class ExchangeResponse(BaseModel):
    id: UUID
    requester_id: UUID
    owner_id: UUID
    requester_name: str
    owner_name: str

    requested_book_id: UUID
    status: ExchangeStatusEnum

    created_at: datetime
    updated_at: datetime


    class Config:
        from_attributes = True
