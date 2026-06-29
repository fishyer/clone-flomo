from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class MemoBase(BaseModel):
    content: str = Field(min_length=1, max_length=20000)
    tags: list[str] = Field(default_factory=list)

    @field_validator("content")
    @classmethod
    def normalize_content(cls, value: str) -> str:
        content = value.strip()
        if not content:
            raise ValueError("content 不能为空")
        return content

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, value: list[str]) -> list[str]:
        seen = set()
        tags = []
        for tag in value:
            normalized = tag.replace("#", "", 1).strip()
            if normalized and normalized not in seen:
                seen.add(normalized)
                tags.append(normalized)
        return tags


class MemoCreate(MemoBase):
    pass


class MemoUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=20000)
    tags: list[str] = Field(default_factory=list)

    @field_validator("content")
    @classmethod
    def normalize_content(cls, value: str) -> str:
        content = value.strip()
        if not content:
            raise ValueError("content 不能为空")
        return content

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, value: list[str]) -> list[str]:
        return MemoBase.normalize_tags(value)


class MemoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str | None = None
    content: str
    tags: list[str] = Field(default_factory=list)
    source: str | None = None
    channel: str | None = None
    created_at: datetime
    updated_at: datetime


class MemoStatsRead(BaseModel):
    memo_count: int
    tag_count: int
    used_day_count: int
