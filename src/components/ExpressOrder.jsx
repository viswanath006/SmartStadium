import React, { useState } from 'react';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { getStatusColor } from '../utils';

const ExpressOrder = ({ concessions = [] }) => {
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState('IDLE'); // IDLE, PLACING, SUCCESS

  const handleAdd = (item) => {
    setCart([...cart, item]);
  };

  const handleCheckout = () => {
    setOrderStatus('PLACING');
    setTimeout(() => {
      setOrderStatus('SUCCESS');
      setCart([]);
    }, 1500);
  };

  if (orderStatus === 'SUCCESS') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <CheckCircle size={64} color="var(--status-good)" />
        <h2 style={{ color: 'var(--status-good)' }}>Order #4092 Confirmed!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You bypassed the main line. Head to the Express Lane at <strong>Sec 104</strong> in 5 minutes.</p>
        <button className="glass-button primary" onClick={() => setOrderStatus('IDLE')}>Order Again</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
      <div>
        <h2 style={{ marginTop: 0, color: 'var(--accent-violet)' }}>Select Concession Stand</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {concessions.map(c => (
            <div key={c.id} className="glass-panel" style={{ padding: '15px', border: `1px solid ${getStatusColor(c.waitTime, 20)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>{c.name}</h4>
                <span style={{ fontSize: '0.8rem', background: getStatusColor(c.waitTime, 20), padding: '2px 8px', borderRadius: '10px', color: '#fff' }}>Wait: {c.waitTime}m</span>
              </div>
              <button 
                className="glass-button" 
                style={{ width: '100%', fontSize: '0.9rem' }}
                onClick={() => handleAdd(c)}
              >
                + Pretzel & Drink ($12)
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0,0,0,0.3)' }}>
        <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag size={20} /> Your Cart
        </h2>
        {cart.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Cart is empty.</p>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', borderBottom: '1px solid var(--glass-border)' }}>
              {cart.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span>{item.name} Combo</span>
                  <span>$12.00</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>
              <span>Total:</span>
              <span>${(cart.length * 12).toFixed(2)}</span>
            </div>
            <button 
              className="glass-button primary" 
              style={{ width: '100%', padding: '15px' }}
              onClick={handleCheckout}
              disabled={orderStatus === 'PLACING'}
            >
              {orderStatus === 'PLACING' ? 'Processing...' : 'Pay & Bypass Line'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpressOrder;
