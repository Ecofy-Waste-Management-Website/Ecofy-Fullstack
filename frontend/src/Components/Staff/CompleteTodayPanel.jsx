const CompleteTodayPanel = ({ tasks, renderTaskCard }) => (
  tasks.length === 0 ? (
    <div className="col-span-full rounded-3xl border border-dashed border-[#06a63e]/20 bg-[#eaf9ee]/30 p-12 text-center flex flex-col items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-[#06a63e]/5 flex items-center justify-center text-[#06a63e] border border-[#06a63e]/10">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-[#06a63e]/60 font-black uppercase tracking-widest text-[10px]">No tasks completed yet today.</p>
    </div>
  ) : (
    tasks.map((task) => renderTaskCard(task, true))
  )
);

export default CompleteTodayPanel;