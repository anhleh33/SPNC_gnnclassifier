from abc import ABC, abstractmethod
from typing import List, Optional
from backend.domain.entities.user import User


class UserRepository(ABC):

    @abstractmethod
    def save(self, user: User) -> User:
        """
        Persist a user and return the saved user
        (e.g., with ID assigned)
        """
        pass

    @abstractmethod
    def find_by_email(self, email: str) -> Optional[User]:
        """
        Return a user if email exists, otherwise None
        """
        pass

    @abstractmethod
    def find_by_id(self, user_id: int) -> Optional[User]:
        """
        Find a user by ID
        """
        pass

    @abstractmethod
    def list_all(self) -> List[User]:
        """
        Return all users
        """
        pass
