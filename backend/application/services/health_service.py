from backend.interfaces.repositories.health_repository_interface import IHealthRepository


class HealthService:
    def __init__(self, health_repository: IHealthRepository):
        self.health_repository = health_repository

    def ping_database(self) -> None:
        return self.health_repository.ping()