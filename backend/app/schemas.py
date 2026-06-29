from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class MemoBase(BaseModel):
    content: str = Field(min_length=1, max_length=20000)

    @field_validator("content")
    @classmethod
    def normalize_content(cls, value: str) -> str:
        content = value.strip()
        if not content:
            raise ValueError("content 不能为空")
        return content


class MemoCreate(MemoBase):
    pass


class MemoUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=20000)

    @field_validator("content")
    @classmethod
    def normalize_content(cls, value: str) -> str:
        content = value.strip()
        if not content:
            raise ValueError("content 不能为空")
        return content


class MemoRead(MemoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
