from flask import Blueprint, jsonify

default_bp = Blueprint("default", __name__)


@default_bp.route("/version", methods=["GET"])
def version():
    return jsonify({
        "version": "0.1.1",
        "name": "GNN Classifier",
        "log": "PostgreSQL Implementation"
    }), 200


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
