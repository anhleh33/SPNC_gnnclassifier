from backend.interfaces.repositories.user_repository_interface import IUserRepository
from backend.domain.entities.user import User

class UserService:
    def __init__(self, user_repository: IUserRepository):
        self.user_repository = user_repository

    def create_user(self, user: User) -> User:
        return self.user_repository.create(user)

    def get_user_by_username(self, username: str):
        return self.user_repository.get_by_username(username)

    def get_user_by_id(self, user_id: int):
        return self.user_repository.get_by_id(user_id)

    def list_users(self):
        return self.user_repository.list_all()
