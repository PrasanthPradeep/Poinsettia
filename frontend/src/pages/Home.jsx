import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>🎄Poinsettia</h1>
        <p className="tagline">Evergreen connections, revealed on time🌺!</p>

<div class="snow-container"></div>
<ul class="christmas-lights">
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
    <li><span></span></li>
</ul>

    <div className="actions">
          <a href="/create" className="btn btn-primary">
            🎅 Create Room
          </a>
          <a href="/join" className="btn btn-secondary">
            🎁 Join Room
          </a>
            <a href="/dashboard" className="btn btn-dashboard">
              📊 Dashboard
            </a>
            <a href="/my-match" className="btn btn-match">
              🎯 My Match
            </a>
    </div>

        <div className="features">
          <div className="feature">
            <span className="emoji">🎅</span>
            <h3>Create Room</h3>
            <p>Start a new Secret Santa room and invite friends</p>
          </div>
          <div className="feature">
            <span className="emoji">🎁</span>
            <h3>Join Room</h3>
            <p>Join an existing room with a room ID</p>
          </div>
          <div className="feature">
            <span className="emoji">⏰</span>
            <h3>Auto Match</h3>
            <p>Matches reveal automatically at scheduled time</p>
          </div>
            <div className="feature">
              <span className="emoji">📊</span>
              <h3>Dashboard</h3>
              <p>View room details and participants</p>
            </div>
            <div className="feature">
              <span className="emoji">🎯</span>
              <h3>My Match</h3>
              <p>Check who you're matched with</p>
            </div>
        </div>

        <div className="info">
          <h3>How it works:</h3>
          <ol>
            <li>Create a room and set when matches should be revealed</li>
            <li>Share the room ID with your friends</li>
            <li>Everyone joins the room with their name</li>
            <li>Matches are automatically revealed at the scheduled time!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Home;
