import os
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────
# Database
# ─────────────────────────────
DATABASE_URL: str = os.getenv("DATABASE_URL")

# ─────────────────────────────
# Logger Configuration
# ─────────────────────────────
SHOW_STARTUP_MESSAGE: bool = True
DOCS_URL: str = "http://127.0.0.1:5000/docs"

# ─────────────────────────────
# Swagger Configuration
# ─────────────────────────────
SWAGGER_URL: str = "/docs"
API_URL: str = "/static/openapi.yaml"