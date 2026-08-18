import React, { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          disabled
            ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-gray-300 focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20 bg-white text-gray-900"
        }`}
      />
    </div>
  );
}

export default function ProfileSettings() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
    address: "",
    city: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: "", text: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const handleProfileChange = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus({ type: "", text: "" });
    try {
      await user?.update({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      setSaveStatus({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setSaveStatus({ type: "error", text: err.message || "Failed to save changes." });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setProfile({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
      address: "",
      city: "",
    });
    setSaveStatus({ type: "", text: "" });
  };

  if (!isLoaded) {
    return (
      <div className="py-10 flex justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black text-gray-900">Profile & Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and account security.
        </p>
      </div>

      {/* Personal Details */}
      <Section title="Personal Details" subtitle="Update your name, contact number, and address">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="First Name"
            value={profile.firstName}
            onChange={(v) => handleProfileChange("firstName", v)}
            placeholder="First name"
          />
          <Field
            label="Last Name"
            value={profile.lastName}
            onChange={(v) => handleProfileChange("lastName", v)}
            placeholder="Last name"
          />
          <Field
            label="Email Address"
            value={user?.primaryEmailAddress?.emailAddress || ""}
            disabled
          />
          <Field
            label="Phone Number"
            value={profile.phone}
            onChange={(v) => handleProfileChange("phone", v)}
            placeholder="+94 7X XXX XXXX"
            type="tel"
          />
          <div className="sm:col-span-2">
            <Field
              label="Street Address"
              value={profile.address}
              onChange={(v) => handleProfileChange("address", v)}
              placeholder="123 Main Street"
            />
          </div>
          <Field
            label="City"
            value={profile.city}
            onChange={(v) => handleProfileChange("city", v)}
            placeholder="Balangoda"
          />
        </div>

        {saveStatus.text && (
          <p className={`text-sm font-medium mt-4 ${saveStatus.type === "success" ? "text-[#06a63e]" : "text-red-600"}`}>
            {saveStatus.type === "success" ? "✓" : "✕"} {saveStatus.text}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-[#06a63e] px-6 py-3 text-sm font-bold text-white hover:bg-[#058b33] transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </Section>

      {/* Account & Security */}
      <Section title="Account & Security" subtitle="Manage your password and account access">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-800">Password</p>
              <p className="text-xs text-gray-400 mt-0.5">Change your account password</p>
            </div>
            <button
              type="button"
              onClick={() => openUserProfile()}
              className="rounded-xl border border-[#06a63e]/30 bg-[#06a63e]/5 px-4 py-2 text-sm font-bold text-[#03652a] hover:bg-[#06a63e]/10 transition"
            >
              Change Password
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-800">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security</p>
            </div>
            <button
              type="button"
              onClick={() => openUserProfile()}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              Manage
            </button>
          </div>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone" subtitle="Irreversible and destructive actions">
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-red-700">Delete Account</p>
              <p className="text-xs text-red-500 mt-0.5 max-w-md">
                Permanently deletes your Ecofy account and all associated data. This action cannot be undone.
              </p>
            </div>
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 p-4 rounded-xl bg-white border border-red-200">
              <p className="text-sm text-gray-700 mb-3">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type DELETE"
                className="w-full rounded-xl border border-red-300 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 mb-3"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={deleteInput !== "DELETE"}
                  onClick={async () => {
                    alert("Account deletion triggered.");
                  }}
                  className="rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700 transition disabled:opacity-40"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

