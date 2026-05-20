import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
          disabled
            ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
            : "border-gray-300 focus:border-indigo-500 bg-white text-gray-800"
        }`}
      />
    </div>
  );
}

export default function ProfileSettings() {
  const { user, isLoaded } = useUser();

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
      // TODO: persist phone, address, city to your own backend
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
      <div className="max-w-3xl mx-auto px-4 py-10 flex justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile & Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">
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
            placeholder="Colombo"
          />
        </div>

        {saveStatus.text && (
          <p className={`text-sm mt-4 ${saveStatus.type === "success" ? "text-[#66c45e]" : "text-red-500"}`}>
            {saveStatus.type === "success" ? "✓" : "✕"} {saveStatus.text}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </Section>

      {/* Account & Security */}
      <Section title="Account & Security" subtitle="Manage your password and account access">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Password</p>
              <p className="text-xs text-gray-400 mt-0.5">Change your account password</p>
            </div>
            <button
              onClick={() => window.open("https://accounts.ecofy.app/user", "_blank")}
              className="rounded-lg border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition"
            >
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security</p>
            </div>
            <button
              onClick={() => window.open("https://accounts.ecofy.app/user", "_blank")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              Manage
            </button>
          </div>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone" subtitle="Irreversible and destructive actions">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-700">Delete Account</p>
              <p className="text-xs text-red-500 mt-0.5">
                Permanently deletes your Ecofy account and all associated data. This cannot be undone.
              </p>
            </div>
            {!showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 p-4 rounded-lg bg-white border border-red-200">
              <p className="text-sm text-gray-700 mb-3">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type DELETE"
                className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm outline-none focus:border-red-500 mb-3"
              />
              <div className="flex gap-2">
                <button
                  disabled={deleteInput !== "DELETE"}
                  onClick={async () => {
                    // TODO: call your backend delete API, then:
                    // await user?.delete();
                    alert("Account deletion triggered.");
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-40"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
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
