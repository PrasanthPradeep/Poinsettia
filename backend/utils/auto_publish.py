from datetime import datetime
import database as db
from utils.publish import publish_room

def auto_publish_rooms():
    now = datetime.now()
    room_ids = db.get_rooms_to_publish(now)
    
    for room_id in room_ids:
        publish_room(room_id)
        print(f"🎄 Auto-published room {room_id}")
