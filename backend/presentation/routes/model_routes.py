from flask import Blueprint, request, jsonify

from backend.application.exception import MLServiceUnavailable
from backend.di import image_classifier_service

model_bp = Blueprint("model", __name__, url_prefix="/model")

CLASSIFIERS = {
    "single": image_classifier_service.classify_image_single,
    "dual": image_classifier_service.classify_image_dual,
}

@model_bp.route("/classification", methods=["POST"])
def create_prediction():
    if "image" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    image_file = request.files["image"]
    if image_file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    image_bytes = image_file.read()

    variant = request.headers.get("X-Model-Variant", "single")

    classifier = CLASSIFIERS.get(variant)
    if not classifier:
        return jsonify({"error": "Invalid model variant"}), 400

    try:
        result = classifier(image_bytes)
        return jsonify(result), 200

    except MLServiceUnavailable:
        return jsonify({
            "error": "Model temporarily unavailable",
            "retryable": True
        }), 503
