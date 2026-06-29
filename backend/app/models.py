import json
from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Memo(Base):
    __tablename__ = "memos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str | None] = mapped_column(String(128), nullable=True, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str | None] = mapped_column(String(64), nullable=True)
    _tags: Mapped[str] = mapped_column("tags", Text, default="[]", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )

    @property
    def tags(self) -> list[str]:
        try:
            value = json.loads(self._tags)
        except json.JSONDecodeError:
            return []
        if not isinstance(value, list):
            return []
        return [str(tag) for tag in value if str(tag).strip()]

    @tags.setter
    def tags(self, value: list[str]) -> None:
        self._tags = json.dumps([tag.strip() for tag in value if tag.strip()], ensure_ascii=False)

    @property
    def channel(self) -> str | None:
        return {
            "incoming_webhook": "API",
            "wechat": "微信",
            "android": "Android",
            "web": "Web",
            "mobile": "Mobile",
            "register": "注册",
            "system": "系统",
        }.get(self.source or "")
