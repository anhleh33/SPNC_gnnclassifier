import uuid

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash

from backend.domain.entities.user import User
from backend.domain.exception import InvalidCredentials, InvalidUserData
from backend.di import user_service

user_bp = Blueprint("users", __name__, url_prefix="/users")

@user_bp.route("/create", methods=["POST"])
def create_user():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        user = User(
            id=None,
            full_name=data.get("full_name"),
            username=data.get("username"),
            email=data.get("email"),
            password=data.get("password"),
            avatar_color=data.get("avatar_color"),
            created_at=None,
        )

        created = user_service.create_user(user)

        return jsonify({
            "id": created.id,
            "username": created.username,
            "email": created.email,
        }), 201

    except (ValueError, InvalidUserData) as e:
        return jsonify({"error": str(e)}), 400

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    try:
        user = user_service.authenticate(
            identifier=data["identifier"],
            password=data["password"]
        )

        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }), 200

    except InvalidCredentials:
        return jsonify({"error": "Invalid credentials"}), 401

@user_bp.get("/check")
def check_username():
    username = request.args.get("username")

    if not username:
        return jsonify({"error": "username is required"}), 400

    available = user_service.is_username_available(username)

    return jsonify({
        "available": available
    })

# @user_bp.route("/test-create", methods=["GET"])
# def test_create():
#     # Generate unique credentials every time
#     suffix = uuid.uuid4().hex[:8]
#     username = f"route_user_{suffix}"
#     email = f"{username}@example.com"

#     user = User(
#         id=None,
#         full_name="Route User",
#         username=username,
#         email=email,
#         password=b"123",          # BYTEA → OK
#         avatar_color="#00ffaa",
#         created_at=None,
#     )

#     created = user_service.create_user(user)

#     return jsonify({
#         "id": created.id,
#         "username": created.username,
#         "email": created.email,
#     }), 201