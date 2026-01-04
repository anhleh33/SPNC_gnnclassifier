from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from backend.settings import SHOW_STARTUP_MESSAGE, DOCS_URL, SWAGGER_URL
from backend.presentation.routes.default_routes import default_bp
from backend.presentation.routes.user_routes import user_bp
from backend.presentation.routes.swagger_routes import swagger_bp

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.logger.setLevel("INFO")

    CORS(app)

    app.register_blueprint(default_bp)
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(swagger_bp, url_prefix=SWAGGER_URL)

    # ✅ Startup message (modern Flask way)
    if SHOW_STARTUP_MESSAGE and DOCS_URL:
        app.logger.info("OpenAPI docs available at %s", DOCS_URL)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)