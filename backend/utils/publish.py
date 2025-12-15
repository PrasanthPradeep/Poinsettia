import database as db
from utils.matcher import match_users

def publish_room(room_id: str):
    room = db.get_room(room_id)

    if not room:
        return

    if room["status"] == "matched":
        return  # prevent double publish

    match_users(room_id, room["users"])
    db.update_room_status(room_id, "matched")

    print(f"🎄 Matches published for room {room_id}")
