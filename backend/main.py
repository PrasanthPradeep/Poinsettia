from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import room, user
import database as db

app = FastAPI(title="Christmas Friend Match")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(room.router)
app.include_router(user.router)

import asyncio
from utils.auto_publish import auto_publish_rooms

@app.on_event("startup")
async def start_auto_publish():
    # Initialize database
    db.init_db()
    print("💾 Database initialized")
    
    # Start auto-publish background task
    async def loop():
        while True:
            auto_publish_rooms()
            await asyncio.sleep(30)  # check every 30 seconds

    asyncio.create_task(loop())
