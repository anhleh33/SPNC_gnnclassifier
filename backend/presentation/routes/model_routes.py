from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from uuid import uuid4

from backend.application.exception import MLServiceUnavailable
from backend.di import image_classifier_service, image_storage_service


model_bp = Blueprint("model", __name__, url_prefix="/model")

CLASSIFIERS = {
    "single": image_classifier_service.classify_image_single,
    "dual": image_classifier_service.classify_image_dual,
}

# @model_bp.route("/classification", methods=["POST"])
# @jwt_required()
# def create_prediction():
#     user_id = get_jwt_identity()
#     print("JWT identity:", user_id, type(user_id))

#     try:
#         if "image" not in request.files:
#             return jsonify({"error": "Image file is required"}), 400

#         image_file = request.files["image"]
#         image_bytes = image_file.read()

#         variant = request.headers.get("X-Model-Variant", "single")
#         classifier = CLASSIFIERS.get(variant)
#         if not classifier:
#             return jsonify({"error": "Invalid model variant"}), 400

#         # 1️⃣ Upload image (storage service)
#         image_path = image_storage_service.upload(
#             user_id=user_id,
#             image_bytes=image_bytes,
#             filename=image_file.filename,
#         )

#         # 2️⃣ Run classification (heavy)
#         result = classifier(image_bytes)

#         # 3️⃣ Persist analysis (history service)
#         # classification_history_service.save(
#         #     user_id=user_id,
#         #     image_path=image_path,
#         #     result=result,
#         #     model_variant=variant,
#         # )

#         # 4️⃣ Return result
#         return jsonify(result), 200

#     except MLServiceUnavailable:
#         return jsonify({
#             "error": "Model temporarily unavailable",
#             "retryable": True
#         }), 503

#     except Exception as e:
#         return jsonify({
#             "error": str(e),
#             "retryable": True
#         }), 500

@model_bp.route("/classification", methods=["POST"])
@jwt_required()
def create_prediction():
    user_id = get_jwt_identity()
    print("JWT identity:", user_id, type(user_id))

    if "image" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    image_file = request.files["image"]
    image_bytes = image_file.read()

    variant = request.headers.get("X-Model-Variant", "single")
    classifier = CLASSIFIERS.get(variant)
    if not classifier:
        return jsonify({"error": "Invalid model variant"}), 400

    image_path = image_storage_service.upload(
        user_id=user_id,
        image_bytes=image_bytes,
        filename=image_file.filename,
        content_type=image_file.mimetype
    )

    result = classifier(image_bytes)
    return jsonify(result), 200
