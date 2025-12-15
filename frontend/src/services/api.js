const BASE_URL = "http://localhost:8000";

export const createRoom = (data) =>
  fetch(`${BASE_URL}/create-room?admin_name=${data.admin}&match_time=${data.time}`, { method: "POST" });

export const joinRoom = (data) =>
  fetch(`${BASE_URL}/join-room?room_id=${data.room}&name=${data.name}`, { method: "POST" });
