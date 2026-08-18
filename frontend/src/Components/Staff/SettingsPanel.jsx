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
  <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-900">Settings</h3>
        <p className="text-sm text-gray-500 mt-0.5">Manage your staff profile, password, and payout preferences.</p>
      </div>

      {mustChangePassword && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          ⚠️ Your administrator created this account with a temporary password. Please change it before continuing.
        </div>
      )}

      {settingsMessage && (
        <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-bold ${settingsMessage.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {settingsMessage.text}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-800">Password</h4>
          <p className="mt-0.5 text-xs text-gray-500">Set a private password for this staff account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">New Password</span>
            <input
              type="password"
              value={passwordForm.password}
              onChange={(e) => handlePasswordFormChange('password', e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Confirm Password</span>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
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
            className="rounded-xl bg-[#06a63e] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#058b33] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {changingPassword ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">First Name</span>
          <input
            value={settingsForm.firstName}
            onChange={(e) => handleSettingsChange('firstName', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
            placeholder="First name"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Last Name</span>
          <input
            value={settingsForm.lastName}
            onChange={(e) => handleSettingsChange('lastName', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
            placeholder="Last name"
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Availability Status</span>
          <select
            value={settingsForm.availabilityStatus}
            onChange={(e) => handleSettingsChange('availabilityStatus', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </label>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Bank Name</span>
          <input
            value={settingsForm.bankDetails.bankName}
            onChange={(e) => handleBankDetailChange('bankName', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
            placeholder="Bank name"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Name</span>
          <input
            value={settingsForm.bankDetails.accountName}
            onChange={(e) => handleBankDetailChange('accountName', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
            placeholder="Account name"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Number</span>
          <input
            value={settingsForm.bankDetails.accountNumber}
            onChange={(e) => handleBankDetailChange('accountNumber', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
            placeholder="Account number"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Branch</span>
          <input
            value={settingsForm.bankDetails.branch}
            onChange={(e) => handleBankDetailChange('branch', e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
            placeholder="Branch"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onClearMessage}
          className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
        >
          Clear Message
        </button>
        <button
          type="button"
          onClick={saveSettings}
          disabled={savingSettings}
          className="rounded-xl bg-[#06a63e] px-6 py-3 text-sm font-bold text-white hover:bg-[#058b33] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingSettings ? 'Saving...' : 'Update Settings'}
        </button>
      </div>
    </div>

    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-black text-gray-900">Profile Preview</h3>
      <p className="mt-1 text-sm text-gray-500">Live preview of your staff details.</p>

      <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#06a63e] text-sm font-black text-white shadow-sm">
            {staffInitials}
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">{staffName}</p>
            <span className="inline-block rounded-full bg-[#06a63e]/10 px-2.5 py-0.5 text-xs font-bold text-[#06a63e]">
              {settingsForm.availabilityStatus}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <div className="rounded-xl bg-white p-3.5 border border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bank</p>
            <p className="mt-1 font-semibold text-gray-800">{settingsForm.bankDetails.bankName || 'No bank added'}</p>
          </div>
          <div className="rounded-xl bg-white p-3.5 border border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account</p>
            <p className="mt-1 font-semibold text-gray-800">{settingsForm.bankDetails.accountName || 'No account name added'}</p>
            <p className="text-xs text-gray-400 mt-0.5">{settingsForm.bankDetails.accountNumber || 'No account number added'}</p>
          </div>
          <div className="rounded-xl bg-white p-3.5 border border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Branch</p>
            <p className="mt-1 font-semibold text-gray-800">{settingsForm.bankDetails.branch || 'No branch added'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPanel;
