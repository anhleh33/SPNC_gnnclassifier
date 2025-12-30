import os
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────
# Database
# ─────────────────────────────
DATABASE_URL: str = os.getenv("DATABASE_URL")