const ActiveTasksPanel = ({ tasks, renderTaskCard }) => (
  tasks.length === 0 ? (
    <div className="col-span-full rounded-3xl border border-dashed border-[#397239]/20 bg-[#D6E9CA]/20 p-12 text-center flex flex-col items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-[#397234]/5 flex items-center justify-center text-[#397239] border border-[#397234]/10">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2a1 1 0 01-1 1m-4-4h4m4 0h2a1 1 0 011 1v3a1 1 0 01-1 1h-1m-5-10l4.293 4.293A1 1 0 0119 11.707V14" />
        </svg>
      </div>
      <p className="text-[#397239]/60 font-black uppercase tracking-widest text-[10px]">No active tasks in progress.</p>
    </div>
  ) : (
    tasks.map((task) => renderTaskCard(task))
  )
);

export default ActiveTasksPanel;