from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from typing import List
from app.schemas.book import BookResponse
from app.enums import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=4)
    password: str = Field(min_length=4)


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    username: str
    role : UserRole
    

    class Config:
        from_attributes = True


class UserWithBooks(UserResponse):
    books: List[BookResponse] = []
