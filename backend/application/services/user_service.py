from typing import List

from backend.domain.entities.user import User
from backend.interfaces.repositories.user_repository import UserRepository


class UserService:
    """
    Application service (use case) for users.
    Contains business rules, no framework code.
    """

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def register_user(self, name: str, email: str) -> User:
        """
        Register a new user.

        Business rules:
        - Email must be unique
        """
        if self.user_repository.find_by_email(email):
            raise ValueError("Email already exists")

        user = User(
            id=None,
            name=name,
            email=email
        )

        return self.user_repository.save(user)

    def list_users(self) -> List[User]:
        """
        Return all users.
        """
        return self.user_repository.list_all()
