from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Memo
from .schemas import MemoCreate, MemoUpdate


def list_memos(db: Session, q: str | None = None) -> list[Memo]:
    statement = select(Memo).order_by(Memo.updated_at.desc(), Memo.id.asc())
    if q:
        statement = statement.where(Memo.content.contains(q.strip()))
    return list(db.scalars(statement).all())


def get_memo(db: Session, memo_id: int) -> Memo | None:
    return db.get(Memo, memo_id)


def create_memo(db: Session, payload: MemoCreate) -> Memo:
    memo = Memo(content=payload.content)
    db.add(memo)
    db.commit()
    db.refresh(memo)
    return memo


def update_memo(db: Session, memo: Memo, payload: MemoUpdate) -> Memo:
    memo.content = payload.content
    db.add(memo)
    db.commit()
    db.refresh(memo)
    return memo


def delete_memo(db: Session, memo: Memo) -> None:
    db.delete(memo)
    db.commit()
