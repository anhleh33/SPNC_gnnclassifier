from flask import Flask
from backend.presentation.routes.default_routes import default_bp
from backend.presentation.routes.user_routes import user_bp
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()


def create_app():
    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(default_bp)
    app.register_blueprint(user_bp, url_prefix="/users")

     # Swagger UI
    SWAGGER_URL = "/docs"
    API_URL = "/static/openapi.yaml"

    swagger_bp = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            "app_name": "GNN Classifier API"
        }
    )

    app.register_blueprint(swagger_bp, url_prefix=SWAGGER_URL)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)