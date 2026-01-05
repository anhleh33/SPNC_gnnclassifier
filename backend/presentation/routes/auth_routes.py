from flask import Blueprint, request, jsonify

from backend.domain.exception import InvalidCredentials
from backend.di import user_service

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/login", methods=["POST"])
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
        return jsonify({"error": "Incorrect username or password"}), 401