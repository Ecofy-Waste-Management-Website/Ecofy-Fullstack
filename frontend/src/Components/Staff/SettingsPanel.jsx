const SettingsPanel = ({
  staffName,
  staffInitials,
  settingsForm,
  settingsMessage,
  savingSettings,
  handleSettingsChange,
  handleBankDetailChange,
  saveSettings,
  onClearMessage,
}) => (
  <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
    <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-black text-[#244c21]">Settings</h3>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">Update your name, availability, and bank details</p>
      </div>

      {settingsMessage && (
        <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-bold ${settingsMessage.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {settingsMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#397239]/60">First Name</span>
          <input
            value={settingsForm.firstName}
            onChange={(e) => handleSettingsChange('firstName', e.target.value)}
            className="rounded-2xl border border-[#397234]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#244c21] outline-none focus:border-[#397239]"
            placeholder="First name"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#397239]/60">Last Name</span>
          <input
            value={settingsForm.lastName}
            onChange={(e) => handleSettingsChange('lastName', e.target.value)}
            className="rounded-2xl border border-[#397234]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#244c21] outline-none focus:border-[#397239]"
            placeholder="Last name"
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#397239]/60">Availability Status</span>
          <select
            value={settingsForm.availabilityStatus}
            onChange={(e) => handleSettingsChange('availabilityStatus', e.target.value)}
            className="rounded-2xl border border-[#397234]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#244c21] outline-none focus:border-[#397239]"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#397239]/60">Bank Name</span>
          <input
            value={settingsForm.bankDetails.bankName}
            onChange={(e) => handleBankDetailChange('bankName', e.target.value)}
            className="rounded-2xl border border-[#397234]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#244c21] outline-none focus:border-[#397239]"
            placeholder="Bank name"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#397239]/60">Account Name</span>
          <input
            value={settingsForm.bankDetails.accountName}
            onChange={(e) => handleBankDetailChange('accountName', e.target.value)}
            className="rounded-2xl border border-[#397234]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#244c21] outline-none focus:border-[#397239]"
            placeholder="Account name"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#397239]/60">Account Number</span>
          <input
            value={settingsForm.bankDetails.accountNumber}
            onChange={(e) => handleBankDetailChange('accountNumber', e.target.value)}
            className="rounded-2xl border border-[#397234]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#244c21] outline-none focus:border-[#397239]"
            placeholder="Account number"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#397239]/60">Branch</span>
          <input
            value={settingsForm.bankDetails.branch}
            onChange={(e) => handleBankDetailChange('branch', e.target.value)}
            className="rounded-2xl border border-[#397234]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#244c21] outline-none focus:border-[#397239]"
            placeholder="Branch"
          />
        </label>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClearMessage}
          className="rounded-2xl border border-[#397234]/20 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-[#244c21] transition-all hover:bg-[#112A0F]/5"
        >
          Clear Message
        </button>
        <button
          type="button"
          onClick={saveSettings}
          disabled={savingSettings}
          className="rounded-2xl bg-[#397239] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#244c21] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingSettings ? 'Saving...' : 'Update Settings'}
        </button>
      </div>
    </div>

    <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/20 p-5 shadow-sm">
      <h3 className="text-xl font-black text-[#244c21]">Preview</h3>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">How your profile will appear to the team</p>

      <div className="mt-5 rounded-3xl border border-[#397234]/10 bg-white/70 p-5 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#397239] text-sm font-black text-white shadow-inner">
            {staffInitials}
          </div>
          <div>
            <p className="text-sm font-black text-[#244c21]">{staffName}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#397239]/40">{settingsForm.availabilityStatus}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm text-[#244c21]">
          <div className="rounded-2xl bg-[#D6E9CA]/40 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#397239]/50">Bank</p>
            <p className="mt-1 font-bold">{settingsForm.bankDetails.bankName || 'No bank added'}</p>
          </div>
          <div className="rounded-2xl bg-[#D6E9CA]/40 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#397239]/50">Account</p>
            <p className="mt-1 font-bold">{settingsForm.bankDetails.accountName || 'No account name added'}</p>
            <p className="text-xs text-[#397239]/70">{settingsForm.bankDetails.accountNumber || 'No account number added'}</p>
          </div>
          <div className="rounded-2xl bg-[#D6E9CA]/40 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#397239]/50">Branch</p>
            <p className="mt-1 font-bold">{settingsForm.bankDetails.branch || 'No branch added'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPanel;