import { useState, useEffect } from 'react';
import '../styles/MyMatch.css';

const BASE_URL = "http://localhost:8000";

function MyMatch() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    const name = params.get('name');
    if (room && name) {
      setRoomId(room);
      setUserName(name);
      checkMatch(room, name);
    }
  }, []);

  const checkMatch = async (room, name) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/user-match/${room}/${encodeURIComponent(name)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setMatchData(null);
      } else {
        setMatchData(data);
      }
    } catch (err) {
      setError('Failed to check match status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId.trim() && userName.trim()) {
      checkMatch(roomId.trim(), userName.trim());
      window.history.pushState({}, '', `/my-match?room=${roomId.trim()}&name=${encodeURIComponent(userName.trim())}`);
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
    <div className="my-match-container">
      <div className="my-match-card">
        <h1>🎁 Check Your Match</h1>
        <p className="subtitle">See who you're matched with!</p>
        
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
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? '🔍 Checking...' : '🎁 Check My Match'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {matchData && (
          <div className="match-result">
            <div className="result-header">
              <h2>Hello, {matchData.user_name}! 👋</h2>
            </div>

            <div className="room-info">
              <p><strong>Room:</strong> {matchData.room_id}</p>
              <p><strong>Admin:</strong> {matchData.admin}</p>
            </div>

            {matchData.status === 'matched' && matchData.matched_with ? (
              <div className="match-revealed">
                <div className="gift-icon">🎁</div>
                <h3>Your Secret Santa Match:</h3>
                <div className="matched-name">{matchData.matched_with}</div>
                <p className="success-message">
                  You're giving a gift to <strong>{matchData.matched_with}</strong>!
                </p>
              </div>
            ) : (
              <div className="match-pending">
                <div className="waiting-icon">⏳</div>
                <h3>Matches Not Published Yet</h3>
                <p>Your match will be revealed on:</p>
                <div className="publish-time">{formatDateTime(matchData.match_time)}</div>
                <p className="tip">Check back after this time to see your match!</p>
              </div>
            )}

            <button 
              onClick={() => checkMatch(roomId, userName)}
              className="refresh-btn"
            >
              🔄 Refresh Status
            </button>
          </div>
        )}

        <div className="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default MyMatch;
