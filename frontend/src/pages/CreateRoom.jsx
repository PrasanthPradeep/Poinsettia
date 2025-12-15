import { useState } from 'react';
import { createRoom } from '../services/api';
import '../styles/CreateRoom.css';

function CreateRoom() {
  const [adminName, setAdminName] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createRoom({
        admin: adminName,
        time: matchTime
      });
      const data = await response.json();
      
      if (data.room_id) {
        setRoomId(data.room_id);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Make sure the backend is running!');
    } finally {
      setLoading(false);
    }
  };

  if (roomId) {
    return (
      <div className="success-container">
        <div className="success-card">
          <h2>🎄 Room Created Successfully!</h2>
          <div className="room-id-display">
            <p>Room ID:</p>
            <div className="room-id">{roomId}</div>
          </div>
          <p className="share-message">Share this ID with your friends!</p>
          <div className="share-link">
            {window.location.origin}/join?room={roomId}
          </div>
          <button onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/join?room=${roomId}`);
            alert('Link copied to clipboard!');
          }}>
            📋 Copy Link
          </button>
            <button onClick={() => window.location.href = `/dashboard?room=${roomId}`}>
              📊 View Dashboard
            </button>
            <button onClick={() => window.location.href = '/'} style={{background: 'linear-gradient(135deg, #95e1d3 0%, #f38181 100%)'}}>
              ➕ Create Another Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-room-container">
      <div className="create-room-card">
        <h1>🎅 Create a Christmas Match Room</h1>
        <p className="subtitle">Set up your Secret Santa gift exchange!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 Your Name (Admin)</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>⏰ Match Time</label>
            <input
              type="datetime-local"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              required
            />
            <small>When should the matches be revealed?</small>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? '🎁 Creating...' : '🎄 Create Room'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
