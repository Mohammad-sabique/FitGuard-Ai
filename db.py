from pathlib import Path
import sqlite3

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "fitguard_ai.sqlite3"


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                sex TEXT NOT NULL,
                height_cm REAL NOT NULL,
                weight_kg REAL NOT NULL,
                activity_level TEXT NOT NULL,
                goal TEXT NOT NULL,
                diet_preference TEXT NOT NULL,
                allergies TEXT,
                blood_pressure TEXT NOT NULL,
                diabetes TEXT NOT NULL,
                other_conditions TEXT,
                symptoms_notes TEXT,
                meal_photos TEXT,
                body_photos TEXT,
                reports TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                user_name TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                summary TEXT NOT NULL,
                payload_json TEXT NOT NULL
            )
            """
        )
        conn.commit()
