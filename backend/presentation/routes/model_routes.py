from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from uuid import uuid4

from backend.application.exception import MLServiceUnavailable
from backend.di import image_classifier_service, image_storage_service, classification_history_service


model_bp = Blueprint("model", __name__, url_prefix="/model")

CLASSIFIERS = {
    "kNN-Voting": image_classifier_service.classify_image_single,
    "GraphSAGE-I_v2": image_classifier_service.classify_image_dual,
}

@model_bp.route("/classification", methods=["POST"])
@jwt_required()
def create_prediction():
    user_id = int(get_jwt_identity())
    print("JWT identity:", user_id, type(user_id))

    if "image" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    image_file = request.files["image"]
    image_bytes = image_file.read()

    variant = request.headers.get("X-Model-Variant", "kNN-Voting")
    classifier = CLASSIFIERS.get(variant)
    if not classifier:
        return jsonify({"error": "Invalid model variant"}), 400

    # 1️⃣ Upload image (storage)
    image_path = image_storage_service.upload(
        user_id=user_id,
        image_bytes=image_bytes,
        filename=image_file.filename,
        content_type=image_file.mimetype,
    )

    # 2️⃣ Run model
    result = classifier(image_bytes)

    # 3️⃣ Persist classification history ✅
    classification_history_service.save(
        user_id=user_id,
        image_path=image_path,
        result=result,          # full JSON
        model_variant=variant,  # "single" | "dual"
    )

    # 4️⃣ Return model result
    return jsonify(result), 200

@model_bp.route("/classifications", methods=["GET"])
@jwt_required()
def list_classifications():
    user_id = int(get_jwt_identity())
    page = int(request.args.get("page", 1))
    q = request.args.get("q")  # 👈 optional search keyword

    result = classification_history_service.list_user_history(
        user_id=user_id,
        page=page,
        q=q,
    )

    return jsonify({
        "items": [
            {
                "id": a.id,
                "public_code": a.public_code,
                "image_path": a.image_path,
                "label": a.label,
                "confidence": a.confidence,
                "subject": a.subject,
                "subject_code": a.subject_code,
                "grade": a.grade,
                "model_variant": a.model_variant,
                "created_at": a.created_at.isoformat(),
            }
            for a in result["items"]
        ],
        "page": result["page"],
        "limit": result["limit"],
        "total": result["total"],
        "total_pages": result["total_pages"],
        "q": q,
    })