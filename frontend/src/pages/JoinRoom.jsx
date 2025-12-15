import { useState, useEffect } from 'react';
import { joinRoom } from '../services/api';
import '../styles/JoinRoom.css';

function JoinRoom() {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) {
      setRoomId(room);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await joinRoom({
        room: roomId,
        name: name
      });
      const data = await response.json();
      
      if (data.message) {
        setJoined(true);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Make sure the backend is running!');
    } finally {
      setLoading(false);
    }
  };

  if (joined) {
    return (
      <div className="success-container">
        <div className="success-card">
          <h2>🎄 Successfully Joined!</h2>
          <p>Welcome to the Christmas gift exchange, {name}!</p>
          <div className="waiting-message">
            <p>⏳ Waiting for matches to be revealed...</p>
            <p className="small-text">You'll receive your match when the admin publishes the results!</p>
          </div>
            <button onClick={() => window.location.href = `/my-match?room=${roomId}&name=${encodeURIComponent(name)}`}>
              🎁 Check My Match
            </button>
            <button onClick={() => window.location.href = '/'} style={{background: 'linear-gradient(135deg, #95e1d3 0%, #f38181 100%)', marginTop: '10px'}}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="join-room-container">
      <div className="join-room-card">
        <h1>🎁 Join Christmas Match</h1>
        <p className="subtitle">Join your friends' Secret Santa!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>🎪 Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              required
            />
          </div>

          <div className="form-group">
            <label>👤 Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? '🎁 Joining...' : '🎄 Join Room'}
          </button>
        </form>

        <div className="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
