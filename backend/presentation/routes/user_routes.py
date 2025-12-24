from flask import Blueprint, request, jsonify

from backend.domain.entities.user import User
from backend.infrastructure.repositories.postgres_user_repository import PostgresUserRepository
from backend.application.services.user_service import UserService

user_bp = Blueprint("users", __name__, url_prefix="/users")

# Dependency wiring (manual DI)
user_repository = PostgresUserRepository()
user_service = UserService(user_repository)


@user_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    user = User(
        id=None,
        full_name=data["full_name"],
        username=data["username"],
        email=data["email"],
        password=data["password"].encode(),  # hashing comes later
        avatar_color=data["avatar_color"],
        created_at=None,
    )

    created_user = user_service.create_user(user)

    return jsonify({
        "id": created_user.id,
        "username": created_user.username,
        "email": created_user.email,
    }), 201

@user_bp.route("/test-create", methods=["GET"])
def test_create():
    repo = PostgresUserRepository()

    user = User(
        id=None,
        full_name="Route User",
        username="route_user",
        email="route@example.com",
        password=b"123",
        avatar_color="#00ffaa",
        created_at=None,
    )

    created = repo.create(user)

    return {
        "id": created.id,
        "username": created.username,
        "email": created.email,
    }