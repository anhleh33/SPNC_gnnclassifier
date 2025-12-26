from flask import Blueprint, jsonify

from backend.application.services.health_service import HealthService
from backend.infrastructure.repositories.postgres_health_repository import PostgresHealthRepository

default_bp = Blueprint("default", __name__)

@default_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
    }), 200


@default_bp.route("/teapot", methods=["GET"])
def teapot():
    return jsonify({
        "message": "I'm a teapot ☕",
    }), 418

@default_bp.route("/ping", methods=["GET"])
def ping():
    try:
        health_repository = PostgresHealthRepository()
        health_service = HealthService(health_repository)

        health_service.check()   # 🔥 THIS WAS MISSING

        return jsonify({
            "database": "postgresql",
            "provider": "supabase",
            "status": "healthy"
        }), 200

    except Exception as e:
        return jsonify({
            "database": "postgresql",
            "provider": "supabase",
            "status": "unhealthy",
            "error": str(e)
        }), 500
