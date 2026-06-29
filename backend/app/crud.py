from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .database import export_stats_cache, load_export_stats
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
    memo.tags = payload.tags
    db.add(memo)
    db.commit()
    db.refresh(memo)
    return memo


def update_memo(db: Session, memo: Memo, payload: MemoUpdate) -> Memo:
    memo.content = payload.content
    memo.tags = payload.tags
    db.add(memo)
    db.commit()
    db.refresh(memo)
    return memo


def delete_memo(db: Session, memo: Memo) -> None:
    db.delete(memo)
    db.commit()


def get_memo_stats(db: Session) -> dict[str, int]:
    memos = list(db.scalars(select(Memo)).all())
    tags = {tag for memo in memos for tag in memo.tags}
    used_days = {memo.created_at.date().isoformat() for memo in memos}
    exported_count = db.scalar(select(func.count()).select_from(Memo).where(Memo.slug.is_not(None))) or 0
    export_stats = export_stats_cache or (load_export_stats() if exported_count > 0 else {})

    return {
        "memo_count": len(memos),
        "tag_count": max(len(tags), export_stats.get("tag_count", 0)),
        "used_day_count": max(len(used_days), export_stats.get("used_day_count", 0)),
    }
