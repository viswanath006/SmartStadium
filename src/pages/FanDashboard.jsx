import React, { useState, useEffect } from 'react';
import { Bell, Map as MapIcon, Coffee, Activity, Navigation } from 'lucide-react';
import StadiumMap from '../components/StadiumMap';
import ExpressOrder from '../components/ExpressOrder';
import { getStatusColor } from '../utils';

const FanDashboard = () => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('MAP');
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/state');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching state:", err);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Live Data...</div>;

  return (
    <div className="main-content">
      <header className="header" style={{ marginBottom: '20px' }}>
        <div className="header-title">
          <Activity color="var(--accent-cyan)" />
          FanFlow
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'MAP' && (
            <button 
              className={`glass-button`}
              style={showRoute ? { background: 'rgba(59, 130, 246, 0.4)', borderColor: '#3b82f6' } : {}}
              onClick={() => setShowRoute(true)}
            >
              <Navigation size={18} color={showRoute ? "#60a5fa" : "white"} /> Show Route
            </button>
          )}

          <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 10px' }}></div>

          <button 
            className={`glass-button ${activeTab === 'MAP' ? 'primary' : ''}`}
            onClick={() => setActiveTab('MAP')}
          >
            <MapIcon size={18} /> Interactive Map
          </button>
          <button 
            className={`glass-button ${activeTab === 'ORDER' ? 'primary' : ''}`}
            onClick={() => setActiveTab('ORDER')}
          >
            <Coffee size={18} /> Express Order
          </button>
        </div>
      </header>

      {data.globalAlert && (
        <div className="glass-panel animate-pulse" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--status-critical)', padding: '15px', marginBottom: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell color="var(--status-critical)" />
          <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{data.globalAlert}</span>
        </div>
      )}

      {activeTab === 'MAP' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginTop: 0, color: 'var(--accent-cyan)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Live Venue Density</span>
              {showRoute && <span style={{ fontSize: '0.9rem', color: '#60a5fa' }}>Calculating route...</span>}
            </h2>
            <div style={{ flex: 1, position: 'relative' }}>
               <StadiumMap heatPoints={data.heatPoints} triggerRoute={showRoute} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
               <h3 style={{ marginTop: 0 }}>Restroom Wait Times</h3>
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {data.restrooms.map(r => (
                   <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                     <span>{r.location}</span>
                     <span style={{ 
                       fontWeight: 'bold', 
                       color: getStatusColor(r.waitTime, 15) 
                     }}>
                       {r.waitTime} min
                     </span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
               <h3 style={{ marginTop: 0 }}>Concessions Queue</h3>
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {data.concessions.map(c => (
                   <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                     <span>{c.name}</span>
                     <span style={{ 
                       fontWeight: 'bold', 
                       color: getStatusColor(c.waitTime, 20) 
                     }}>
                       {c.waitTime} min
                     </span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ORDER' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
           <ExpressOrder concessions={data.concessions} />
        </div>
      )}
    </div>
  );
};

export default FanDashboard;
