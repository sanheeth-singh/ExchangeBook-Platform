from fastapi import FastAPI
from sqlalchemy import text

from app.db.session import engine


from app.api.user import router as user_router
from app.api.book import router as book_router
from app.api.auth import router as auth_router
from app.api.exchange import router as exchange_router
from app.api.reviews import router as review_router
from app.api.admin import router as admin_router
from app.api.chat import router as chat_router

app = FastAPI(title="ExchangeBook API")

#routers
app.include_router(user_router)

app.include_router(book_router)

app.include_router(auth_router)

app.include_router(exchange_router)

app.include_router(review_router)

app.include_router(admin_router)

app.include_router(chat_router)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))
    print("Database connected successfully")


@app.get("/")
async def root():
    return {"message": "ExchangeBook API is running"}


from fastapi.middleware.cors import CORSMiddleware

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


