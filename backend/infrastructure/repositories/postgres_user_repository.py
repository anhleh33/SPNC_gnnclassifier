from typing import Optional, List

from backend.domain.entities.user import User
from backend.interfaces.repositories.user_repository import UserRepository

from backend.infrastructure.database.postgres import SessionLocal
from backend.infrastructure.database.models.user_model import UserModel

class PostgresUserRepository(UserRepository):
    def __init__(self):
        self.db = SessionLocal()

    def _to_entity(self, model: UserModel) -> User:
        return User(
            id=model.id,
            full_name=model.full_name,
            username=model.username,
            email=model.email,
            password=model.password,
            avatar_color=model.avatar_color,
            created_at=model.created_at,
        )

    def _to_model(self, user: User) -> UserModel:
        return UserModel(
            full_name=user.full_name,
            username=user.username,
            email=user.email,
            password=user.password,
            avatar_color=user.avatar_color,
        )

    # CRUD
    def create(self, user: User) -> User:
        model = self._to_model(user)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        model = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        if not model:
            return None
        return self._to_entity(model)

    def get_by_username(self, username: str) -> Optional[User]:
        model = (
            self.db.query(UserModel)
            .filter(UserModel.username == username)
            .first()
        )
        if not model:
            return None
        return self._to_entity(model)

    def list_all(self) -> List[User]:
        models = self.db.query(UserModel).all()
        return [self._to_entity(m) for m in models]

    def close(self):
        self.db.close()