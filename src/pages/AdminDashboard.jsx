import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, RefreshCw, AlertTriangle } from 'lucide-react';
import StadiumMap from '../components/StadiumMap';
import { getStatusColor } from '../utils';

const AdminDashboard = () => {
  const [data, setData] = useState({ status: 'LOADING...', zones: [] });

  const fetchState = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/state');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching state:", err);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerPost = async (endpoint, body = {}) => {
    await fetch(`http://localhost:3001/api/admin/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    fetchState(); // Immediate refresh
  };

  const handleCustomAlert = () => {
    const msg = prompt("Enter an emergency or operational broadcast message for all attendees:");
    if (msg) {
      triggerPost('custom-alert', { message: msg });
    }
  };

  return (
    <div className="main-content">
      <header className="header" style={{ marginBottom: '20px', borderColor: 'var(--status-warning)' }}>
        <div className="header-title" style={{ background: 'linear-gradient(135deg, var(--status-warning), #ef4444)' }}>
          <ShieldAlert color="var(--status-warning)" />
          Venue Ops Center
        </div>
        <div>
          <span style={{ padding: '8px 15px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
            State: <strong style={{ color: data.status === 'NORMAL' ? 'var(--status-good)' : 'var(--status-warning)' }}>{data.status}</strong>
          </span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* God Mode Controls */}
        <div className="glass-panel" style={{ padding: '20px', borderColor: 'var(--status-warning)' }}>
          <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} color="var(--status-warning)"/> 
            God Mode Triggers
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Updates sent from here are persisted to the Express backend and polled by Fan Apps instantly.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button 
              className="glass-button" 
              style={{ background: 'rgba(245, 158, 11, 0.2)', borderColor: 'var(--status-warning)' }}
              onClick={() => triggerPost('trigger-halftime')}
            >
              Simulate Halftime Rush
            </button>
            <button 
              className="glass-button" 
              style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--status-critical)' }}
              onClick={handleCustomAlert}
            >
              <AlertTriangle size={16} /> Broadcast Custom Alert
            </button>
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
              <button 
                className="glass-button" 
                style={{ width: '100%' }}
                onClick={() => triggerPost('clear-alerts')}
              >
                <RefreshCw size={16} /> Restore Normal State
              </button>
            </div>
          </div>
        </div>

        {/* Live Overview Mapping */}
        <div className="glass-panel" style={{ padding: '20px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginTop: 0 }}>Global Telemetry</h2>
          <div style={{ flex: 1, position: 'relative' }}>
             <StadiumMap zones={data.zones} />
          </div>
          
          {/* Quick Stats Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
             {data.zones && data.zones.map(z => (
               <div key={`stat-${z.id}`} style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{z.name} Util</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: getStatusColor(z.density, z.maxCapacity || 100) }}>{z.density}%</div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
