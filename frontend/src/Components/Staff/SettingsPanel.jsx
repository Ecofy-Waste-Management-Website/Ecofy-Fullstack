const SettingsPanel = ({
  staffName,
  staffInitials,
  settingsForm,
  settingsMessage,
  savingSettings,
  mustChangePassword,
  passwordForm,
  changingPassword,
  handleSettingsChange,
  handleBankDetailChange,
  handlePasswordFormChange,
  saveSettings,
  changePassword,
  onClearMessage,
}) => (
  <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
    <div className="rounded-3xl border border-[#06a63e]/15 bg-[#eaf9ee]/60 p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-black text-[#03652a]">Settings</h3>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#06a63e]/50">Update details</p>
      </div>

      {mustChangePassword && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          Your administrator created this account with a temporary password. Change it before using the staff dashboard.
        </div>
      )}

      {settingsMessage && (
        <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-bold ${settingsMessage.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {settingsMessage.text}
        </div>
      )}

      <div className="mb-6 rounded-3xl border border-[#06a63e]/15 bg-white/75 p-4">
        <div className="mb-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-[#03652a]">Password</h4>
          <p className="mt-1 text-xs font-semibold text-[#06a63e]/55">Set a private password for this staff account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">New Password</span>
            <input
              type="password"
              value={passwordForm.password}
              onChange={(e) => handlePasswordFormChange('password', e.target.value)}
              className="rounded-2xl border border-[#06a63e]/15 bg-white/90 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">Confirm Password</span>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
              className="rounded-2xl border border-[#06a63e]/15 bg-white/90 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={changePassword}
            disabled={changingPassword}
            className="rounded-2xl bg-[#06a63e] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#03652a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {changingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">First Name</span>
          <input
            value={settingsForm.firstName}
            onChange={(e) => handleSettingsChange('firstName', e.target.value)}
            className="rounded-2xl border border-[#06a63e]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
            placeholder="First name"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">Last Name</span>
          <input
            value={settingsForm.lastName}
            onChange={(e) => handleSettingsChange('lastName', e.target.value)}
            className="rounded-2xl border border-[#06a63e]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
            placeholder="Last name"
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">Availability Status</span>
          <select
            value={settingsForm.availabilityStatus}
            onChange={(e) => handleSettingsChange('availabilityStatus', e.target.value)}
            className="rounded-2xl border border-[#06a63e]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">Bank Name</span>
          <input
            value={settingsForm.bankDetails.bankName}
            onChange={(e) => handleBankDetailChange('bankName', e.target.value)}
            className="rounded-2xl border border-[#06a63e]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
            placeholder="Bank name"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">Account Name</span>
          <input
            value={settingsForm.bankDetails.accountName}
            onChange={(e) => handleBankDetailChange('accountName', e.target.value)}
            className="rounded-2xl border border-[#06a63e]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
            placeholder="Account name"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">Account Number</span>
          <input
            value={settingsForm.bankDetails.accountNumber}
            onChange={(e) => handleBankDetailChange('accountNumber', e.target.value)}
            className="rounded-2xl border border-[#06a63e]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
            placeholder="Account number"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/60">Branch</span>
          <input
            value={settingsForm.bankDetails.branch}
            onChange={(e) => handleBankDetailChange('branch', e.target.value)}
            className="rounded-2xl border border-[#06a63e]/15 bg-white/80 px-4 py-3 text-sm font-medium text-[#03652a] outline-none focus:border-[#06a63e]"
            placeholder="Branch"
          />
        </label>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClearMessage}
          className="rounded-2xl border border-[#06a63e]/20 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-[#03652a] transition-all hover:bg-[#eaf9ee]"
        >
          Clear Message
        </button>
        <button
          type="button"
          onClick={saveSettings}
          disabled={savingSettings}
          className="rounded-2xl bg-[#06a63e] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#03652a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingSettings ? 'Saving...' : 'Update Settings'}
        </button>
      </div>
    </div>

    <div className="rounded-3xl border border-[#06a63e]/15 bg-[#eaf9ee]/35 p-5 shadow-sm">
      <h3 className="text-xl font-black text-[#03652a]">Preview</h3>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#06a63e]/50"> </p>

      <div className="mt-5 rounded-3xl border border-[#06a63e]/10 bg-white/75 p-5 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#06a63e] text-sm font-black text-white shadow-inner">
            {staffInitials}
          </div>
          <div>
            <p className="text-sm font-black text-[#03652a]">{staffName}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#06a63e]/40">{settingsForm.availabilityStatus}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm text-[#03652a]">
          <div className="rounded-2xl bg-[#eaf9ee]/55 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/50">Bank</p>
            <p className="mt-1 font-bold">{settingsForm.bankDetails.bankName || 'No bank added'}</p>
          </div>
          <div className="rounded-2xl bg-[#eaf9ee]/55 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/50">Account</p>
            <p className="mt-1 font-bold">{settingsForm.bankDetails.accountName || 'No account name added'}</p>
            <p className="text-xs text-[#06a63e]/70">{settingsForm.bankDetails.accountNumber || 'No account number added'}</p>
          </div>
          <div className="rounded-2xl bg-[#eaf9ee]/55 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#06a63e]/50">Branch</p>
            <p className="mt-1 font-bold">{settingsForm.bankDetails.branch || 'No branch added'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPanel;
