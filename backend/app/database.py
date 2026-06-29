import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool


BACKEND_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE_URL = f"sqlite:///{BACKEND_DIR / 'flomo.db'}"
DATABASE_URL = os.getenv("CLONE_FLOMO_DATABASE_URL", DEFAULT_DATABASE_URL)


class Base(DeclarativeBase):
    pass


def create_engine_for_url(database_url: str):
    options = {"future": True}
    if database_url.startswith("sqlite"):
        options["connect_args"] = {"check_same_thread": False}
    if database_url == "sqlite:///:memory:":
        options["poolclass"] = StaticPool
    return create_engine(database_url, **options)


def create_session_factory(bind_engine):
    return sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=bind_engine,
        future=True,
    )


engine = create_engine_for_url(DATABASE_URL)
SessionLocal = create_session_factory(engine)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
