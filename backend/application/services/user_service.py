from werkzeug.security import generate_password_hash, check_password_hash

from backend.interfaces.repositories.user_repository_interface import IUserRepository
from backend.domain.entities.user import User
from backend.domain.exception import InvalidCredentials

class UserService:
    def __init__(self, user_repository: IUserRepository):
        self.user_repository = user_repository

    def authenticate(self, identifier: str, password: str) -> User:
        user = self.get_user_by_identifier(identifier)

        if not user:
            raise InvalidCredentials("Invalid credentials")

        if not check_password_hash(user.password.decode(), password):
            raise InvalidCredentials("Invalid credentials")

        return user

    def create_user(self, user: User) -> User:
        # 🔐 business rule: passwords must be hashed
        hashed_password = generate_password_hash(user.password.decode())
        user.password = hashed_password.encode()

        return self.user_repository.create(user)
    
    def get_user_by_identifier(self, identifier: str):
        if "@" in identifier:
            return self.user_repository.get_by_email(identifier)
        return self.user_repository.get_by_username(identifier)
    
    def is_username_available(self, username: str) -> bool:
        user = self.user_repository.get_by_username(username)
        return user is None

    def get_user_by_username(self, username: str):
        return self.user_repository.get_by_username(username)

    def get_user_by_id(self, user_id: int):
        return self.user_repository.get_by_id(user_id)

    def list_users(self):
        return self.user_repository.list_all()
 