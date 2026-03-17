import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_async_session
from app.models.exchange import Exchange
from app.models.exchange_book import ExchangeBook
from app.models.user import User
from app.schemas.exchange import ExchangeCreate, ExchangeResponse
from app.enums import ExchangeStatusEnum
from app.core.security import get_current_user

router = APIRouter(prefix="/exchanges", tags=["Exchanges"])
@router.post("/", response_model=ExchangeResponse)
async def create_exchange(
    exchange_data: ExchangeCreate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):

    result = await session.execute(
        select(ExchangeBook).where(
            ExchangeBook.id == exchange_data.requested_book_id
        )
    )
    requested_book = result.scalar_one_or_none()

    if not requested_book:
        raise HTTPException(status_code=404, detail="Requested book not found")

    if not requested_book.is_available:
        raise HTTPException(status_code=400, detail="Book not available")

    if requested_book.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot request your own book")

    result = await session.execute(
        select(Exchange).where(
            Exchange.requester_id == current_user.id,
            Exchange.requested_book_id == exchange_data.requested_book_id,
            Exchange.status == ExchangeStatusEnum.PENDING,
        )
    )

    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Exchange already pending")

    new_exchange = Exchange(
        requester_id=current_user.id,
        owner_id=requested_book.owner_id,
        requested_book_id=requested_book.id,
        status=ExchangeStatusEnum.PENDING,
    )

    session.add(new_exchange)
    await session.commit()
    await session.refresh(new_exchange)

    # 🔹 Fetch owner user
    owner_result = await session.execute(
        select(User).where(User.id == requested_book.owner_id)
    )
    owner = owner_result.scalar_one()

    return ExchangeResponse(
        id=new_exchange.id,
        requester_id=new_exchange.requester_id,
        owner_id=new_exchange.owner_id,
        requester_name=current_user.username,
        owner_name=owner.username,
        requested_book_id=new_exchange.requested_book_id,
        status=new_exchange.status,
        created_at=new_exchange.created_at,
        updated_at=new_exchange.updated_at,
    )



#Accept exchange only owner 
@router.patch("/{exchange_id}/accept", response_model=ExchangeResponse)
async def accept_exchange(
    exchange_id: uuid.UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):

    result = await session.execute(
        select(Exchange)
        .options(selectinload(Exchange.requested_book), selectinload(Exchange.requester),selectinload(Exchange.owner))
        .where(Exchange.id == exchange_id)
    )

    exchange = result.scalar_one_or_none()

    if not exchange:
        raise HTTPException(status_code=404, detail="Exchange not found")

    if exchange.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can accept")

    if exchange.status != ExchangeStatusEnum.PENDING:
        raise HTTPException(status_code=400, detail="Exchange already finalized")

    exchange.status = ExchangeStatusEnum.ACCEPTED

    # Mark book unavailable
    exchange.requested_book.is_available = False

    # Reject all other pending exchanges for same book
    result = await session.execute(
        select(Exchange).where(
            Exchange.requested_book_id == exchange.requested_book_id,
            Exchange.status == ExchangeStatusEnum.PENDING,
            Exchange.id != exchange.id,
        )
    )

    other_pending = result.scalars().all()

    for other in other_pending:
        other.status = ExchangeStatusEnum.REJECTED

    
    await session.commit()
    await session.refresh(exchange)

     # fetch owner
    owner_result = await session.execute(
        select(User).where(User.id == exchange.owner_id)
    )
    owner = owner_result.scalar_one()

    return ExchangeResponse(
        id=exchange.id,
        requester_id=exchange.requester_id,
        owner_id=exchange.owner_id,
        requester_name=current_user.username,
        owner_name=owner.username,
        requested_book_id=exchange.requested_book_id,
        status=exchange.status,
        created_at=exchange.created_at,
        updated_at=exchange.updated_at,
    )


#reject exchange only owner 
@router.patch("/{exchange_id}/reject", response_model=ExchangeResponse)
async def reject_exchange(
    exchange_id: uuid.UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(Exchange).where(Exchange.id == exchange_id)
    )
    exchange = result.scalar_one_or_none()

    if not exchange:
        raise HTTPException(status_code=404, detail="Exchange not found")

    if exchange.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can reject")

    if exchange.status != ExchangeStatusEnum.PENDING:
        raise HTTPException(status_code=400, detail="Exchange already finalized")

    exchange.status = ExchangeStatusEnum.REJECTED

    # Mark book available
    exchange.requested_book.is_available = True

    await session.commit()
    await session.refresh(exchange)

     # fetch owner
    owner_result = await session.execute(
        select(User).where(User.id == exchange.owner_id)
    )
    owner = owner_result.scalar_one()

    return ExchangeResponse(
        id=exchange.id,
        requester_id=exchange.requester_id,
        owner_id=exchange.owner_id,
        requester_name=current_user.username,
        owner_name=owner.username,
        requested_book_id=exchange.requested_book_id,
        status=exchange.status,
        created_at=exchange.created_at,
        updated_at=exchange.updated_at,
    )


#cancel exchange only requester 
@router.patch("/{exchange_id}/cancel", response_model=ExchangeResponse)
async def cancel_exchange(
    exchange_id: uuid.UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(Exchange).where(Exchange.id == exchange_id)
    )
    exchange = result.scalar_one_or_none()

    if not exchange:
        raise HTTPException(status_code=404, detail="Exchange not found")

    if exchange.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only requester can cancel")

    if exchange.status != ExchangeStatusEnum.PENDING:
        raise HTTPException(status_code=400, detail="Exchange already finalized")

    exchange.status = ExchangeStatusEnum.CANCELLED

    await session.commit()
    await session.refresh(exchange)

     # fetch owner
    owner_result = await session.execute(
        select(User).where(User.id == exchange.owner_id)
    )
    owner = owner_result.scalar_one()

    return ExchangeResponse(
        id=exchange.id,
        requester_id=exchange.requester_id,
        owner_id=exchange.owner_id,
        requester_name=current_user.username,
        owner_name=owner.username,
        requested_book_id=exchange.requested_book_id,
        status=exchange.status,
        created_at=exchange.created_at,
        updated_at=exchange.updated_at,
    ) 



#get sent exchanges
@router.get("/sent", response_model=list[ExchangeResponse])
async def get_sent_exchanges(
    status: ExchangeStatusEnum | None = None,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,

):
    query = select(Exchange).where(
        Exchange.requester_id == current_user.id
    ).order_by(Exchange.created_at.desc())

    if status:
        query = query.where(Exchange.status == status)

    result = await session.execute(
        query.options(selectinload(Exchange.requested_book), selectinload(Exchange.requester),selectinload(Exchange.owner) ).offset(skip).limit(limit)
    )

    exchanges = result.scalars().all()
    return [
    ExchangeResponse(
        id=e.id,
        requester_id=e.requester_id,
        owner_id=e.owner_id,
        requester_name=e.requester.username,
        owner_name=e.owner.username,
        requested_book_id=e.requested_book_id,
        status=e.status,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )
    for e in exchanges
]



#get received exchanges
@router.get("/received", response_model=list[ExchangeResponse])
async def get_received_exchanges(
    status: ExchangeStatusEnum | None = None,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    query = select(Exchange).where(
        Exchange.owner_id == current_user.id
    ).order_by(Exchange.created_at.desc())

    if status:
        query = query.where(Exchange.status == status)

    result = await session.execute(
        query.options(selectinload(Exchange.requested_book),selectinload(Exchange.requester),selectinload(Exchange.owner)).offset(skip).limit(limit)
    )

    exchanges = result.scalars().all()
    return [
    ExchangeResponse(
        id=e.id,
        requester_id=e.requester_id,
        owner_id=e.owner_id,
        requester_name=e.requester.username,
        owner_name=e.owner.username,
        requested_book_id=e.requested_book_id,
        status=e.status,
        created_at=e.created_at,
        updated_at=e.updated_at,
    )
    for e in exchanges
]
