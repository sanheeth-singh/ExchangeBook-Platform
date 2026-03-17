from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from jose import jwt, JWTError
from app.core.config import settings

from app.db.session import AsyncSessionLocal, get_async_session
from app.enums import ExchangeStatusEnum
from app.models.exchange import Exchange
from app.models.chat import ChatMessage
from app.models.user import User
from app.websocket.manager import manager
from app.core.security import get_current_user_ws, get_current_user

router = APIRouter(tags=["Chat"])


@router.websocket("/ws/chat/{exchange_id}")
async def chat_websocket(websocket: WebSocket, exchange_id: UUID):
    

    async with AsyncSessionLocal() as session:

        user = await get_current_user_ws(websocket, session)
        if not user:
            # print("Auth failed but allowing for test")
            await websocket.close(code=1008)
            return
        

        result = await session.execute(
            select(Exchange).where(Exchange.id == exchange_id)
        )
        exchange = result.scalar_one_or_none()

        if not exchange:
            await websocket.close(code=1008)
            return

        if user.id not in [exchange.requester_id, exchange.owner_id]:
            await websocket.close(code=1008)
            return
        if exchange.status != ExchangeStatusEnum.ACCEPTED:
            await websocket.close(code=1008)
            return


    await manager.connect(exchange_id, websocket)

    try:
        while True:
            data = await websocket.receive_text()

            async with AsyncSessionLocal() as session:
                message = ChatMessage(
                    exchange_id=exchange_id,
                    sender_id=user.id,
                    message=data,
                )
                try:
                    session.add(message)
                    await session.commit()
                    await session.refresh(message)

                except Exception as e:
                    await session.rollback()
                    print("DB erroe", e)
                    continue


            await manager.broadcast(
                exchange_id,
                {
                    "sender_id": str(user.id),
                    "message": data,
                    "created_at":message.created_at.isoformat(),
                },
            )

    except WebSocketDisconnect:
        manager.disconnect(exchange_id, websocket)

    except Exception as e:
        print("WebSocket error:", e)
        manager.disconnect(exchange_id, websocket)



#get chat history
@router.get("/chat/{exchange_id}")
async def get_chat_history(
    exchange_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),  # your normal auth
):
    result = await session.execute(
        select(ChatMessage)
        .where(ChatMessage.exchange_id == exchange_id)
        .order_by(ChatMessage.created_at)
    )

    return result.scalars().all()
