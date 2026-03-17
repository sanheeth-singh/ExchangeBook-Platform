from pydantic import BaseModel
from uuid import UUID
from app.enums import BookConditionEnum
from datetime import datetime

class BookCreate(BaseModel):
    title: str
    author: str
    condition: BookConditionEnum
    # description: str
    

class UserBasic(BaseModel):
    id:UUID
    username:str

    class Config:
        from_attributes = True


class BookResponse(BaseModel):
    id: UUID
    title: str
    author: str
    condition: BookConditionEnum
    # description:str
    owner_id: UUID
    owner:UserBasic
    is_available: bool
    created_at: datetime
    updated_at: datetime
     

    class Config:
        from_attributes = True
