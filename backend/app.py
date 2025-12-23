from flask import Flask
from backend.presentation.routes.user_routes import user_bp
from dotenv import load_dotenv
load_dotenv()


def create_app():
    app = Flask(__name__)
    app.register_blueprint(user_bp)
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)