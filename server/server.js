const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-Memory Database State
let stadiumState = {
  status: 'NORMAL',
  globalAlert: null,
  zones: [
    { id: 'north-gate', name: 'North Gate', density: 30, maxCapacity: 100 },
    { id: 'south-gate', name: 'South Gate', density: 80, maxCapacity: 100 },
    { id: 'east-concourse', name: 'East Concourse', density: 40, maxCapacity: 100 },
    { id: 'west-concourse', name: 'West Concourse', density: 95, maxCapacity: 100 },
  ],
  concessions: [
    { id: 'c1', name: 'Burgers & Co (Sec 102)', waitTime: 5, status: 'open' },
    { id: 'c2', name: 'Beer Stand (Sec 104)', waitTime: 12, status: 'open' },
    { id: 'c3', name: 'Pretzel Cart (Sec 110)', waitTime: 25, status: 'open' },
    { id: 'c4', name: 'Pizza Express (Sec 205)', waitTime: 2, status: 'open' },
  ],
  restrooms: [
    { id: 'r1', location: 'Sec 101 Men', waitTime: 2 },
    { id: 'r2', location: 'Sec 101 Women', waitTime: 5 },
    { id: 'r3', location: 'Sec 108 Men', waitTime: 15 },
    { id: 'r4', location: 'Sec 108 Women', waitTime: 20 },
  ]
};

// Simulation Layer
setInterval(() => {
  stadiumState.zones.forEach(z => {
    const change = Math.floor(Math.random() * 11) - 5;
    z.density = Math.max(0, Math.min(100, z.density + change));
  });

  stadiumState.concessions.forEach(c => {
    const change = Math.floor(Math.random() * 3) - 1;
    c.waitTime = Math.max(0, c.waitTime + change);
  });

  stadiumState.restrooms.forEach(r => {
    const change = Math.floor(Math.random() * 3) - 1;
    r.waitTime = Math.max(0, r.waitTime + change);
  });
}, 3000);

// Endpoints
app.get('/api/state', (req, res) => {
  res.json(stadiumState);
});

app.post('/api/admin/trigger-halftime', (req, res) => {
  stadiumState.status = 'HALFTIME';
  stadiumState.globalAlert = 'Halftime Approaching. High volumes expected at concessions.';
  
  stadiumState.zones.forEach(z => z.density = Math.min(100, z.density + 40));
  stadiumState.concessions.forEach(c => c.waitTime += 15);
  stadiumState.restrooms.forEach(r => r.waitTime += 10);
  
  res.json({ success: true, state: stadiumState });
});

app.post('/api/admin/clear-alerts', (req, res) => {
  stadiumState.status = 'NORMAL';
  stadiumState.globalAlert = null;
  
  stadiumState.zones.forEach(z => z.density = Math.max(10, z.density - 40));
  stadiumState.concessions.forEach(c => c.waitTime = Math.max(2, c.waitTime - 15));
  stadiumState.restrooms.forEach(r => r.waitTime = Math.max(1, r.waitTime - 10));

  res.json({ success: true, state: stadiumState });
});

app.post('/api/admin/custom-alert', (req, res) => {
  const { message } = req.body;
  stadiumState.status = 'ALERT';
  stadiumState.globalAlert = message || 'Emergency Alert';
  res.json({ success: true, state: stadiumState });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server API listening on port ${PORT}`);
});
