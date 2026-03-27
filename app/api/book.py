import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID

from app.db.session import get_async_session
from app.models.exchange_book import ExchangeBook
from app.models.user import User
from app.schemas.book import BookCreate, BookResponse

from app.core.security import get_current_user
from app.models.user import User

from app.enums import BookConditionEnum


router = APIRouter(prefix="/books", tags=["Books"])

#post new book
@router.post("/", response_model=BookResponse)
async def create_book(
    book_data: BookCreate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    new_book = ExchangeBook(
        id=uuid.uuid4(),
        title=book_data.title,
        author=book_data.author,
        condition=book_data.condition,
        # description=book_data.description,
        owner_id=current_user.id,
        
    )

    session.add(new_book)
    await session.commit()
    await session.refresh(new_book)

    return new_book


#get all books
@router.get("/", response_model=list[BookResponse])
async def get_books(
    skip: int = 0,
    limit: int = 10,
    search: str | None = None,
    available: bool | None = None,
    owner_id: UUID | None = None,
    session: AsyncSession = Depends(get_async_session),
):
    # result = await session.execute(
    #     select(ExchangeBook)
    #     .offset(skip)
    #     .limit(limit)
    # )
    # books = result.scalars().all()


    query = select(ExchangeBook).options(selectinload(ExchangeBook.owner)).order_by(ExchangeBook.created_at.desc())

    # Search (title or author)
    if search:
        query = query.where(
            (ExchangeBook.title.ilike(f"%{search}%")) |
            (ExchangeBook.author.ilike(f"%{search}%"))
        )

    # Filter by availability
    if available is not None:
        query = query.where(ExchangeBook.is_available == available)

    # Filter by owner
    if owner_id:
        query = query.where(ExchangeBook.owner_id == owner_id)

    # Apply pagination
    query = query.offset(skip).limit(limit)

    result = await session.execute(query)
    books = result.scalars().all()

    return books



#delete book
from sqlalchemy import select, delete
from app.models.exchange import Exchange
from app.enums import ExchangeStatusEnum

@router.delete("/{book_id}")
async def delete_book(
    book_id: uuid.UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(ExchangeBook).where(ExchangeBook.id == book_id)
    )
    book = result.scalar_one_or_none()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # ❌ block if accepted exchange exists
    accepted_exchange = await session.execute(
        select(Exchange).where(
            Exchange.requested_book_id == book_id,
            Exchange.status == ExchangeStatusEnum.ACCEPTED
        )
    )

    if accepted_exchange.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="Cannot delete this book. Complete the exchange first."
        )

    # 🧹 delete all other exchanges
    await session.execute(
        delete(Exchange).where(Exchange.requested_book_id == book_id)
    )

    #  delete book
    await session.delete(book)

    await session.commit()

    return {"message": "Book deleted successfully"}



#update or edit books
@router.put("/{book_id}", response_model=BookResponse)
async def update_book(
    book_id: uuid.UUID,
    book_data: BookCreate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(ExchangeBook).where(ExchangeBook.id == book_id)
    )
    book = result.scalar_one_or_none()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    book.title = book_data.title
    book.author = book_data.author
    book.condition = book_data.condition
    # book.description = book_data.description

    await session.commit()
    await session.refresh(book)

    return book


#get books by request id
@router.get("/{book_id}", response_model=BookResponse)
async def get_book(
    book_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
    
):
    result = await session.execute(
    select(ExchangeBook)
    .options(selectinload(ExchangeBook.owner))
    .where(ExchangeBook.id == book_id)
    )

    book = result.scalar_one_or_none()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    return book
