from sqlalchemy import text
from backend.infrastructure.database.postgres import SessionLocal
from backend.interfaces.repositories.health_repository_interface import IHealthRepository


class PostgresHealthRepository(IHealthRepository):
    def ping(self) -> None:
        session = SessionLocal()
        try:
            session.execute(text("SELECT 1"))
        finally:
            session.close()
