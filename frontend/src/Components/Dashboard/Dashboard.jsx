import React from 'react';
import { useUser } from '@clerk/clerk-react';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div style={{ padding: '2rem', minHeight: '60vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Welcome to your Dashboard, {user?.firstName || 'User'}!
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Eco-stats</h3>
          <p>Your waste tracking progress will appear here.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>Recent Activity</h3>
          <p>No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
}
