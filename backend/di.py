from backend.application.services.health_service import HealthService
from backend.infrastructure.repositories.postgres_health_repository import PostgresHealthRepository

from backend.application.services.user_service import UserService
from backend.infrastructure.repositories.postgres_user_repository import PostgresUserRepository

health_service = HealthService(PostgresHealthRepository())
user_service = UserService(PostgresUserRepository())