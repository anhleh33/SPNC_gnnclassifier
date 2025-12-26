from flask import Blueprint, request, jsonify
import uuid

from backend.domain.entities.user import User
from backend.infrastructure.repositories.postgres_user_repository import PostgresUserRepository
from backend.application.services.user_service import UserService

user_bp = Blueprint("users", __name__, url_prefix="/users")

# Dependency wiring (manual DI)
user_repository = PostgresUserRepository()
user_service = UserService(user_repository)


@user_bp.route("/create", methods=["POST"])
def create_user():
    repo = PostgresUserRepository()
    service = UserService(repo)

    data = request.get_json()
    user = User(
        id=None,
        full_name=data["full_name"],
        username=data["username"],
        email=data["email"],
        password=data["password"].encode(),
        avatar_color=data["avatar_color"],
        created_at=None,
    )

    created = service.create_user(user)

    return jsonify({
        "id": created.id,
        "username": created.username,
        "email": created.email,
    }), 201

@user_bp.route("/test-create", methods=["GET"])
def test_create():
    # Create fresh repository + service per request
    repo = PostgresUserRepository()
    service = UserService(repo)

    # Generate unique credentials every time
    suffix = uuid.uuid4().hex[:8]
    username = f"route_user_{suffix}"
    email = f"{username}@example.com"

    user = User(
        id=None,
        full_name="Route User",
        username=username,
        email=email,
        password=b"123",          # BYTEA → OK
        avatar_color="#00ffaa",
        created_at=None,
    )

    created = service.create_user(user)

    return jsonify({
        "id": created.id,
        "username": created.username,
        "email": created.email,
    }), 201