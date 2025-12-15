# 🎄 Christmas Friend Matcher

A Secret Santa gift exchange app that automatically matches participants at a scheduled time!

## Features

- 🎅 **Create Rooms**: Set up a Secret Santa room with a scheduled match reveal time
- 🎁 **Join Rooms**: Participants join using a unique room ID
- ⏰ **Auto-Match**: Matches are automatically revealed at the scheduled time
- 🔀 **Random Pairing**: Fair random matching algorithm
- 🎪 **Easy Sharing**: Share room links with friends
- 📊 **Dashboard**: View room details, participants, and manage matches
- 🎯 **Match Checker**: Users can check their match status anytime

## Tech Stack

**Backend:**
- FastAPI (Python)
- APScheduler for scheduled tasks
- SQLite database for persistent storage
- Context-managed database connections

**Frontend:**
- React + Vite
- Vanilla CSS with gradient designs
- Client-side routing

## Quick Start

Use the provided startup script to run both frontend and backend:

```bash
chmod +x start.sh
./start.sh
```

Or follow the manual setup below:

## Setup & Installation

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## How to Use

1. **Create a Room**:
   - Click "Create Room" on the home page
   - Enter your name (as admin)
   - Set the date and time when matches should be revealed
   - Get your unique Room ID

2. **Share the Room**:
   - Copy the room link or ID
   - Share with your friends

3. **Join a Room**:
   - Click "Join Room"
   - Enter the Room ID
   - Enter your name

4. **Wait for Matches**:
   - The system will automatically reveal matches at the scheduled time
   - Each participant will be matched with another person

  5. **Check Your Match**:
    - Go to "My Match" page
    - Enter your room ID and name
    - See who you're matched with (if published) or when matches will be revealed

  6. **View Dashboard** (Admin):
    - Go to "Dashboard" page
    - Enter your room ID
    - See all participants and their matches (if published)
    - Manually publish matches before scheduled time if needed

## API Endpoints

- `POST /create-room` - Create a new room
  - Query params: `admin_name`, `match_time` (ISO format)
  - Returns: `{room_id: string}`

- `POST /join-room` - Join an existing room
  - Query params: `room_id`, `name`
  - Returns: `{message: string}`

- `GET /room/{room_id}` - Get room details
  - Returns: Room object with users and status

- `POST /publish-match` - Manually publish matches
  - Query params: `room_id`
  - Returns: `{message: string}`

- `GET /user-match/{room_id}/{user_name}` - Check user's match status
  - Returns: User match details including matched partner (if published)

  - `GET /user-match/{room_id}/{user_name}` - Check user's match status
    - Returns: User match details including matched partner (if published)

## Project Structure

```
xmas/
├── backend/
│   ├── main.py              # FastAPI app & startup
│   ├── models.py            # (Empty - for future use)
│   ├── scheduler.py         # APScheduler setup
│   ├── requirements.txt     # Python dependencies
│   ├── routes/
│   │   ├── room.py         # Room creation & management
│   │   └── user.py         # User join functionality
│   └── utils/
│       ├── matcher.py      # Matching algorithm
│       ├── publish.py      # Publish room matches
│       └── auto_publish.py # Auto-publish scheduled rooms
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CreateRoom.jsx
│   │   │   └── JoinRoom.jsx
│   │   ├── styles/
│   │   │   ├── Home.css
│   │   │   ├── CreateRoom.css
│   │   │   └── JoinRoom.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Notes

- ✅ **Persistent Storage**: Rooms and matches are saved in SQLite database (`christmas_matcher.db`)
- ✅ **Survives Restarts**: All data persists across server restarts
- Match times should be in ISO format (e.g., `2025-12-25T18:00`)
- The auto-publish check runs every 30 seconds
- Unique room IDs are 8-character UUID prefixes
- User names must be unique within each room

## Future Enhancements

- [ ] Persistent storage (database)
- [ ] User authentication
- [ ] Email notifications
- [ ] Custom matching rules (exclusions)
- [ ] Gift preference settings
- [ ] Mobile app

---

Happy Holidays! 🎄🎁🎅
