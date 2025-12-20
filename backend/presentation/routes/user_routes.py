from flask import Blueprint, request, jsonify

from backend.application.services.user_service import UserService
from backend.infrastructure.repositories.json_user_repository import JsonUserRepository

user_bp = Blueprint("users", __name__, url_prefix="/users")

# Dependency wiring (manual DI)
user_repository = JsonUserRepository()
user_service = UserService(user_repository)


@user_bp.route("", methods=["POST"])
def create_user():
    """
    Create a new user
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    name = data.get("name")
    email = data.get("email")

    if not name or not email:
        return jsonify({"error": "name and email are required"}), 400

    try:
        user = user_service.register_user(name=name, email=email)

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email
        }), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@user_bp.route("", methods=["GET"])
def list_users():
    """
    List all users
    """
    users = user_service.list_users()

    return jsonify([
        {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
        for user in users
    ]), 200
