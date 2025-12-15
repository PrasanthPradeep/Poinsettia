import random
import database as db

def match_users(room_id: str, users: list):
    """Create a circular Secret Santa chain where each user gives to exactly one person."""
    if len(users) < 2:
        return  # Can't match with less than 2 users
    
    # Create a shuffled copy of user names
    shuffled_names = [user["name"] for user in users]
    random.shuffle(shuffled_names)
    
    # Create circular chain: each person gives to the next person in the shuffled list
    # Last person gives to the first person
    for i, user in enumerate(users):
        # Find this user's position in shuffled list
        giver_index = shuffled_names.index(user["name"])
        # They give to the next person (circular)
        receiver_index = (giver_index + 1) % len(shuffled_names)
        matched_with = shuffled_names[receiver_index]
        
        # Update in database
        db.update_user_match(room_id, user["name"], matched_with)
