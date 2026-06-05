import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { submitInquiry } from "../../services/api/adminService";
import { getUserBookings, getUserPayments } from "../../services/api/bookingService";
import RequestPickupModal from "./RequestPickupModal";
import PaymentModal from "./PaymentModal";
import ProfileSettings from "./ProfileSettings";
import NotificationBell from "../Main/Top-Header-Section/NotificationBell/NotificationBell";

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "En Route": "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
  Delayed: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const DEFAULT_MAP_CENTER = { lat: 6.9271, lng: 79.8612 };

const Icon = ({ name, className = "h-5 w-5" }) => {
  const icons = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
    truck: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />,
    mapPin: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
    creditCard: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />,
    menu: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    leaf: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5V11m0 0a5 5 0 0 1 5-5h2.5c0 4.5-2 6.5-4 8l-3.5 3m0-11a5 5 0 0 0-5-5H7c0 4.5 2 6.5 4 8l3.5 3" />,
    recycle: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      {icons[name]}
    </svg>
  );
};

const NAV_ITEMS = [
  { id: "home",             icon: "home",       label: "Home" },
  { id: "schedule",         icon: "truck",      label: "Schedule Pickup" },
  { id: "track-status",     icon: "mapPin",     label: "Track Status" },
  { id: "history",          icon: "clock",      label: "History" },
  { id: "payments",         icon: "creditCard", label: "Payments" },
  { id: "inquiry",          icon: "chat",       label: "Inquiry" },
  { id: "profile",          icon: "user",       label: "Profile" },
  { id: "special-services", icon: "sparkles",   label: "Services" },
];

function GoogleMapPicker({ value, onSelect }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapMessage, setMapMessage] = useState("");

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) { setMapMessage("Add VITE_GOOGLE_MAPS_API_KEY to enable map selection."); return; }
    if (window.google?.maps) { setMapLoaded(true); return; }
    const existingScript = document.getElementById("google-maps-js");
    if (existingScript) { existingScript.addEventListener("load", () => setMapLoaded(true)); return; }
    const script = document.createElement("script");
    script.id = "google-maps-js";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true; script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapMessage("Google Maps failed to load.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapRef.current || !window.google?.maps) return;
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: DEFAULT_MAP_CENTER, zoom: 12, gestureHandling: "greedy",
      streetViewControl: false, mapTypeControl: false, fullscreenControl: false,
    });
    const marker = new window.google.maps.Marker({ position: DEFAULT_MAP_CENTER, map, draggable: true });
    const geocoder = new window.google.maps.Geocoder();
    const resolveAddress = (latLng) => {
      const coordinates = { latitude: latLng.lat(), longitude: latLng.lng() };
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results?.[0]) { const address = results[0].formatted_address; setMapMessage(address); onSelect({ address, coordinates }); }
        else { const fallback = `${latLng.lat().toFixed(5)}, ${latLng.lng().toFixed(5)}`; setMapMessage(fallback); onSelect({ address: fallback, coordinates }); }
      });
    };
    map.addListener("click", (e) => { if (!e.latLng) return; marker.setPosition(e.latLng); resolveAddress(e.latLng); });
    marker.addListener("dragend", (e) => { if (!e.latLng) return; resolveAddress(e.latLng); });
    mapRef.current = map; markerRef.current = marker; geocoderRef.current = geocoder;
  }, [mapLoaded, onSelect]);

  useEffect(() => {
    if (!mapRef.current || !geocoderRef.current || !value || !window.google?.maps) return;
    geocoderRef.current.geocode({ address: value }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const loc = results[0].geometry?.location;
        if (loc) { mapRef.current.panTo(loc); mapRef.current.setZoom(14); markerRef.current?.setPosition(loc); onSelect({ address: value, coordinates: { latitude: loc.lat(), longitude: loc.lng() } }); }
      }
    });
  }, [value]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-400">
        Add VITE_GOOGLE_MAPS_API_KEY to enable map selection.
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col gap-2">
      <div ref={mapContainerRef} className="flex-1 w-full rounded-2xl border border-gray-200 min-h-[200px]" />
      <p className="text-xs text-gray-400">Click the map or drag the pin to select a location.</p>
      {mapMessage && <p className="text-xs font-medium text-[#06a63e]">{mapMessage}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [locationQuery, setLocationQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState({ type: "", text: "" });
  const [pickupLocation, setPickupLocation] = useState("");
  const [selectedMapLocation, setSelectedMapLocation] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [payments, setPayments] = useState([]);

  const fetchBookings = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    try { setLoadingBookings(true); const data = await getUserBookings(email); setBookings(data); }
    catch { } finally { setLoadingBookings(false); }
  }, [user]);

  const fetchPayments = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    try { const data = await getUserPayments(email); setPayments(data); } catch { }
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const activeBookings = bookings.filter((b) => ["Pending", "Assigned", "In Progress", "En Route"].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === "Completed");
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  const greetingName = user?.firstName || user?.username || "there";
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const closeBookingModal = () => setSelectedBooking(null);
  const navigate2Tab = (id) => { setActiveTab(id); setSidebarOpen(false); };

  const handleCancelBooking = async () => {
    if (!selectedBooking || cancellingBookingId === selectedBooking._id) return;
    const confirmed = window.confirm("Cancel this order?");
    if (!confirmed) return;
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    try {
      setCancellingBookingId(selectedBooking._id);
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/bookings/${selectedBooking._id}/cancel`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_email: email, clerkId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel");
      setBookings((prev) => prev.map((b) => b._id === selectedBooking._id
        ? { ...b, status: "Cancelled", assignedStaff: null, timeline: [...(b.timeline || []), { event: "Pickup cancelled by customer", time: new Date().toISOString() }] } : b));
      setSelectedBooking((cur) => cur?._id === selectedBooking._id ? { ...cur, status: "Cancelled" } : cur);
      await fetchBookings();
    } catch (err) { alert(err.message || "Failed to cancel."); }
    finally { setCancellingBookingId(null); }
  };

  const handleLocationSearch = () => {
    const v = locationQuery.trim();
    if (!v) { setSearchStatus({ type: "error", text: "Please enter a location." }); return; }
    setPickupLocation(v); setSelectedMapLocation(v); setPickupCoordinates(null);
    setSearchStatus({ type: "success", text: `Showing "${v}" on the map.` });
  };

  const HelpCard = ({ title, description, actionLabel, onAction }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {actionLabel && (
        <button type="button" onClick={onAction} className="self-start rounded-xl bg-[#06a63e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#058b33] transition">
          {actionLabel}
        </button>
      )}
    </div>
  );

  // ── Modals ────────────────────────────────────────────────────────────────
  const BookingDetailsModal = () => {
    if (!selectedBooking) return null;
    const timeline = Array.isArray(selectedBooking.timeline) ? selectedBooking.timeline : [];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#06a63e]">Pickup Order</p>
              <h3 className="mt-1 text-xl font-black text-gray-900">{selectedBooking.service_type} — {selectedBooking.waste_category}</h3>
            </div>
            <button type="button" onClick={closeBookingModal} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Location", value: selectedBooking.location || "Unavailable" },
              { label: "Scheduled Date", value: selectedBooking.scheduled_date ? new Date(selectedBooking.scheduled_date).toLocaleDateString() : "N/A" },
              { label: "Status", value: selectedBooking.status || "Pending" },
              { label: "Assigned Staff", value: selectedBooking.assignedStaff || "Not yet assigned" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                <p className="mt-1.5 text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pickup PIN</p>
              <p className="mt-1.5 text-2xl font-black tracking-widest text-[#06a63e]">{selectedBooking.pickupPin || "N/A"}</p>
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-[#06a63e]/15 bg-[#06a63e]/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#03652a]">Notes</p>
            <p className="mt-1.5 text-sm text-gray-700">{selectedBooking.notes || "No notes."}</p>
          </div>
          <div className="mt-3 rounded-2xl bg-gray-50 border border-gray-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Timeline ({timeline.length})</p>
            <div className="max-h-44 space-y-2 overflow-y-auto">
              {timeline.length === 0 ? <p className="text-sm text-gray-400">No updates yet.</p>
                : timeline.map((e, i) => (
                  <div key={i} className="flex gap-3 rounded-xl bg-white p-3 border border-gray-100">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#06a63e]" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{e.event || "Update"}</p>
                      <p className="text-xs text-gray-400">{e.time ? new Date(e.time).toLocaleString() : "—"}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            {selectedBooking?.status !== "Completed" && selectedBooking?.status !== "Cancelled" && (
              <button type="button" onClick={handleCancelBooking} disabled={cancellingBookingId === selectedBooking._id}
                className="rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60">
                {cancellingBookingId === selectedBooking._id ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            <button type="button" onClick={closeBookingModal} className="rounded-full bg-[#06a63e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#058b33]">Done</button>
          </div>
        </div>
      </div>
    );
  };

  const HistoryChooserModal = () => {
    if (!showHistoryModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#06a63e]/10 mb-4">
            <Icon name="clock" className="h-6 w-6 text-[#06a63e]" />
          </div>
          <h2 className="text-lg font-black text-gray-900">View History</h2>
          <p className="mt-1 text-sm text-gray-500">Which history would you like to see?</p>
          <div className="mt-5 flex flex-col gap-3">
            <button type="button" onClick={() => { setShowHistoryModal(false); navigate("/service-history"); }}
              className="w-full rounded-2xl bg-[#06a63e] px-5 py-3 text-sm font-bold text-white hover:bg-[#058b33] transition active:scale-95">
              Order History
            </button>
            <button type="button" onClick={() => { setShowHistoryModal(false); navigate("/payment-history"); }}
              className="w-full rounded-2xl border border-[#06a63e] px-5 py-3 text-sm font-bold text-[#06a63e] hover:bg-[#06a63e]/5 transition active:scale-95">
              Payment History
            </button>
          </div>
          <button type="button" onClick={() => setShowHistoryModal(false)} className="mt-4 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
        </div>
      </div>
    );
  };

  // ── Panels ────────────────────────────────────────────────────────────────
  const HomePanel = () => (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06a63e] to-[#047a2e] p-7 text-white shadow-md">
        <svg className="absolute -right-4 -top-4 h-40 w-40 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5V11m0 0a5 5 0 0 1 5-5h2.5c0 4.5-2 6.5-4 8l-3.5 3m0-11a5 5 0 0 0-5-5H7c0 4.5 2 6.5 4 8l3.5 3" />
        </svg>
        <p className="text-sm text-white/70 font-medium">{getGreeting()},</p>
        <h1 className="mt-0.5 text-3xl font-black tracking-tight">{greetingName}</h1>
        <p className="mt-2 text-sm text-white/75 max-w-sm">Manage your waste pickups, track orders, and get instant support.</p>
        <button type="button" onClick={() => setShowPickupModal(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-[#06a63e] shadow hover:bg-green-50 active:scale-95 transition">
          <Icon name="truck" className="h-4 w-4" /> Schedule a Pickup
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: "truck",      label: "Active Pickups", value: loadingBookings ? "—" : activeBookings.length,    border: "border-amber-200",  bg: "bg-amber-50",  color: "text-amber-600" },
          { icon: "mapPin",     label: "Completed",      value: loadingBookings ? "—" : completedBookings.length, border: "border-green-200",  bg: "bg-green-50",  color: "text-green-600" },
          { icon: "creditCard", label: "Total Paid",     value: `LKR ${totalPaid.toLocaleString()}`,              border: "border-blue-200",   bg: "bg-blue-50",   color: "text-blue-600" },
          { icon: "clock",      label: "All Bookings",   value: loadingBookings ? "—" : bookings.length,          border: "border-purple-200", bg: "bg-purple-50", color: "text-purple-600" },
        ].map(({ icon, label, value, border, bg, color }) => (
          <div key={label} className={`rounded-3xl border bg-white p-5 shadow-sm ${border}`}>
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}>
              <Icon name={icon} className={`h-5 w-5 ${color}`} />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-800">Active Pickups</h2>
            <p className="text-xs text-gray-400 mt-0.5">Your in-progress and pending bookings.</p>
          </div>
          <button type="button" onClick={() => navigate2Tab("track-status")}
            className="flex items-center gap-1.5 text-xs font-bold text-[#06a63e] hover:underline">
            View all <Icon name="mapPin" className="h-3.5 w-3.5" />
          </button>
        </div>
        {loadingBookings ? (
          <div className="flex items-center gap-3 py-6">
            <div className="h-4 w-4 rounded-full border-2 border-[#06a63e] border-t-transparent animate-spin" />
            <p className="text-sm text-gray-400">Loading…</p>
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <Icon name="leaf" className="h-7 w-7 text-[#06a63e]" />
            </div>
            <p className="text-sm font-medium text-gray-500">No active pickups right now.</p>
            <button type="button" onClick={() => setShowPickupModal(true)}
              className="rounded-xl bg-[#06a63e] px-4 py-2 text-xs font-bold text-white hover:bg-[#058b33] transition">
              Schedule your first pickup
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {activeBookings.slice(0, 4).map((b) => (
              <button key={b._id} type="button" onClick={() => setSelectedBooking(b)}
                className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-left hover:border-[#06a63e]/30 hover:bg-[#06a63e]/5 transition">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-700 truncate">{b.service_type} — {b.waste_category}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{b.location} · {new Date(b.scheduled_date).toLocaleDateString()}</p>
                </div>
                <span className={`ml-3 shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}>{b.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const SchedulePanel = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Schedule a Pickup</h2>
        <p className="mt-1 text-sm text-gray-500">Search your location or pin it on the map, then open the booking form.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-3xl bg-[#218845] p-6 text-white shadow-md">
          <h3 className="text-lg font-black">Find Your Location</h3>
          <p className="mt-1 text-sm text-white/75">Enter your address or street name.</p>
          <div className="mt-5 rounded-2xl bg-white/15 p-5 border border-white/10 flex-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-white/80 mb-3">Search pickup location</label>
            <input type="text" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
              placeholder="Enter a location, street, or area"
              className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/40 mb-3" />
            <button type="button" onClick={handleLocationSearch}
              className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-black active:scale-95 transition">
              Search Location
            </button>
            {searchStatus.text && (
              <p className={`mt-3 text-sm ${searchStatus.type === "success" ? "text-green-200" : "text-red-200"}`}>{searchStatus.text}</p>
            )}
          </div>
          <button type="button" onClick={() => setShowPickupModal(true)}
            className="mt-4 w-full rounded-2xl border border-white/25 bg-white/10 py-3 text-sm font-bold text-white hover:bg-white/20 transition active:scale-95">
            Open Full Booking Form →
          </button>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-800">Map Location Picker</h3>
              <p className="text-xs text-gray-400 mt-0.5">Click to pin your exact pickup spot.</p>
            </div>
            {pickupLocation && <span className="rounded-full bg-[#06a63e]/10 px-3 py-1 text-[10px] font-bold text-[#06a63e] uppercase tracking-wider">Pinned</span>}
          </div>
          <div className="flex-1 min-h-[220px]">
            <GoogleMapPicker value={selectedMapLocation}
              onSelect={({ address, coordinates }) => {
                setLocationQuery(address); setPickupLocation(address);
                setSelectedMapLocation(address); setPickupCoordinates(coordinates);
                setSearchStatus({ type: "success", text: "Location selected from map." });
              }} />
          </div>
          {pickupLocation && (
            <div className="mt-4 p-3 rounded-xl bg-[#06a63e]/5 border border-[#06a63e]/15">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Address</p>
              <p className="text-xs text-gray-700 truncate font-medium">{pickupLocation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TrackStatusPanel = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Track Status</h2>
        <p className="mt-1 text-sm text-gray-500">Monitor the real-time status of your pickup requests.</p>
      </div>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-gray-700">{activeBookings.length} active booking{activeBookings.length !== 1 ? "s" : ""}</p>
          <button type="button" onClick={() => setShowPickupModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-[#06a63e]/30 bg-[#06a63e]/5 px-4 py-2 text-sm font-bold text-[#03652a] hover:bg-[#06a63e]/10 transition">
            <Icon name="truck" className="h-4 w-4" /> New Pickup
          </button>
        </div>
        {loadingBookings ? <p className="text-sm text-gray-400">Loading…</p>
          : activeBookings.length === 0 ? <p className="text-sm text-gray-400 py-4 text-center">No active pickups to display.</p>
          : activeBookings.map((b) => (
            <button key={b._id} type="button" onClick={() => setSelectedBooking(b)}
              className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 mb-2 text-left hover:border-[#06a63e]/30 hover:bg-[#06a63e]/5 transition">
              <div>
                <p className="text-sm font-semibold text-gray-700">{b.service_type} — {b.waste_category}</p>
                <p className="text-xs text-gray-400">{b.location} · {new Date(b.scheduled_date).toLocaleDateString()}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}>{b.status}</span>
            </button>
          ))}
      </div>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-800 mb-4">Driver Location</h3>
        <div className="flex h-36 items-center justify-center rounded-2xl bg-gray-50">
          <p className="text-sm text-gray-400">No active driver assigned.</p>
        </div>
      </div>
    </div>
  );

  const HistoryPanel = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">History</h2>
        <p className="mt-1 text-sm text-gray-500">View your past orders and service records.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: "clock", label: "Order History", sub: "View all your past pickup and service requests.", action: () => navigate("/service-history"), link: "View orders →", bg: "bg-amber-50", color: "text-amber-600" },
          { icon: "creditCard", label: "Payment History", sub: "Review your billing records and transaction details.", action: () => navigate("/payment-history"), link: "View payments →", bg: "bg-blue-50", color: "text-blue-600" },
        ].map(({ icon, label, sub, action, link, bg, color }) => (
          <button key={label} type="button" onClick={action}
            className="rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:border-[#06a63e]/40 hover:bg-[#06a63e]/5 transition group">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
              <Icon name={icon} className={`h-6 w-6 ${color}`} />
            </div>
            <h3 className="mt-4 text-base font-black text-gray-800">{label}</h3>
            <p className="mt-1 text-sm text-gray-500">{sub}</p>
            <p className="mt-3 text-xs font-bold text-[#06a63e] group-hover:underline">{link}</p>
          </button>
        ))}
      </div>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-800 mb-4">Recent Bookings</h3>
        {loadingBookings ? <p className="text-sm text-gray-400">Loading…</p>
          : bookings.length === 0 ? <p className="text-sm text-gray-400">No bookings yet.</p>
          : bookings.slice(0, 6).map((b) => (
            <button key={b._id} type="button" onClick={() => setSelectedBooking(b)}
              className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 mb-2 text-left hover:border-[#06a63e]/30 hover:bg-[#06a63e]/5 transition">
              <div>
                <p className="text-sm font-semibold text-gray-700">{b.service_type} — {b.waste_category}</p>
                <p className="text-xs text-gray-400">{new Date(b.scheduled_date).toLocaleDateString()}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}>{b.status}</span>
            </button>
          ))}
      </div>
    </div>
  );

  const PaymentsPanel = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Payments</h2>
        <p className="mt-1 text-sm text-gray-500">Your billing summary and transaction history.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: "creditCard", label: "Total Paid",      value: `LKR ${totalPaid.toLocaleString()}`,                                                         border: "border-blue-200",   bg: "bg-blue-50",   color: "text-blue-600" },
          { icon: "clock",      label: "Transactions",    value: payments.length,                                                                              border: "border-green-200",  bg: "bg-green-50",  color: "text-green-600" },
          { icon: "sparkles",   label: "Avg per Booking", value: `LKR ${payments.length > 0 ? Math.round(totalPaid / payments.length).toLocaleString() : 0}`, border: "border-purple-200", bg: "bg-purple-50", color: "text-purple-600" },
        ].map(({ icon, label, value, border, bg, color }) => (
          <div key={label} className={`rounded-3xl border bg-white p-5 shadow-sm ${border}`}>
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}>
              <Icon name={icon} className={`h-5 w-5 ${color}`} />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Recent Transactions</h3>
          <button type="button" onClick={() => navigate("/payment-history")} className="text-xs font-bold text-[#06a63e] hover:underline">View all →</button>
        </div>
        {payments.length === 0 ? <p className="text-sm text-gray-400">No transactions yet.</p>
          : payments.slice(0, 6).map((p, i) => (
            <div key={p._id || i} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-700">{p.payment_method || "Online Payment"}</p>
                <p className="text-xs text-gray-400">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "—"}</p>
              </div>
              <p className="text-sm font-black text-gray-900">LKR {(p.amount || 0).toLocaleString()}</p>
            </div>
          ))}
      </div>
    </div>
  );

  const InquiryPanel = React.memo(function InquiryPanelInner() {
    const [inquiry, setInquiry] = useState({ subject: "", message: "" });
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState({ type: "", text: "" });
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!inquiry.message.trim()) { setStatus({ type: "error", text: "Please enter a message." }); return; }
      try {
        setSending(true);
        await submitInquiry({ clerkId: user?.id || "", userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Ecofy User", userEmail: user?.primaryEmailAddress?.emailAddress || "", subject: inquiry.subject || "General Inquiry", message: inquiry.message });
        setInquiry({ subject: "", message: "" });
        setStatus({ type: "success", text: "Inquiry sent! Admin will respond soon." });
      } catch (err) { setStatus({ type: "error", text: err.message || "Failed to send." }); }
      finally { setSending(false); }
    };
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Send an Inquiry</h2>
          <p className="mt-1 text-sm text-gray-500">Your message goes directly to the Ecofy admin team.</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Subject (optional)</label>
              <input type="text" value={inquiry.subject} onChange={(e) => setInquiry((p) => ({ ...p, subject: e.target.value }))}
                placeholder="e.g. Missed pickup on 28th May"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#06a63e] transition" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Message</label>
              <textarea value={inquiry.message} onChange={(e) => setInquiry((p) => ({ ...p, message: e.target.value }))}
                placeholder="Describe your issue or question..." rows={6}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#06a63e] transition" />
            </div>
            {status.text && <p className={`text-sm font-medium ${status.type === "success" ? "text-[#06a63e]" : "text-red-600"}`}>{status.text}</p>}
            <button type="submit" disabled={sending}
              className="inline-flex items-center gap-2 rounded-xl bg-[#06a63e] px-6 py-3 text-sm font-bold text-white hover:bg-[#058b33] disabled:opacity-60 transition">
              <Icon name="chat" className="h-4 w-4" />
              {sending ? "Sending..." : "Send Inquiry"}
            </button>
          </form>
        </div>
      </div>
    );
  });

  const ServicesPanel = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Services</h2>
        <p className="mt-1 text-sm text-gray-500">Extra support and service shortcuts for your account.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <HelpCard title="Pickup support" description="Need to reschedule, track, or understand a pickup booking?" actionLabel="Book a pickup" onAction={() => setShowPickupModal(true)} />
        <HelpCard title="Account help" description="Update your name, phone number, and other profile details." actionLabel="Manage profile" onAction={() => navigate2Tab("profile")} />
        <HelpCard title="Billing questions" description="Review your service history or ask about a recent transaction." actionLabel="Order history" onAction={() => setShowHistoryModal(true)} />
        <HelpCard title="Live assistance" description="Send a message and the Ecofy team will respond promptly." actionLabel="Send inquiry" onAction={() => navigate2Tab("inquiry")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Start a pickup request", sub: "Open the booking flow.", action: () => setShowPickupModal(true) },
          { label: "View payments", sub: "Review billing activity.", action: () => navigate("/payment-history") },
          { label: "Notifications", sub: "Check recent alerts.", action: () => navigate("/notifications") },
        ].map(({ label, sub, action }) => (
          <button key={label} type="button" onClick={action}
            className="rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:border-[#06a63e]/40 hover:bg-[#06a63e]/5 transition">
            <p className="text-sm font-bold text-gray-800">{label}</p>
            <p className="mt-1 text-sm text-gray-500">{sub}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPanel = () => {
    switch (activeTab) {
      case "home":             return <HomePanel />;
      case "schedule":         return <SchedulePanel />;
      case "track-status":     return <TrackStatusPanel />;
      case "history":          return <HistoryPanel />;
      case "payments":         return <PaymentsPanel />;
      case "inquiry":          return <InquiryPanel />;
      case "profile":          return <ProfileSettings />;
      case "special-services": return <ServicesPanel />;
      default:                 return <HomePanel />;
    }
  };

  return (
    <>
      {/* Notification Bell — fixed top right, aligned with navbar */}
     <div className="fixed top-8 right-28 z-50 flex items-center">
        <NotificationBell target="user" />
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
        <svg className="absolute top-40 left-72 w-24 h-24 text-[#218845] animate-wobble" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <svg className="absolute bottom-32 right-12 w-32 h-32 text-[#218845] animate-wobble-reverse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5V11m0 0a5 5 0 0 1 5-5h2.5c0 4.5-2 6.5-4 8l-3.5 3m0-11a5 5 0 0 0-5-5H7c0 4.5 2 6.5 4 8l3.5 3" />
        </svg>
      </div>

      <div className="relative z-10 flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside className={`
          fixed left-0 z-30 flex flex-col bg-white border-r border-gray-200 shadow-xl
          transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0 lg:shadow-sm
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-64 top-0 h-screen
        `}>
          {/* Logo — fills the same height as the navbar (88px) */}
          <div className="flex h-[88px] items-center gap-3 border-b border-gray-100 px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#06a63e]">
              <Icon name="recycle" className="h-5 w-5 text-white" />
            </div>
            <p className="text-base font-black text-gray-900">Ecofy</p>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} type="button" onClick={() => navigate2Tab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive ? "bg-[#06a63e] text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}>
                  <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                  <span>{item.label}</span>
                  {item.id === "track-status" && activeBookings.length > 0 && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-black ${isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                      {activeBookings.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="text-xs text-gray-400">Ecofy © 2026</p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 min-h-screen">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden sticky top-[88px] z-10 shadow-sm">
            <button type="button" onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-100">
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <p className="text-sm font-bold text-gray-800">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
            </p>
            <div className="w-9" />
          </div>

          <main className="p-6 pt-28 lg:p-8 lg:pt-28">
            {renderPanel()}
          </main>
        </div>
      </div>

      <BookingDetailsModal />
      <HistoryChooserModal />

      <RequestPickupModal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        initialLocation={pickupLocation}
        initialCoordinates={pickupCoordinates}
        onSuccess={(bookingDetails) => {
          setLastBooking(bookingDetails);
          setShowPickupModal(false);
          setShowPaymentModal(true);
        }}
      />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => { setShowPaymentModal(false); fetchBookings(); fetchPayments(); }}
        bookingDetails={lastBooking}
      />
    </>
  );
}