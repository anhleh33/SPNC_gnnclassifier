class HealthService:
    def __init__(self, repository):
        self.repository = repository

    def check(self) -> None:
        self.repository.check()
