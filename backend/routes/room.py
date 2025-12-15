from fastapi import APIRouter
import uuid
from datetime import datetime
from scheduler import scheduler
from utils.publish import publish_room
from utils.matcher import match_users
import database as db

router = APIRouter()

def generate_room_id():
    return str(uuid.uuid4())[:8]

@router.post("/create-room")
def create_room(admin_name: str, match_time: str):
    room_id = generate_room_id()
    match_datetime = datetime.fromisoformat(match_time)
    
    db.create_room(room_id, admin_name, match_datetime)

    scheduler.add_job(
        publish_room,
        'date',
        run_date=match_datetime,
        args=[room_id]
    )

    return {"room_id": room_id}

@router.post("/publish-match")
def publish_match(room_id: str):
    room = db.get_room(room_id)
    if not room:
        return {"error": "Invalid room"}

    match_users(room_id, room["users"])
    db.update_room_status(room_id, "matched")
    return {"message": "Matches published 🎁"}

@router.get("/room/{room_id}")
def get_room(room_id: str):
    room = db.get_room(room_id)
    if not room:
        return {"error": "Room not found"}
    return room

@router.get("/user-match/{room_id}/{user_name}")
def get_user_match(room_id: str, user_name: str):
    match_info = db.get_user_match(room_id, user_name)
    if not match_info:
        room = db.get_room(room_id)
        if not room:
            return {"error": "Room not found"}
        return {"error": "User not found in room"}
    return match_info
