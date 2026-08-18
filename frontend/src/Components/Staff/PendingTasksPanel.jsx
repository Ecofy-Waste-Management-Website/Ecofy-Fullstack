const PendingTasksPanel = ({
  pendingOrders,
  formatCurrency,
  getEstimatedAmount,
  confirmPickup,
  confirmingOrderId,
  mapSrc,
}) => (
  <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.4fr] gap-6 min-h-[540px]">
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900">Pending Orders</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Orders waiting for pickup confirmation</p>
        </div>
        <span className="rounded-full bg-[#06a63e]/10 px-3 py-1 text-xs font-bold text-[#06a63e]">{pendingOrders.length} orders</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 shadow-inner flex-1">
        <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 border-b border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          <span>Order ID</span>
          <span>Pickup Address</span>
          <span>Estimated Amt</span>
          <span>Action</span>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {pendingOrders.length === 0 ? (
            <div className="flex h-[360px] items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-gray-400">No pending orders available</p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <div key={order._id} className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 border-b border-gray-100 px-4 py-4 last:border-b-0 items-center hover:bg-white transition">
                <div>
                  <p className="text-sm font-bold text-gray-900">{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{order.service_type || 'Order'}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">{order.location || 'Location missing'}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#06a63e]">{formatCurrency(getEstimatedAmount(order))}</p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => confirmPickup(order)}
                    disabled={confirmingOrderId === order._id}
                    className="rounded-xl bg-[#06a63e] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#058b33] disabled:cursor-not-allowed disabled:opacity-60"
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

    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col min-h-[540px] overflow-hidden">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900">Balangoda Map</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Center point for Balangoda, Sri Lanka</p>
        </div>
        <div className="rounded-full bg-[#06a63e]/10 px-3 py-1 text-xs font-bold text-[#06a63e]">Map</div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
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