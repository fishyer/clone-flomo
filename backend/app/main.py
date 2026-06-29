import os
from collections.abc import Callable, Iterator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, sessionmaker

from . import crud, models
from .database import SessionLocal, init_db
from .schemas import MemoCreate, MemoRead, MemoStatsRead, MemoUpdate


def get_cors_origins() -> list[str]:
    raw_origins = os.getenv(
        "CLONE_FLOMO_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


def create_app(
    session_factory: sessionmaker[Session] = SessionLocal,
    init_db_func: Callable[[], None] = init_db,
) -> FastAPI:
    @asynccontextmanager
    async def lifespan(_: FastAPI):
        init_db_func()
        yield

    app = FastAPI(title="clone-flomo API", version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_cors_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    def get_db() -> Iterator[Session]:
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/api/memos", response_model=list[MemoRead])
    def list_memos(q: str | None = None, db: Session = Depends(get_db)) -> list[models.Memo]:
        return crud.list_memos(db, q)

    @app.get("/api/stats", response_model=MemoStatsRead)
    def get_stats(db: Session = Depends(get_db)) -> dict[str, int]:
        return crud.get_memo_stats(db)

    @app.post("/api/memos", response_model=MemoRead, status_code=status.HTTP_201_CREATED)
    def create_memo(payload: MemoCreate, db: Session = Depends(get_db)) -> models.Memo:
        return crud.create_memo(db, payload)

    @app.get("/api/memos/{memo_id}", response_model=MemoRead)
    def get_memo(memo_id: int, db: Session = Depends(get_db)) -> models.Memo:
        memo = crud.get_memo(db, memo_id)
        if memo is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="memo not found")
        return memo

    def update_existing_memo(memo_id: int, payload: MemoUpdate, db: Session) -> models.Memo:
        memo = crud.get_memo(db, memo_id)
        if memo is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="memo not found")
        return crud.update_memo(db, memo, payload)

    @app.put("/api/memos/{memo_id}", response_model=MemoRead)
    def replace_memo(memo_id: int, payload: MemoUpdate, db: Session = Depends(get_db)) -> models.Memo:
        return update_existing_memo(memo_id, payload, db)

    @app.patch("/api/memos/{memo_id}", response_model=MemoRead)
    def update_memo(memo_id: int, payload: MemoUpdate, db: Session = Depends(get_db)) -> models.Memo:
        return update_existing_memo(memo_id, payload, db)

    @app.delete("/api/memos/{memo_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_memo(memo_id: int, db: Session = Depends(get_db)) -> Response:
        memo = crud.get_memo(db, memo_id)
        if memo is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="memo not found")
        crud.delete_memo(db, memo)
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    return app


app = create_app()
