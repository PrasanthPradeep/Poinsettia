from fastapi import APIRouter
import database as db

router = APIRouter()

@router.post("/join-room")
def join_room(room_id: str, name: str):
    room = db.get_room(room_id)
    if not room:
        return {"error": "Room not found"}
    
    try:
        db.add_user_to_room(room_id, name)
        return {"message": "Joined room 🎄"}
    except Exception as e:
        # Handle duplicate name
        if "UNIQUE constraint failed" in str(e):
            return {"error": "Name already taken in this room"}
        return {"error": "Failed to join room"}
