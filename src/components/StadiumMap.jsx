import React from 'react';
import { getStatusColor } from '../utils';

const StadiumMap = ({ zones = [] }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '300px', height: '400px', border: '2px solid var(--glass-border)', borderRadius: '150px', display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'space-between' }}>
        
        {/* Field / Court */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '200px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--status-good)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <span style={{ opacity: 0.5 }}>COURT</span>
        </div>

        {zones.map(zone => {
          let posStyle = {};
          if (zone.id.includes('north')) posStyle = { alignSelf: 'center', width: '100%', textAlign: 'center' };
          else if (zone.id.includes('south')) posStyle = { alignSelf: 'center', width: '100%', textAlign: 'center', marginTop: 'auto' };
          else if (zone.id.includes('west')) posStyle = { position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' };
          else if (zone.id.includes('east')) posStyle = { position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl' };

          const zoneColor = getStatusColor(zone.density, zone.maxCapacity || 100);

          return (
            <div 
              key={zone.id} 
              style={{ ...posStyle, transition: 'all 0.5s ease' }}
            >
              <div style={{
                background: `radial-gradient(ellipse at center, ${zoneColor}40 0%, transparent 70%)`,
                padding: '15px',
                borderRadius: '50%',
                border: `1px solid ${zoneColor}`,
                boxShadow: `0 0 15px ${zoneColor}60`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: zoneColor,
                fontWeight: 'bold',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap'
              }}>
                {zone.name}<br/>
                <span style={{ fontSize: '1.2rem', color: '#fff' }}>{zone.density}%</span>
              </div>
            </div>
          )
        })}

      </div>
    </div>
  );
};

export default StadiumMap;
