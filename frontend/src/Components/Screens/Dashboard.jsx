import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { submitInquiry } from "../../services/api/adminService";
import { getUserBookings } from "../../services/api/bookingService";
import RequestPickupModal from "./RequestPickupModal";
import PaymentModal from "./PaymentModal";
import ProfileSettings from "./ProfileSettings";

// Status badge colours
const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "En Route": "bg-cyan-100 text-cyan-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Delayed: "bg-red-100 text-red-700",
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const DEFAULT_MAP_CENTER = { lat: 6.9271, lng: 79.8612 };

function GoogleMapPicker({ value, onSelect }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapMessage, setMapMessage] = useState("");

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setMapMessage("Add VITE_GOOGLE_MAPS_API_KEY to enable interactive Google Maps selection.");
      return;
    }

    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => setMapLoaded(true));
      return () => existingScript.removeEventListener("load", () => setMapLoaded(true));
    }

    const script = document.createElement("script");
    script.id = "google-maps-js";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapMessage("Google Maps failed to load.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapRef.current || !window.google?.maps) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: DEFAULT_MAP_CENTER,
      zoom: 12,
      gestureHandling: "greedy",
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    const marker = new window.google.maps.Marker({
      position: DEFAULT_MAP_CENTER,
      map,
      draggable: true,
    });

    const geocoder = new window.google.maps.Geocoder();

    const resolveAddress = (latLng) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          setMapMessage(`Selected: ${address}`);
          onSelect(address);
        } else {
          const fallback = `${latLng.lat().toFixed(5)}, ${latLng.lng().toFixed(5)}`;
          setMapMessage(`Selected coordinates: ${fallback}`);
          onSelect(fallback);
        }
      });
    };

    map.addListener("click", (event) => {
      if (!event.latLng) return;
      marker.setPosition(event.latLng);
      resolveAddress(event.latLng);
    });

    marker.addListener("dragend", (event) => {
      if (!event.latLng) return;
      resolveAddress(event.latLng);
    });

    mapRef.current = map;
    markerRef.current = marker;
    geocoderRef.current = geocoder;
  }, [mapLoaded, onSelect]);

  useEffect(() => {
    if (!mapRef.current || !geocoderRef.current || !value || !window.google?.maps) return;

    geocoderRef.current.geocode({ address: value }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const location = results[0].geometry?.location;
        if (location) {
          mapRef.current.panTo(location);
          mapRef.current.setZoom(14);
          markerRef.current?.setPosition(location);
        }
      }
    });
  }, [value]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="rounded-3xl border border-dashed border-white/30 bg-white/10 p-4 text-sm text-white/80">
        {mapMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div ref={mapContainerRef} className="flex-1 w-full rounded-3xl border border-white/20 shadow-inner min-h-[150px]" />
      <p className="text-xs text-white/80">Click the map or drag the pin to select a pickup location.</p>
      {mapMessage && <p className="text-xs text-white/90">{mapMessage}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  // ── Pickup modal ──
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("track-status");
  const [locationQuery, setLocationQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState({ type: "", text: "" });
  const [pickupLocation, setPickupLocation] = useState("");
  const [selectedMapLocation, setSelectedMapLocation] = useState("");

  // ── User bookings (for stats + pickup status) ──
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchBookings = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    try {
      setLoadingBookings(true);
      const data = await getUserBookings(email);
      setBookings(data);
    } catch {
      /* silent — stats will stay at 0 */
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Derived stat
  const activeBookings = bookings.filter((b) =>
    ["Pending", "Assigned", "In Progress", "En Route"].includes(b.status)
  );

  // ── Inquiry form ──
  const [inquiry, setInquiry] = useState({ subject: "", message: "" });
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState({ type: "", text: "" });
  const [loggingOut, setLoggingOut] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiry.message.trim()) {
      setInquiryStatus({ type: "error", text: "Please enter your inquiry message." });
      return;
    }

    try {
      setSendingInquiry(true);
      await submitInquiry({
        userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Ecofy User",
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
        subject: inquiry.subject || "General Inquiry",
        message: inquiry.message,
      });
      setInquiry({ subject: "", message: "" });
      setInquiryStatus({ type: "success", text: "Inquiry sent. Admin will respond soon." });
    } catch (error) {
      setInquiryStatus({ type: "error", text: error.message || "Failed to send inquiry." });
    } finally {
      setSendingInquiry(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(() => navigate("/"));
    } finally {
      setLoggingOut(false);
    }
  };

  const greetingName = user?.firstName || user?.username || "there";

  const openProfile = () => setActiveTab("profile");

  const handleLocationSearch = () => {
    const value = locationQuery.trim();
    if (!value) {
      setSearchStatus({ type: "error", text: "Please enter a location to search." });
      return;
    }

    setPickupLocation(value);
    setSelectedMapLocation(value);
    setSearchStatus({ type: "success", text: `Showing ${value} on the map.` });
  };

  const HelpCard = ({ title, description, actionLabel, onAction }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-xl bg-[#06a63e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#058b33]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );

  const InquiryPanel = () => (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">Need help? Send an inquiry</h2>
      <p className="mt-1 text-sm text-gray-500">Your inquiry will be visible in the Admin Inquiry section.</p>

      <form onSubmit={handleInquirySubmit} className="mt-5 space-y-3">
        <input
          type="text"
          value={inquiry.subject}
          onChange={(e) => setInquiry((prev) => ({ ...prev, subject: e.target.value }))}
          placeholder="Subject (optional)"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#06a63e]"
        />
        <textarea
          value={inquiry.message}
          onChange={(e) => setInquiry((prev) => ({ ...prev, message: e.target.value }))}
          placeholder="Write your inquiry..."
          className="w-full min-h-40 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#06a63e]"
        />

        {inquiryStatus.text && (
          <p className={`text-sm ${inquiryStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {inquiryStatus.text}
          </p>
        )}

        <button
          type="submit"
          className="rounded-xl bg-[#06a63e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#058b33] disabled:opacity-60"
          disabled={sendingInquiry}
        >
          {sendingInquiry ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );

  const TrackStatusPanel = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Track Status</h2>
            <p className="mt-1 text-sm text-gray-500">See your active pickup progress and latest status updates.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className="self-start rounded-full border border-[#06a63e]/30 bg-[#06a63e]/5 px-4 py-2 text-sm font-semibold text-[#03652a] transition hover:bg-[#06a63e]/10"
          >
            Schedule new pickup
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {loadingBookings ? (
            <p className="text-sm text-gray-400">Loading pickups…</p>
          ) : activeBookings.length === 0 ? (
            <p className="text-sm text-gray-400">No recent pickups to display.</p>
          ) : (
            activeBookings.slice(0, 5).map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {b.service_type} — {b.waste_category}
                  </p>
                  <p className="text-xs text-gray-400">
                    {b.location} · {new Date(b.scheduled_date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {b.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Driver Location</h2>
        <div className="flex h-40 items-center justify-center rounded-2xl bg-gray-50">
          <p className="text-sm text-gray-400">No active driver assigned to your booking.</p>
        </div>
      </div>
    </div>
  );

  const SpecialServicesPanel = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Special Services</h2>
            <p className="mt-1 text-sm text-gray-500">Extra support and service shortcuts for your account.</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("inquiry")}
            className="self-start rounded-full border border-[#06a63e]/30 bg-[#06a63e]/5 px-4 py-2 text-sm font-semibold text-[#03652a] transition hover:bg-[#06a63e]/10"
          >
            Send inquiry
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <HelpCard
            title="Pickup support"
            description="Need to reschedule, track, or understand a pickup booking? Start here."
            actionLabel="Book a pickup"
            onAction={() => setShowPickupModal(true)}
          />
          <HelpCard
            title="Account help"
            description="Update your name, phone number, and other profile details from one place."
            actionLabel="Manage profile"
            onAction={openProfile}
          />
          <HelpCard
            title="Billing questions"
            description="Review your service history or ask about a recent transaction."
            actionLabel="Order history"
            onAction={() => navigate("/service-history")}
          />
          <HelpCard
            title="Live assistance"
            description="If you still need help, send a message and the Ecofy team will respond."
            actionLabel="Send inquiry"
            onAction={() => setActiveTab("inquiry")}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => setShowPickupModal(true)}
          className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#06a63e]/40 hover:bg-[#06a63e]/5"
        >
          <p className="text-sm font-semibold text-gray-800">Start a pickup request</p>
          <p className="mt-1 text-sm text-gray-500">Open the booking flow immediately.</p>
        </button>
        <button
          type="button"
          onClick={() => navigate("/payment-history")}
          className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#06a63e]/40 hover:bg-[#06a63e]/5"
        >
          <p className="text-sm font-semibold text-gray-800">View payments</p>
          <p className="mt-1 text-sm text-gray-500">Review recent billing activity.</p>
        </button>
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-[#06a63e]/40 hover:bg-[#06a63e]/5"
        >
          <p className="text-sm font-semibold text-gray-800">Notifications</p>
          <p className="mt-1 text-sm text-gray-500">Check recent alerts and updates.</p>
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Navbar-style Action Card */}
      <div className="mx-auto mb-10 w-full rounded-[40px] bg-green-100/80 backdrop-blur-md border border-green-300/50 p-1.5 shadow-sm transition-all duration-500">
        <div className="flex flex-col items-center justify-between gap-6 px-8 py-6 lg:flex-row lg:gap-4">
          <div className="text-center lg:text-left">
            <h2 className="text-xl font-bold tracking-tight text-green-900 sm:text-2xl">What would you like to do today?</h2>
            <p className="mt-1 text-sm text-green-700/80">
              Quick actions to manage your pickups and history.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setShowPickupModal(true)}
              className="px-5 py-2 rounded-full font-medium text-gray-700 transition-all duration-300 hover:bg-green-600 hover:text-white"
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("track-status")}
              className="px-5 py-2 rounded-full font-medium text-gray-700 transition-all duration-300 hover:bg-green-600 hover:text-white"
            >
              Track status
            </button>
            <button
              type="button"
              onClick={() => navigate("/service-history")}
              className="px-5 py-2 rounded-full font-medium text-gray-700 transition-all duration-300 hover:bg-green-600 hover:text-white"
            >
              History
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("special-services")}
              className="px-5 py-2 rounded-full font-medium text-gray-700 transition-all duration-300 hover:bg-green-600 hover:text-white"
            >
              Services
            </button>
          </div>
        </div>
      </div>

      {/* Search & Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Left: Search Card */}
        <div className="flex flex-col rounded-3xl bg-[#218845] p-6 text-white shadow-lg h-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Start a Pickup Request</h2>
            <p className="mt-2 text-sm text-white/80">Enter your address or street name to find your service zone instantly.</p>
          </div>

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-sm border border-white/10">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              Search pickup location
            </label>
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Enter a location, street, or area"
                className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-white/50"
              />
              <button
                type="button"
                onClick={handleLocationSearch}
                className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black active:scale-95 shadow-md"
              >
                Search Location
              </button>
            </div>
            {searchStatus.text && (
              <p className={`mt-3 text-sm font-medium ${searchStatus.type === "success" ? "text-emerald-100" : "text-red-100"}`}>
                {searchStatus.text}
              </p>
            )}
          </div>
        </div>

        {/* Right: Map Picker Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Map Location Picker</h3>
              <p className="text-xs text-gray-500">Manually select your spot for precise pickup.</p>
            </div>
            {pickupLocation && (
              <span className="rounded-full bg-[#06a63e]/10 px-3 py-1 text-[10px] font-bold text-[#06a63e] uppercase tracking-wider">
                Pinned
              </span>
            )}
          </div>

          <div className="flex-1">
            <GoogleMapPicker
              value={selectedMapLocation}
              onSelect={(address) => {
                setLocationQuery(address);
                setPickupLocation(address);
                setSelectedMapLocation(address);
                setSearchStatus({ type: "success", text: `Selected location from map.` });
              }}
            />
          </div>

          {pickupLocation && (
            <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">SELECTED ADDRESS</p>
              <p className="text-xs text-gray-700 truncate font-medium">{pickupLocation}</p>
            </div>
          )}
        </div>
      </div>

      <main className="min-w-0">
        {activeTab === "track-status" && <TrackStatusPanel />}
        {activeTab === "special-services" && <SpecialServicesPanel />}
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "inquiry" && <InquiryPanel />}
      </main>

      {/* ── Request Pickup Modal ── */}
      <RequestPickupModal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        initialLocation={pickupLocation}
        onSuccess={(bookingDetails) => {
          setLastBooking(bookingDetails);
          setShowPickupModal(false);
          setShowPaymentModal(true);
        }}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          fetchBookings(); // refreshes the bookings list after payment
        }}
        bookingDetails={lastBooking}
      />
    </div>
  );
}