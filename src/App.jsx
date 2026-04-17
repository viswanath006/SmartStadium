import React, { useState, useEffect } from 'react';
import './index.css';

// --- SUB-COMPONENTS --- //
const AlertBanner = ({ message }) => (
  <div className="alert-banner">
    ⚠️ <strong>Active Alert:</strong> {message}
  </div>
);

const QueueCard = ({ title, waitTime }) => {
  let statusColor = 'var(--status-go)';
  if (waitTime > 10) statusColor = 'var(--status-warn)';
  if (waitTime > 20) statusColor = 'var(--status-crit)';

  const isShortest = waitTime <= 5;

  return (
    <div className="card" style={isShortest ? { borderColor: 'var(--status-go)' } : {}}>
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      {isShortest && <span style={{ fontSize: '0.8rem', color: 'var(--status-go)' }}>★ Shortest Queue</span>}
      <div className="queue-flex">
        <span style={{ color: 'var(--text-muted)' }}>Estimated Wait:</span>
        <span className="time-badge" style={{ backgroundColor: statusColor, color: '#fff' }}>
          {waitTime} min
        </span>
      </div>
    </div>
  );
};

const MapMockup = ({ type }) => {
  const bgColor = type === 'Heatmap' ? '#450a0a' : '#1e3a8a';
  return (
    <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor }}>
      <h2 style={{ opacity: 0.5 }}>[ Interactive {type} Visualization Area ]</h2>
    </div>
  );
};

// --- MAIN APPLICATION --- //
export default function App() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [queues, setQueues] = useState([
    { id: 1, name: 'Main Concourse Hotdogs', time: 12 },
    { id: 2, name: 'Upper Deck Drinks', time: 4 },
    { id: 3, name: 'Restroom (Gate A)', time: 25 },
    { id: 4, name: 'Restroom (Gate C)', time: 2 }
  ]);

  // Hackathon Trick: Simulate live data updates completely locally
  useEffect(() => {
    const timer = setInterval(() => {
      setQueues(prev => prev.map(q => ({
        ...q,
        time: Math.max(0, q.time + (Math.floor(Math.random() * 3) - 1))
      })));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-container">
      <h1 style={{ color: 'var(--accent-blue)' }}>SyncArena Hub</h1>
      
      {/* Dynamic Alerts */}
      {queues.some(q => q.time > 20) && (
        <AlertBanner message="High congestion detected near Gate A. Please route fans to Gate C." />
      )}

      {/* Navigation */}
      <div className="nav-header">
        {['DASHBOARD', 'HEATMAP', 'QUEUES', 'NAVIGATION'].map(tab => (
          <button 
            key={tab}
            className={`nav-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Screen Views */}
      <div className="view-container">
        {activeTab === 'DASHBOARD' && (
          <div className="grid-layout">
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h2>Welcome to the Command Center</h2>
              <p style={{ color: 'var(--text-muted)' }}>Monitor real-time physical stadium infrastructure below.</p>
            </div>
            {queues.map(q => <QueueCard key={q.id} title={q.name} waitTime={q.time} />)}
          </div>
        )}

        {activeTab === 'HEATMAP' && (
          <div>
            <h2>Live Crowd Density</h2>
            <MapMockup type="Heatmap" />
          </div>
        )}

        {activeTab === 'QUEUES' && (
          <div className="grid-layout">
            {queues.map(q => <QueueCard key={q.id} title={q.name} waitTime={q.time} />)}
          </div>
        )}

        {activeTab === 'NAVIGATION' && (
          <div>
            <h2>Smart Routing Paths</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div className="card">
                <h3>Route Suggestions</h3>
                <p>📍 You are at: <strong>Section 104</strong></p>
                <button className="nav-button active" style={{ width: '100%', marginBottom: '10px' }}>Route to Empty Restroom</button>
                <button className="nav-button" style={{ width: '100%' }}>Route to Exit</button>
              </div>
              <MapMockup type="Navigation Path" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
