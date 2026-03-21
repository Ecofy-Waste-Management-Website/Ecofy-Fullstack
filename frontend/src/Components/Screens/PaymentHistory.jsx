import React from 'react'

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const dummyPayments = [
  { id: 1, amount: 1200, payment_method: 'Card', payment_status: 'paid', payment_date: '2026-03-15', transaction_ref: 'TXN-00481' },
  { id: 2, amount: 3500, payment_method: 'Cash', payment_status: 'paid', payment_date: '2026-03-10', transaction_ref: 'TXN-00462' },
  { id: 3, amount: 800, payment_method: 'Card', payment_status: 'failed', payment_date: '2026-03-05', transaction_ref: 'TXN-00443' },
  { id: 4, amount: 2200, payment_method: 'Card', payment_status: 'paid', payment_date: '2026-02-28', transaction_ref: 'TXN-00421' },
];

const STATUS_STYLES = {
  paid:   { backgroundColor: '#FCFC1D', color: '#00671A' },
  failed: { backgroundColor: '#ff4444', color: '#ffffff' },
};

function PaymentHistory() {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Red Hat Display', sans-serif" }}>

      <h2 style={{ color: '#00671A', fontSize: '28px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
        Payment History
      </h2>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dummyPayments.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#00671A', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            <div>
              <p style={{ color: '#FCFC1D', fontWeight: '700', fontSize: '18px', margin: '0 0 6px' }}>
                LKR {item.amount.toLocaleString()}
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px' }}>
                {item.payment_date} · {item.payment_method}
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: '0' }}>
                Ref: {item.transaction_ref}
              </p>
            </div>

            <span style={{ ...STATUS_STYLES[item.payment_status], padding: '6px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize' }}>
              {item.payment_status}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}

export default PaymentHistory;