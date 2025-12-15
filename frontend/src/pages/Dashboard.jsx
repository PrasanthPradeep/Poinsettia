import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const BASE_URL = "http://localhost:8000";

function Dashboard() {
  const [roomId, setRoomId] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) {
      setRoomId(room);
      loadRoomData(room);
    }
  }, []);

  const loadRoomData = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/room/${id}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setRoomData(null);
      } else {
        setRoomData(data);
      }
    } catch (err) {
      setError('Failed to load room data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      loadRoomData(roomId.trim());
      window.history.pushState({}, '', `/dashboard?room=${roomId.trim()}`);
    }
  };

  const handlePublish = async () => {
    if (!roomId) return;
    
    try {
      const response = await fetch(`${BASE_URL}/publish-match?room_id=${roomId}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        loadRoomData(roomId);
      }
    } catch (err) {
      alert('Failed to publish matches');
      console.error(err);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>🎄 Room Dashboard</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            required
          />
          <button type="submit">View Room</button>
        </form>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {roomData && (
          <div className="room-info">
            <div className="info-header">
              <h2>Room: {roomId}</h2>
              <span className={`status-badge ${roomData.status}`}>
                {roomData.status === 'matched' ? '✅ Matched' : '⏳ Waiting'}
              </span>
            </div>

            <div className="room-details">
              <div className="detail-item">
                <strong>👤 Admin:</strong> {roomData.admin}
              </div>
              <div className="detail-item">
                <strong>⏰ Match Time:</strong> {formatDateTime(roomData.match_time)}
              </div>
              <div className="detail-item">
                <strong>👥 Participants:</strong> {roomData.users.length}
              </div>
            </div>

            <div className="users-section">
              <h3>Participants</h3>
              {roomData.users.length === 0 ? (
                <p className="no-users">No participants yet</p>
              ) : (
                <div className="users-grid">
                  {roomData.users.map((user, index) => (
                    <div key={index} className="user-card">
                      <div className="user-name">👤 {user.name}</div>
                      {roomData.status === 'matched' && user.matched_with && (
                        <div className="user-match">
                          🎁 → {user.matched_with}
                        </div>
                      )}
                      {roomData.status === 'waiting' && (
                        <div className="user-waiting">⏳ Waiting...</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {roomData.status === 'waiting' && (
              <div className="admin-actions">
                <button onClick={handlePublish} className="publish-btn">
                  🎁 Publish Matches Now
                </button>
                <p className="note">Or wait until: {formatDateTime(roomData.match_time)}</p>
              </div>
            )}

            <div className="share-section">
              <h3>Share Room</h3>
              <div className="share-link">
                {window.location.origin}/join?room={roomId}
              </div>
              <button onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/join?room=${roomId}`);
                alert('Link copied!');
              }}>
                📋 Copy Link
              </button>
            </div>
          </div>
        )}

        <div className="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
