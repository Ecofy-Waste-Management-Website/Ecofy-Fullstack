const PendingTasksPanel = ({
  pendingOrders,
  formatCurrency,
  getEstimatedAmount,
  confirmPickup,
  confirmingOrderId,
  mapSrc,
}) => (
  <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.4fr] gap-4 min-h-[540px]">
    <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-4 shadow-sm flex flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[#244c21]">Pending Orders</h3>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">Orders waiting for pickup confirmation</p>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#397239]">{pendingOrders.length} orders</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#397234]/10 bg-white/70 shadow-inner flex-1">
        <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 border-b border-[#397234]/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/50">
          <span>Order ID</span>
          <span>Pickup Address</span>
          <span>Estimated Amt</span>
          <span>Action</span>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {pendingOrders.length === 0 ? (
            <div className="flex h-[360px] items-center justify-center px-6 text-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#397239]/50">No pending orders available</p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <div key={order._id} className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 border-b border-[#397234]/10 px-4 py-4 last:border-b-0 items-center">
                <div>
                  <p className="text-sm font-black text-[#244c21]">{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/40">{order.service_type || 'Order'}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#244c21]">{order.location || 'Location missing'}</p>
                </div>
                <div>
                  <p className="text-sm font-black text-[#397239]">{formatCurrency(getEstimatedAmount(order))}</p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => confirmPickup(order)}
                    disabled={confirmingOrderId === order._id}
                    className="rounded-xl bg-[#397239] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#244c21] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {confirmingOrderId === order._id ? 'Confirming...' : 'Confirm Pickup'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/20 p-4 shadow-sm flex flex-col min-h-[540px] overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[#244c21]">Balangoda Map</h3>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">Center point for Balangoda, Sri Lanka</p>
        </div>
        <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#397239]">Map</div>
      </div>

      <div className="flex-1 overflow-hidden rounded-3xl border border-[#397234]/10 bg-white shadow-inner">
        <iframe
          title="Balangoda Sri Lanka map"
          src={mapSrc}
          className="h-full w-full min-h-[480px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </div>
);

export default PendingTasksPanel;