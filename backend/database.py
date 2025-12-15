import sqlite3
import json
from datetime import datetime
from typing import Optional, List, Dict
from contextlib import contextmanager

DB_FILE = "christmas_matcher.db"

@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initialize database schema."""
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS rooms (
                room_id TEXT PRIMARY KEY,
                admin TEXT NOT NULL,
                match_time TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'waiting'
            )
        """)
        
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_id TEXT NOT NULL,
                name TEXT NOT NULL,
                matched_with TEXT,
                FOREIGN KEY (room_id) REFERENCES rooms(room_id),
                UNIQUE(room_id, name)
            )
        """)
        
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_room 
            ON users(room_id)
        """)

def create_room(room_id: str, admin: str, match_time: datetime, status: str = "waiting"):
    """Create a new room."""
    with get_db() as conn:
        conn.execute(
            "INSERT INTO rooms (room_id, admin, match_time, status) VALUES (?, ?, ?, ?)",
            (room_id, admin, match_time.isoformat(), status)
        )

def get_room(room_id: str) -> Optional[Dict]:
    """Get room details with all users."""
    with get_db() as conn:
        room = conn.execute(
            "SELECT * FROM rooms WHERE room_id = ?", 
            (room_id,)
        ).fetchone()
        
        if not room:
            return None
        
        users = conn.execute(
            "SELECT name, matched_with FROM users WHERE room_id = ? ORDER BY id",
            (room_id,)
        ).fetchall()
        
        return {
            "admin": room["admin"],
            "match_time": room["match_time"],
            "status": room["status"],
            "users": [{"name": u["name"], "matched_with": u["matched_with"]} for u in users]
        }

def add_user_to_room(room_id: str, name: str):
    """Add a user to a room."""
    with get_db() as conn:
        conn.execute(
            "INSERT INTO users (room_id, name, matched_with) VALUES (?, ?, ?)",
            (room_id, name, None)
        )

def update_room_status(room_id: str, status: str):
    """Update room status."""
    with get_db() as conn:
        conn.execute(
            "UPDATE rooms SET status = ? WHERE room_id = ?",
            (status, room_id)
        )

def update_user_match(room_id: str, user_name: str, matched_with: str):
    """Update a user's match."""
    with get_db() as conn:
        conn.execute(
            "UPDATE users SET matched_with = ? WHERE room_id = ? AND name = ?",
            (matched_with, room_id, user_name)
        )

def get_user_match(room_id: str, user_name: str) -> Optional[Dict]:
    """Get a specific user's match info."""
    with get_db() as conn:
        room = conn.execute(
            "SELECT * FROM rooms WHERE room_id = ?",
            (room_id,)
        ).fetchone()
        
        if not room:
            return None
        
        user = conn.execute(
            "SELECT * FROM users WHERE room_id = ? AND name = ?",
            (room_id, user_name)
        ).fetchone()
        
        if not user:
            return None
        
        return {
            "room_id": room_id,
            "user_name": user["name"],
            "matched_with": user["matched_with"],
            "status": room["status"],
            "match_time": room["match_time"],
            "admin": room["admin"]
        }

def get_all_rooms() -> List[str]:
    """Get all room IDs."""
    with get_db() as conn:
        rooms = conn.execute("SELECT room_id FROM rooms").fetchall()
        return [r["room_id"] for r in rooms]

def get_rooms_to_publish(current_time: datetime) -> List[str]:
    """Get room IDs that should be auto-published."""
    with get_db() as conn:
        rooms = conn.execute(
            "SELECT room_id FROM rooms WHERE status = 'waiting' AND match_time <= ?",
            (current_time.isoformat(),)
        ).fetchall()
        return [r["room_id"] for r in rooms]
