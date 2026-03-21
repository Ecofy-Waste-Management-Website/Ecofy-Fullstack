import React from 'react'

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const dummyServices = [
  { id: 1, service_type: 'Household Waste', date: '2026-03-15', status: 'completed', location: 'Colombo 05' },
  { id: 2, service_type: 'Bulk Waste Removal', date: '2026-03-10', status: 'pending', location: 'Nugegoda' },
  { id: 3, service_type: 'Garden Waste', date: '2026-03-05', status: 'cancelled', location: 'Maharagama' },
  { id: 4, service_type: 'Drain Cleaning', date: '2026-02-28', status: 'completed', location: 'Colombo 03' },
];

const STATUS_STYLES = {
  completed: { backgroundColor: '#FCFC1D', color: '#00671A' },
  pending:   { backgroundColor: '#ffffff', color: '#00671A' },
  cancelled: { backgroundColor: '#ff4444', color: '#ffffff' },
};

function ServiceHistory() {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Red Hat Display', sans-serif" }}>
      
      <h2 style={{ color: '#00671A', fontSize: '28px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
        Service History
      </h2>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dummyServices.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#00671A', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <div>
              <p style={{ color: '#FCFC1D', fontWeight: '700', fontSize: '18px', margin: '0 0 6px' }}>
                {item.service_type}
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px' }}>
                {item.date}
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: '0' }}>
                {item.location}
              </p>
            </div>

            <span style={{ ...STATUS_STYLES[item.status], padding: '6px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize' }}>
              {item.status}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ServiceHistory; 