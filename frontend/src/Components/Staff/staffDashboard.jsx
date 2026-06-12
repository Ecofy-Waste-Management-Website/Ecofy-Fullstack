import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

<<<<<<< HEAD
=======
const SERVICE_PRICES = {
  Household: 1500,
  Commercial: 3500,
  Bulk: 2500,
  Garden: 1200,
  "Drain Cleaning": 2000,
};

const BALANGODA_MAP_CENTER = [6.6617, 80.6937];
const BALANGODA_MAP_BOUNDS = L.latLngBounds(
  [6.54, 80.56],
  [6.79, 80.84]
);
const LEAFLET_MAP_CENTER = BALANGODA_MAP_CENTER;
const MAP_LABELS = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const isInsideBalangodaArea = (latitude, longitude) =>
  BALANGODA_MAP_BOUNDS.contains([latitude, longitude]);

const getBalangodaSearchQuery = (target) => {
  const query = target.trim();
  if (/balangoda|sri lanka/i.test(query)) return query;
  return `${query}, Balangoda, Ratnapura, Sri Lanka`;
};

const getOrderMapTarget = (order) => {
  const latitude = Number(order?.pickupCoordinates?.latitude);
  const longitude = Number(order?.pickupCoordinates?.longitude);

  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    isInsideBalangodaArea(latitude, longitude)
  ) {
    return `${latitude},${longitude}`;
  }

  return typeof order?.location === "string" ? order.location.trim() : "";
};

const getPendingOrderPins = (orders) =>
  orders
    .map((order, index) => {
      const target = getOrderMapTarget(order);
      if (!target) return null;

      return {
        order,
        target,
        label: MAP_LABELS[index % MAP_LABELS.length],
      };
    })
    .filter(Boolean);

const isCoordinateTarget = (target) => /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(target);

const geocodePendingOrderTarget = async (target) => {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', getBalangodaSearchQuery(target));
  url.searchParams.set('viewbox', '80.56,6.79,80.84,6.54');
  url.searchParams.set('bounded', '1');

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) return null;

  const data = await response.json();
  if (!Array.isArray(data) || !data[0]) return null;

  const latitude = Number(data[0].lat);
  const longitude = Number(data[0].lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return { lat: latitude, lng: longitude };
};

const resolveOrderDestination = async (order) => {
  const target = getOrderMapTarget(order);
  if (!target) return null;

  if (isCoordinateTarget(target)) {
    const [lat, lng] = target.split(',').map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
    return null;
  }

  return geocodePendingOrderTarget(target);
};

const createPinIcon = (label) => L.divIcon({
  className: '',
  html: `
    <div style="
      width: 42px;
      height: 42px;
      border-radius: 9999px 9999px 9999px 4px;
      background: #1f6f36;
      color: white;
      display: grid;
      place-items: center;
      font-weight: 900;
      font-size: 14px;
      box-shadow: 0 14px 24px rgba(17, 42, 15, 0.36), 0 0 0 8px rgba(255, 255, 255, 0.55);
      transform: rotate(-45deg);
      border: 3px solid #ffffff;
    ">
      <span style="transform: rotate(45deg);">${label}</span>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -36],
});

function PendingOrdersMapCanvas({ orders, onOrderSelect }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapState, setMapState] = useState({ loading: true, message: "Loading OpenStreetMap pins..." });

  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(BALANGODA_MAP_CENTER, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 12,
      }).addTo(map);

      mapRef.current = map;
      setMapReady(true);
      setMapState({ loading: false, message: 'OpenStreetMap loaded.' });
    };

    initializeMap();

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [orders]);

  useEffect(() => {
    let cancelled = false;

    const renderPins = async () => {
      const map = mapRef.current;
      if (!map || !mapReady) return;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const resolvedPins = [];
      for (const [index, order] of orders.slice(0, 20).entries()) {
        const target = getOrderMapTarget(order);
        if (!target) continue;

        const label = MAP_LABELS[index % MAP_LABELS.length];
        const position = isCoordinateTarget(target)
          ? (() => {
              const [lat, lng] = target.split(',').map(Number);
              return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
            })()
          : await geocodePendingOrderTarget(target);

        resolvedPins.push({
          order,
          label,
          position: position || { lat: BALANGODA_MAP_CENTER[0], lng: BALANGODA_MAP_CENTER[1] },
          target,
        });
      }

      if (cancelled) return;

      const bounds = L.latLngBounds([]);
      resolvedPins.forEach(({ position, label, order }) => {
        const marker = L.marker([position.lat, position.lng], {
          icon: createPinIcon(label),
          title: `${order._id?.slice(-8)?.toUpperCase() || 'Order'} • ${order.location || 'Pickup location'}`,
        }).addTo(map);

        marker.on('click', () => {
          if (typeof onOrderSelect === 'function') {
            onOrderSelect(order);
          }
        });

        marker.bindPopup(`
          <div style="min-width: 180px; font-family: system-ui, sans-serif;">
            <div style="font-size: 10px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: #397239; margin-bottom: 4px;">Pin ${label}</div>
            <div style="font-size: 14px; font-weight: 800; color: #244c21; margin-bottom: 4px;">${order.location || 'Pickup location'}</div>
            <div style="font-size: 12px; color: #397239; margin-bottom: 4px;">${order.customer_name || 'Customer'} • ${order.service_type || 'Pending order'}</div>
            <div style="font-size: 12px; color: #397239; margin-bottom: 8px;">Order ${order._id?.slice(-8)?.toUpperCase() || 'N/A'}</div>
            <button type="button" data-order-button="true" style="border: none; border-radius: 9999px; background: #397239; color: white; font-size: 11px; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 12px; cursor: pointer;">View details</button>
          </div>
        `);

        marker.on('popupopen', (event) => {
          const popupElement = event.popup.getElement();
          const button = popupElement?.querySelector('[data-order-button="true"]');
          if (button) {
            button.addEventListener('click', () => {
              if (typeof onOrderSelect === 'function') {
                onOrderSelect(order);
              }
            }, { once: true });
          }
        });

        markersRef.current.push(marker);
        bounds.extend([position.lat, position.lng]);
      });

      if (resolvedPins.length > 1 && bounds.isValid()) {
        const balangodaBounds = bounds.pad(0.22).extend(BALANGODA_MAP_CENTER);
        map.fitBounds(balangodaBounds, {
          maxZoom: 15,
          padding: [36, 36],
        });
      } else if (resolvedPins.length === 1) {
        map.setView([resolvedPins[0].position.lat, resolvedPins[0].position.lng], 15);
      } else {
        map.setView(BALANGODA_MAP_CENTER, 14);
      }

      setMapState({
        loading: false,
        message: resolvedPins.length > 0
          ? `Pinned ${resolvedPins.length} location${resolvedPins.length === 1 ? '' : 's'}.`
          : 'No geocodable pickup locations were found yet.',
      });
    };

    renderPins();

    return () => {
      cancelled = true;
    };
  }, [orders, onOrderSelect, mapReady]);

  return (
    <div className="relative min-h-[320px] flex-1 bg-[#eff5ea]">
      <div ref={mapContainerRef} className="h-full w-full min-h-[320px]" />
      {mapState.loading && (
        <div className="absolute inset-0 grid place-items-center bg-white/75 text-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#397239]/55">Loading map</p>
            <p className="mt-2 text-xs font-medium text-[#397239]/60">Rendering pickup pins...</p>
          </div>
        </div>
      )}
    </div>
  );
}

const formatRouteDistance = (meters) => {
  if (!Number.isFinite(meters)) return "N/A";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const formatRouteDuration = (seconds) => {
  if (!Number.isFinite(seconds)) return "N/A";
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
  return `${totalMinutes} min`;
};

const buildOpenStreetMapDirectionsUrl = (origin, destination) => {
  if (!origin || !destination) return "";

  const url = new URL("https://www.openstreetmap.org/directions");
  url.searchParams.set("engine", "fossgis_osrm_car");
  url.searchParams.set(
    "route",
    `${origin.lat},${origin.lng};${destination.lat},${destination.lng}`
  );
  return url.toString();
};

const createLabeledMarkerIcon = (label, backgroundColor = "#397239") => L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      border-radius: 9999px;
      background: ${backgroundColor};
      color: white;
      display: grid;
      place-items: center;
      font-weight: 900;
      font-size: 11px;
      box-shadow: 0 10px 18px rgba(57, 114, 57, 0.35);
      border: 2px solid rgba(255,255,255,0.9);
    ">
      <span>${label}</span>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

function PickupNavigationMap({ order }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const originMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const [destinationPoint, setDestinationPoint] = useState(null);
  const [originPoint, setOriginPoint] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null);
  const [mapState, setMapState] = useState({ loading: true, message: "Loading route map..." });

  useEffect(() => {
    let cancelled = false;

    const initializeMap = async () => {
      setDestinationPoint(null);
      setOriginPoint(null);
      setRouteSummary(null);
      setMapState({ loading: true, message: "Resolving pickup location..." });

      const destination = await resolveOrderDestination(order);
      if (cancelled) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(destination || LEAFLET_MAP_CENTER, destination ? 13 : 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setDestinationPoint(destination);

      if (destination) {
        destinationMarkerRef.current = L.marker([destination.lat, destination.lng], {
          icon: createLabeledMarkerIcon("D", "#397239"),
        }).addTo(map);
        destinationMarkerRef.current.bindPopup(`
          <div style="min-width: 180px; font-family: system-ui, sans-serif;">
            <div style="font-size: 10px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: #397239; margin-bottom: 4px;">Destination</div>
            <div style="font-size: 14px; font-weight: 800; color: #244c21; margin-bottom: 4px;">${order?.location || "Pickup location"}</div>
            <div style="font-size: 12px; color: #397239;">${order?._id?.slice(-8)?.toUpperCase() || "N/A"}</div>
          </div>
        `);

        map.setView([destination.lat, destination.lng], 13);
        setMapState({ loading: false, message: "Destination pinned. Click the route button to draw the OSRM line." });
      } else {
        setMapState({ loading: false, message: "No pickup coordinates available for this order." });
      }
    };

    initializeMap();

    return () => {
      cancelled = true;
      routeLayerRef.current?.remove();
      routeLayerRef.current = null;
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      destinationMarkerRef.current?.remove();
      destinationMarkerRef.current = null;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [order]);

  useEffect(() => {
    let cancelled = false;

    const drawRoute = async () => {
      if (!mapRef.current || !destinationPoint) return;

      routeLayerRef.current?.remove();
      routeLayerRef.current = null;
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      setRouteSummary(null);

      if (!originPoint) {
        setMapState((prev) => ({ ...prev, message: "Use your current location to draw an OSRM pickup route." }));
        return;
      }

      setMapState({ loading: true, message: "Fetching OSRM pickup route..." });

      const routeUrl = new URL("https://router.project-osrm.org/route/v1/driving/");
      routeUrl.pathname += `${originPoint.lng},${originPoint.lat};${destinationPoint.lng},${destinationPoint.lat}`;
      routeUrl.searchParams.set("overview", "full");
      routeUrl.searchParams.set("geometries", "geojson");
      routeUrl.searchParams.set("steps", "false");

      const response = await fetch(routeUrl.toString());
      if (!response.ok) {
        throw new Error("OSRM route service is unavailable right now.");
      }

      const data = await response.json();
      const route = data?.routes?.[0];
      if (!route?.geometry) {
        throw new Error("No OSRM route could be calculated for this pickup.");
      }

      if (cancelled || !mapRef.current) return;

      routeLayerRef.current = L.geoJSON(route.geometry, {
        style: {
          color: "#397239",
          weight: 5,
          opacity: 0.9,
        },
      }).addTo(mapRef.current);

      originMarkerRef.current = L.marker([originPoint.lat, originPoint.lng], {
        icon: createLabeledMarkerIcon("S", "#244c21"),
      }).addTo(mapRef.current);
      originMarkerRef.current.bindPopup(`
        <div style="min-width: 160px; font-family: system-ui, sans-serif;">
          <div style="font-size: 10px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: #244c21; margin-bottom: 4px;">Start</div>
          <div style="font-size: 12px; font-weight: 700; color: #244c21;">Your current location</div>
        </div>
      `);

      const bounds = routeLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds.pad(0.2));
      }

      setRouteSummary({
        distance: route.distance,
        duration: route.duration,
      });
      setMapState({
        loading: false,
        message: `OSRM route ready: ${formatRouteDistance(route.distance)} • ${formatRouteDuration(route.duration)}.`,
      });
    };

    drawRoute().catch((error) => {
      if (!cancelled) {
        setMapState({ loading: false, message: error instanceof Error ? error.message : "Failed to draw OSRM route." });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [originPoint, destinationPoint]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setMapState({ loading: false, message: "Geolocation is not supported in this browser." });
      return;
    }

    setMapState({ loading: true, message: "Requesting your current location..." });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOriginPoint({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setMapState({ loading: false, message: "Location access was denied. Allow it to draw the route." });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleClearRoute = () => {
    setOriginPoint(null);
    setRouteSummary(null);
    routeLayerRef.current?.remove();
    routeLayerRef.current = null;
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    if (mapRef.current && destinationPoint) {
      mapRef.current.setView([destinationPoint.lat, destinationPoint.lng], 13);
    }
    setMapState((prev) => ({
      ...prev,
      loading: false,
      message: destinationPoint
        ? "Route cleared. Use your location to draw it again."
        : "No pickup coordinates available for this order.",
    }));
  };

  const handleOpenDirections = () => {
    if (!originPoint || !destinationPoint) return;
    const url = buildOpenStreetMapDirectionsUrl(originPoint, destinationPoint);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative min-h-[420px] flex-1 bg-[#eff5ea]">
      <div ref={mapContainerRef} className="h-full w-full min-h-[420px]" />
      {mapState.loading && (
        <div className="absolute inset-0 grid place-items-center bg-white/75 text-center">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#397239]/55">Loading route</p>
            <p className="mt-2 text-xs font-medium text-[#397239]/60">Resolving the pickup route...</p>
          </div>
        </div>
      )}
      {!mapState.loading && mapState.message && (
        <div className="absolute left-4 right-4 top-4 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#397239]/45">Route status</p>
          <p className="mt-1 text-sm font-bold text-[#244c21]">{mapState.message}</p>
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#397239]/45">Route controls</p>
          <p className="text-sm font-bold text-[#244c21]">
            {routeSummary
              ? `${formatRouteDistance(routeSummary.distance)} • ${formatRouteDuration(routeSummary.duration)}`
              : "Draw a live OSRM route from your current location."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="rounded-full bg-[#397239] px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#244c21]"
          >
            Use my location
          </button>
          <button
            type="button"
            onClick={handleClearRoute}
            className="rounded-full border border-[#397234]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-[#397239] transition hover:bg-[#D6E9CA]/40"
          >
            Clear route
          </button>
          <button
            type="button"
            onClick={handleOpenDirections}
            disabled={!originPoint || !destinationPoint}
            className="rounded-full border border-[#397234]/10 bg-[#D6E9CA]/40 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#244c21] transition hover:bg-[#D6E9CA]/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Open directions
          </button>
        </div>
      </div>
    </div>
  );
}

>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "En Route": "bg-cyan-100 text-cyan-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Delayed: "bg-red-100 text-red-700",
};

// --- Professional Icons (Inline SVGs) ---
const Icons = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  PendingTasks: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ActiveTasks: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2a1 1 0 01-1 1m-4-4h4m4 0h2a1 1 0 011 1v3a1 1 0 01-1 1h-1m-5-10l4.293 4.293A1 1 0 0119 11.707V14" />
    </svg>
  ),
  CompletedTasks: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Inquiry: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Notes: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Menu: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Search: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5h6m0 0v6m0-6L10 14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7a2 2 0 012-2h4m-6 8v6a2 2 0 002 2h6" />
    </svg>
  ),
  Send: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronUp: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ),
};

export default function StaffDashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [navigationOrder, setNavigationOrder] = useState(null);
  const [selectedPendingOrder, setSelectedPendingOrder] = useState(null);
  const [displayName, setDisplayName] = useState('Staff Member');
  const [pickupPinValues, setPickupPinValues] = useState({});
  const [verifiedPickupPins, setVerifiedPickupPins] = useState({});
  // Inquiry state
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [expandedInquiryId, setExpandedInquiryId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [sendingReply, setSendingReply] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    firstName: '',
    lastName: '',
    availabilityStatus: 'Available',
    bankDetails: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      branch: '',
    },
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState(null);

  const staffName = displayName;
  const staffInitials = staffName.split(" ").map(n => n[0] || "").join("").toUpperCase();
  const openPendingOrderDetails = (order) => {
    setSelectedPendingOrder(order);
  };
  const openNavigationForOrder = (order) => {
    setNavigationOrder(order);
    setShowNavigationModal(true);
  };

  // Fetch tasks and role
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchRoleAndProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setRole(data.user.role);
          const profile = data.user;
          const nextFirstName = profile.firstName || user.firstName || '';
          const nextLastName = profile.lastName || user.lastName || '';
          setDisplayName(`${nextFirstName} ${nextLastName}`.trim() || 'Staff Member');
          setSettingsForm({
            firstName: nextFirstName,
            lastName: nextLastName,
            availabilityStatus: profile.availabilityStatus || 'Available',
            bankDetails: {
              bankName: profile.bankDetails?.bankName || '',
              accountName: profile.bankDetails?.accountName || '',
              accountNumber: profile.bankDetails?.accountNumber || '',
              branch: profile.bankDetails?.branch || '',
            },
          });
        }
      } catch (error) {
        console.error('Failed to fetch staff role:', error);
      } finally {
        setRoleLoading(false);
        setSettingsLoading(false);
      }
    };

    fetchRoleAndProfile();

    const fetchTasks = async () => {
      try {
        const activeRes = await fetch(`${API_BASE_URL}/staff/tasks/active/${user.id}`);
        const completedRes = await fetch(`${API_BASE_URL}/staff/tasks/completed/${user.id}`);

        if (activeRes.ok) {
          const activeData = await activeRes.json();
          setActiveTasks(activeData.data || []);
        }
        if (completedRes.ok) {
          const completedData = await completedRes.json();
          setCompletedTasks(completedData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [isLoaded, user]);

  // Fetch inquiries when tab is opened
  useEffect(() => {
    if (activeTab !== 'inquiries' || !user?.id) return;
    fetchInquiries();
  }, [activeTab, user]);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries`);
      if (res.ok) {
        const data = await res.json();
        // Filter to only show inquiries whose clerkId matches this staff member
        const filtered = (data.inquiries || []).filter(
          (inq) => inq.clerkId && inq.clerkId === user.id
        );
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleSendReply = async (inquiryId) => {
    const replyText = replyTexts[inquiryId]?.trim();
    if (!replyText || sendingReply === inquiryId) return;

    setSendingReply(inquiryId);
    try {
      const res = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reply: replyText,
          repliedBy: staffName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq._id === inquiryId ? data.inquiry : inq
          )
        );
        setReplyTexts((prev) => ({ ...prev, [inquiryId]: '' }));
        showNotification('Reply sent successfully!');
      } else {
        showNotification(data.message || 'Failed to send reply.', 'error');
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
      showNotification('Failed to send reply. Please try again.', 'error');
    } finally {
      setSendingReply(null);
    }
  };

  const handleSettingsChange = (field, value) => {
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankDetailChange = (field, value) => {
    setSettingsForm((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value,
      },
    }));
  };

  const saveSettings = async () => {
    if (!user?.id || savingSettings) return;

    setSavingSettings(true);
    setSettingsMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      const updatedUser = data.user || {};
      const nextFirstName = updatedUser.firstName || settingsForm.firstName;
      const nextLastName = updatedUser.lastName || settingsForm.lastName;

      setDisplayName(`${nextFirstName} ${nextLastName}`.trim() || 'Staff Member');
      setRole(updatedUser.role || role);
      setSettingsForm({
        firstName: nextFirstName,
        lastName: nextLastName,
        availabilityStatus: updatedUser.availabilityStatus || settingsForm.availabilityStatus,
        bankDetails: {
          bankName: updatedUser.bankDetails?.bankName || settingsForm.bankDetails.bankName,
          accountName: updatedUser.bankDetails?.accountName || settingsForm.bankDetails.accountName,
          accountNumber: updatedUser.bankDetails?.accountNumber || settingsForm.bankDetails.accountNumber,
          branch: updatedUser.bankDetails?.branch || settingsForm.bankDetails.branch,
        },
      });

      setSettingsMessage({ type: 'success', text: 'Settings updated successfully.' });
      showNotification('Settings updated successfully!');
    } catch (error) {
      setSettingsMessage({ type: 'error', text: error.message });
    } finally {
      setSavingSettings(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    if (updatingTask === taskId) return;
    if (newStatus === 'Completed' && activeTasks.find((task) => task._id === taskId)?.pickupPin && !verifiedPickupPins[taskId]) {
      showNotification('Verify the pickup PIN before completing this task.', 'error');
      return;
    }
    setUpdatingTask(taskId);
    try {
      const res = await fetch(`${API_BASE_URL}/staff/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, clerkId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        if (newStatus === 'Completed') {
          const task = activeTasks.find(t => t._id === taskId);
          
          await fetch(`${API_BASE_URL}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerkId: user.id,
              target: 'staff',
              title: 'Task Completed',
              message: `You completed the ${task?.service_type || 'service'} order for ${task?.customer_name || 'a customer'}.`,
              type: 'Success',
              isRead: false,
            }),
          });

          setActiveTasks(prev => prev.filter(t => t._id !== taskId));
          setCompletedTasks(prev => [{ ...task, status: 'Completed', completedAt: new Date() }, ...prev]);
          showNotification('Task completed successfully!');
          setTimeout(() => setActiveTab('completed'), 500);
        } else {
          setActiveTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
          showNotification(`Status updated to ${newStatus}`);
        }
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showNotification('Failed to update status. Please try again.', 'error');
    } finally {
      setUpdatingTask(null);
    }
  };

<<<<<<< HEAD
=======
  const confirmPickup = async (order) => {
    if (!user?.id || confirmingOrderId === order._id) return;

    setConfirmingOrderId(order._id);
    try {
      const assignRes = await fetch(`${API_BASE_URL}/service-monitoring/${order._id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedStaff: user.id }),
      });
      const assignData = await assignRes.json();

      if (!assignRes.ok) {
        throw new Error(assignData.message || 'Failed to assign pickup');
      }

      const statusRes = await fetch(`${API_BASE_URL}/staff/tasks/${order._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Assigned', clerkId: user.id }),
      });
      const statusData = await statusRes.json();

      if (!statusRes.ok) {
        throw new Error(statusData.message || 'Failed to confirm pickup');
      }

      await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,                          // personal — only this staff member
          target: 'staff',
          title: 'Pickup Confirmed',
          message: `You picked up order #${order._id.slice(-8).toUpperCase()} (${order.service_type || 'Service'}) at ${order.location || 'unknown location'}.`,
          isRead: false,
        }),
      });

      setPendingOrders((prev) => prev.filter((item) => item._id !== order._id));
      setActiveTasks((prev) => [
        { ...order, assignedStaff: user.id, status: 'Assigned' },
        ...prev.filter((item) => item._id !== order._id),
      ]);
      setSelectedPendingOrder(null);
      setNavigationOrder({ ...order, assignedStaff: user.id, status: 'Assigned' });
      setShowNavigationModal(true);
      showNotification('Pickup confirmed successfully!');
      setActiveTab('active');
    } catch (err) {
      console.error('Failed to confirm pickup:', err);
      showNotification(err.message || 'Failed to confirm pickup.', 'error');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const cancelPickup = async (order) => {
    if (!user?.id || confirmingOrderId === order._id) return;

    const confirmed = window.confirm('Cancel this pickup and return it to pending orders?');
    if (!confirmed) return;

    setConfirmingOrderId(order._id);
    try {
      const cancelRes = await fetch(`${API_BASE_URL}/service-monitoring/${order._id}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: user.id }),
      });

      const cancelData = await cancelRes.json();

      if (!cancelRes.ok) {
        throw new Error(cancelData.message || 'Failed to cancel pickup');
      }

      setActiveTasks((prev) => prev.filter((item) => item._id !== order._id));
      setPendingOrders((prev) => [{ ...order, status: 'Pending', assignedStaff: null }, ...prev]);
      setPickupPinValues((prev) => {
        const next = { ...prev };
        delete next[order._id];
        return next;
      });
      setVerifiedPickupPins((prev) => {
        const next = { ...prev };
        delete next[order._id];
        return next;
      });
      showNotification('Pickup cancelled and returned to pending orders.');
      setActiveTab('pending');
    } catch (err) {
      console.error('Failed to cancel pickup:', err);
      showNotification(err.message || 'Failed to cancel pickup.', 'error');
    } finally {
      setConfirmingOrderId(null);
    }
  };

>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
  const getStatusColor = (status) => STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';

  const handlePickupPinChange = (taskId, value) => {
    setPickupPinValues((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const verifyPickupPin = (task) => {
    const enteredPin = String(pickupPinValues[task._id] || '').trim();
    const expectedPin = String(task.pickupPin || '').trim();

    if (!expectedPin) {
      showNotification('No pickup PIN is available for this order.', 'error');
      return;
    }

    if (enteredPin && enteredPin === expectedPin) {
      setVerifiedPickupPins((prev) => ({
        ...prev,
        [task._id]: true,
      }));
      showNotification('Pickup PIN verified successfully!');
      return;
    }

    setVerifiedPickupPins((prev) => ({
      ...prev,
      [task._id]: false,
    }));
    showNotification('Invalid pickup PIN.', 'error');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSwitchDashboard = () => navigate('/admin-dashboard');

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-emerald-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-emerald-900 font-bold animate-pulse">Syncing with Schedule...</p>
        </div>
      </div>
    );
  }

  const pendingTasks = activeTasks.filter(t => t.status === 'Pending');
  const ongoingTasks = activeTasks.filter(t => t.status !== 'Pending');
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'Pending').length;

  const menuItems = [
    { label: 'Pending Tasks', key: 'pending', icon: <Icons.PendingTasks />, count: pendingTasks.length },
    { label: 'Active Tasks', key: 'active', icon: <Icons.ActiveTasks />, count: ongoingTasks.length },
    { label: 'Completed Today', key: 'completed', icon: <Icons.CompletedTasks />, count: completedTasks.length },
    { label: 'Inquiries', key: 'inquiries', icon: <Icons.Inquiry />, count: pendingInquiriesCount },
    { label: 'Settings', key: 'settings', icon: <Icons.Bell />, count: 0 },
  ];

  const getPageTitle = () => menuItems.find(m => m.key === activeTab)?.label || "Staff Dashboard";

  const renderTaskCard = (task, isCompleted = false) => (
    <div key={task._id} className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-emerald-100 shadow-sm transition-all hover:shadow-md ${isCompleted ? 'opacity-80' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-emerald-950 leading-tight">{task.customer_name || 'Customer'}</h3>
          <p className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-[0.2em] mt-1">{task.service_type || 'General Service'}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'bg-emerald-100 text-emerald-700' : getStatusColor(task.status)}`}>
          {isCompleted ? 'Completed' : task.status}
        </span>
      </div>

<<<<<<< HEAD
      <div className="bg-emerald-50/50 rounded-2xl p-4 mb-4 border border-emerald-100/50">
        <p className="text-[9px] font-bold text-emerald-600/40 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Icons.MapPin /> LOCATION</p>
        <p className="text-sm text-emerald-950 font-semibold leading-relaxed truncate">{task.location || 'Location missing'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-emerald-50/30 rounded-2xl p-3 border border-emerald-100/30">
          <p className="text-[9px] text-emerald-600/40 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icons.Calendar /> DATE</p>
          <p className="text-xs font-bold text-emerald-900 mt-1">{isCompleted ? formatDate(task.scheduled_date) : formatDate(task.scheduled_date)}</p>
        </div>
        <div className="bg-emerald-50/30 rounded-2xl p-3 border border-emerald-100/30">
          <p className="text-[9px] text-emerald-600/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
            {isCompleted ? <Icons.Clock /> : <Icons.Clock />} {isCompleted ? 'DONE' : 'TIME'}
=======
      <div className="bg-[#D6E9CA]/50 rounded-2xl p-4 mb-4 border border-[#397234]/10 shadow-inner">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[9px] font-bold text-[#397239]/40 uppercase tracking-widest flex items-center gap-1.5"><Icons.MapPin /> LOCATION</p>
          {task.location && (
            <a
              href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(task.location)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#397239]/15 bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#397239] transition-all hover:bg-white"
            >
              Open in OpenStreetMap
              <Icons.ExternalLink />
            </a>
          )}
        </div>
        <p className="text-sm text-[#244c21] font-bold leading-relaxed truncate">{task.location || 'Location missing'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#D6E9CA]/50 rounded-2xl p-3 border border-[#397234]/10">
          <p className="text-[9px] text-[#397239]/40 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icons.Calendar /> DATE</p>
          <p className="text-xs font-black text-[#244c21] mt-1">{formatDate(task.scheduled_date)}</p>
        </div>
        <div className="bg-[#D6E9CA]/50 rounded-2xl p-3 border border-[#397234]/10">
          <p className="text-[9px] text-[#397239]/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Icons.Clock /> {isCompleted ? 'DONE' : 'TIME'}
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
          </p>
          <p className="text-xs font-bold text-emerald-900 mt-1">{isCompleted ? formatTime(task.completedAt) : formatTime(task.scheduled_date)}</p>
        </div>
      </div>

      {!isCompleted && (
      <div className="grid grid-cols-1 gap-3 mb-6 md:grid-cols-3">
        <div className="rounded-2xl border border-[#397234]/10 bg-white/60 p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#397239]/40">Order Price</p>
          <p className="mt-1 text-sm font-black text-[#244c21]">{formatCurrency(getEstimatedAmount(task))}</p>
        </div>

        <div className="rounded-2xl border border-[#397234]/10 bg-white/60 p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#397239]/40">Customer Phone</p>
          <p className="mt-1 text-sm font-black text-[#244c21] truncate">{task.customer_phone || 'Phone unavailable'}</p>
          {task.customer_phone ? (
            <a
              href={`tel:${task.customer_phone}`}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#397239] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#244c21]"
            >
              Call User
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#397239]/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#397239]/40"
            >
              Call User
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-[#397234]/10 bg-white/60 p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#397239]/40">Pickup PIN</p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={pickupPinValues[task._id] || ''}
              onChange={(event) => handlePickupPinChange(task._id, event.target.value)}
              placeholder={task.pickupPin ? 'Enter generated PIN' : 'No PIN available'}
              className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm font-bold text-[#244c21] outline-none transition-all ${
                verifiedPickupPins[task._id]
                  ? 'border-green-400 bg-green-50'
                  : 'border-[#397234]/15 bg-white/80 focus:border-[#397239]'
              }`}
            />
            <button
              type="button"
              onClick={() => verifyPickupPin(task)}
              className="rounded-xl bg-[#244c21] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#397239]"
            >
              Verify
            </button>
          </div>
          {task.pickupPin && (
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#397239]/45">
              {verifiedPickupPins[task._id] ? 'PIN verified' : 'Enter the order PIN before completing'}
            </p>
          )}
        </div>
      </div>
      )}

      {!isCompleted && task.notes && (
        <div className="bg-amber-50/30 rounded-2xl p-3 mb-6 border border-amber-100/30">
          <p className="text-[9px] text-amber-600/50 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icons.Notes /> NOTES</p>
          <p className="text-[0.75rem] text-amber-900/80 mt-1 truncate">{task.notes}</p>
        </div>
      )}

      {!isCompleted && (
        <div className="flex gap-3">
          <button
            onClick={() => updateTaskStatus(task._id, 'En Route')}
            disabled={updatingTask === task._id || task.status === 'En Route'}
            className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              task.status === 'En Route'
                ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10'
            }`}
          >
            {updatingTask === task._id && task.status !== 'En Route' ? '...' : <><Icons.ActiveTasks /> En Route</>}
          </button>
          <button
            onClick={() => updateTaskStatus(task._id, 'Completed')}
            disabled={updatingTask === task._id}
            className="flex-1 py-3 rounded-2xl text-xs font-bold bg-white border border-emerald-200 text-emerald-700 transition-all hover:bg-emerald-50"
          >
            {updatingTask === task._id ? '...' : <><Icons.CompletedTasks /> Complete</>}
          </button>
        </div>
      )}

      {!isCompleted && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => cancelPickup(task)}
            disabled={confirmingOrderId === task._id}
            className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-700 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirmingOrderId === task._id ? 'Cancelling...' : 'Cancel Pickup'}
          </button>
        </div>
      )}
    </div>
  );

<<<<<<< HEAD
=======
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return `LKR ${value.toLocaleString()}`;
  };

  const formatOrderDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEstimatedAmount = (order) => order.servicePrice || SERVICE_PRICES[order.service_type] || order.estimated_amt || 0;
  const renderOrderDetailValue = (value) => value || 'N/A';
  const pendingOrderPins = getPendingOrderPins(pendingOrders);
  const unresolvedPendingOrders = pendingOrders.length - pendingOrderPins.length;

  const PendingOrdersPanel = () => (
    <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.4fr] gap-4 min-h-[540px]">
      <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-4 shadow-sm flex flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#244c21]">Pending Orders</h3>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">Orders waiting for pickup confirmation</p>
          </div>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#397239]">{pendingOrders.length} orders</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#397234]/10 bg-white/70 shadow-inner flex-1">
          <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-3 border-b border-[#397234]/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/50">
            <span>Order ID</span>
            <span>Pickup Address</span>
            <span>Estimated Amt</span>
            <span>Action</span>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <div className="flex h-[360px] items-center justify-center px-6 text-center">
                <p className="text-sm font-black uppercase tracking-widest text-[#397239]/50">No pending orders available</p>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div
                  key={order._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openPendingOrderDetails(order)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openPendingOrderDetails(order);
                    }
                  }}
                  className="grid w-full cursor-pointer grid-cols-[1.2fr_2fr_1fr_1fr] items-center gap-3 border-b border-[#397234]/10 px-4 py-4 text-left transition hover:bg-[#D6E9CA]/25 focus:bg-[#D6E9CA]/25 focus:outline-none last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-black text-[#244c21]">{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#397239]/40">{order.service_type || 'Order'}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#244c21]">{order.location || 'Location missing'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#397239]">{formatCurrency(getEstimatedAmount(order))}</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        confirmPickup(order);
                      }}
                      disabled={confirmingOrderId === order._id}
                      className="rounded-xl bg-[#397239] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#244c21] disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/20 p-4 shadow-sm flex flex-col min-h-[540px] overflow-hidden">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#244c21]">Pending Orders Map</h3>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">Pins for every pending pickup request</p>
          </div>
          <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#397239]">{pendingOrderPins.length} pins</div>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="flex-1 grid place-items-center rounded-3xl border border-dashed border-[#397234]/15 bg-white/60 text-center px-6">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-[#397239]/50">No map pins yet</p>
              <p className="mt-2 text-xs font-medium text-[#397239]/60">Pending pickups will appear here once customers submit requests.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden rounded-3xl border border-[#397234]/10 bg-white shadow-inner flex flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#397234]/10 bg-[#f7fbf4] px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/60">
              <span className="rounded-full bg-[#397239]/10 px-3 py-1 text-[#397239]">{pendingOrderPins.length} pinned</span>
              {unresolvedPendingOrders > 0 && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">{unresolvedPendingOrders} without coordinates</span>
              )}
              <span className="rounded-full bg-white px-3 py-1 text-[#397239]/70">OpenStreetMap live markers</span>
            </div>

            <PendingOrdersMapCanvas orders={pendingOrders} onOrderSelect={openPendingOrderDetails} />

            <div className="relative -mt-4 mx-4 mb-4 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#397239]/45">Pin directory</p>
                    <p className="mt-1 text-sm font-black text-[#244c21]">Quick access to each pickup target</p>
                  </div>
                  <span className="rounded-full bg-[#D6E9CA]/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#397239]">
                    {pendingOrderPins.length}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {pendingOrderPins.slice(0, 4).map(({ order, label, target }) => (
                    <button
                      key={order._id}
                      type="button"
                      onClick={() => openPendingOrderDetails(order)}
                      className="rounded-xl border border-[#397234]/10 bg-[#f8fbf5] px-3 py-2 text-left transition hover:bg-[#D6E9CA]/35"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#397239]/45">Pin {label}</p>
                          <p className="truncate text-xs font-bold text-[#244c21]">{order.location || target}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#397239] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                          Details
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Inquiry Panel ────────────────────────────────────────────────────────────
  const InquiriesPanel = () => (
    <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-5 shadow-sm">
      {/* Header row */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#244c21]">My Inquiries</h3>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">
            Inquiries submitted under your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#397239]">
            {inquiries.length} total
          </span>
          {pendingInquiriesCount > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
              {pendingInquiriesCount} pending
            </span>
          )}
          <button
            onClick={fetchInquiries}
            disabled={inquiriesLoading}
            className="rounded-xl border border-[#397234]/20 bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#397239] transition-all hover:bg-white disabled:opacity-50"
          >
            {inquiriesLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {inquiriesLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/40 animate-pulse" />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[#397239]/20 bg-[#D6E9CA]/20 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full border border-[#397234]/10 bg-[#397234]/5 text-[#397239]">
            <Icons.Inquiry />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#397239]/60">No inquiries found</p>
            <p className="mt-1 text-[10px] font-bold text-[#397239]/30 uppercase tracking-widest">
              Inquiries linked to your account will appear here
            </p>
          </div>
        </div>
      ) : (
        /* Inquiry list */
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const isExpanded = expandedInquiryId === inq._id;
            const isReplied = inq.status === 'Replied';

            return (
              <div
                key={inq._id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-[#397239]/30 bg-white shadow-md'
                    : 'border-[#397234]/15 bg-white/60 hover:bg-white/80 hover:border-[#397234]/25'
                }`}
              >
                {/* Collapsed header — always visible */}
                <button
                  type="button"
                  onClick={() => setExpandedInquiryId(isExpanded ? null : inq._id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Status dot */}
                    <span
                      className={`shrink-0 h-2.5 w-2.5 rounded-full ${
                        isReplied ? 'bg-[#397239]' : 'bg-amber-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#244c21] truncate">
                        {inq.subject || 'General Inquiry'}
                      </p>
                      <p className="text-[10px] font-bold text-[#397239]/40 uppercase tracking-widest mt-0.5">
                        {formatDateTime(inq.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
                        isReplied
                          ? 'bg-green-100 text-[#397239]'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="text-[#397239]/40">
                      {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                    </span>
                  </div>
                </button>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[#397234]/10">
                    {/* User info + message */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
                      {/* Left: meta */}
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-[#D6E9CA]/40 px-4 py-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#397239]/50">From</p>
                          <p className="mt-1 text-sm font-bold text-[#244c21]">{inq.userName}</p>
                          <p className="text-xs text-[#397239]/50 font-medium">{inq.userEmail}</p>
                        </div>
                        <div className="rounded-2xl bg-[#D6E9CA]/40 px-4 py-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#397239]/50">Submitted</p>
                          <p className="mt-1 text-xs font-bold text-[#244c21]">{formatDateTime(inq.createdAt)}</p>
                        </div>
                        {isReplied && inq.repliedAt && (
                          <div className="rounded-2xl bg-green-50 px-4 py-3 border border-green-100">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#397239]/50">Replied by</p>
                            <p className="mt-1 text-xs font-bold text-[#244c21]">{inq.repliedBy || 'Staff'}</p>
                            <p className="text-[10px] text-[#397239]/40 font-medium">{formatDateTime(inq.repliedAt)}</p>
                          </div>
                        )}
                      </div>

                      {/* Right: message + reply thread */}
                      <div className="space-y-3">
                        {/* Original message */}
                        <div className="rounded-2xl bg-[#D6E9CA]/30 px-4 py-3 border border-[#397234]/10">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#397239]/50 mb-2">Message</p>
                          <p className="text-sm text-[#244c21] font-medium leading-relaxed">{inq.message}</p>
                        </div>

                        {/* Existing reply */}
                        {isReplied && inq.adminReply && (
                          <div className="rounded-2xl bg-[#397239]/8 px-4 py-3 border border-[#397239]/15">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#397239]/60 mb-2 flex items-center gap-1.5">
                              <Icons.Send /> REPLY SENT
                            </p>
                            <p className="text-sm text-[#244c21] font-medium leading-relaxed">{inq.adminReply}</p>
                          </div>
                        )}

                        {/* Reply composer — always show so staff can update/add another reply */}
                        <div className="rounded-2xl bg-white border border-[#397234]/15 p-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#397239]/50 mb-2">
                            {isReplied ? 'Update Reply' : 'Write a Reply'}
                          </p>
                          <textarea
                            rows={3}
                            value={replyTexts[inq._id] || ''}
                            onChange={(e) =>
                              setReplyTexts((prev) => ({ ...prev, [inq._id]: e.target.value }))
                            }
                            placeholder="Type your reply here..."
                            className="w-full resize-none rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/20 px-3 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] focus:bg-white transition-all placeholder:text-[#397239]/30"
                          />
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleSendReply(inq._id)}
                              disabled={
                                !replyTexts[inq._id]?.trim() || sendingReply === inq._id
                              }
                              className="flex items-center gap-2 rounded-xl bg-[#397239] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#244c21] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Icons.Send />
                              {sendingReply === inq._id ? 'Sending...' : 'Send Reply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const SettingsPanel = () => (
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
            onClick={() => {
              setSettingsForm((prev) => ({ ...prev }));
              setSettingsMessage(null);
            }}
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

>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
  return (
    <div className="h-screen w-screen font-sans text-gray-900 bg-emerald-50/50 p-4 lg:p-3 overflow-hidden">
      <div className="flex h-full w-full gap-3">
<<<<<<< HEAD
        
        {/* Sidebar - Floating Rounded Card */}
        <aside className="hidden lg:flex flex-col gap-4 bg-emerald-900/40 backdrop-blur-xl border border-white/10 p-5 text-white w-[240px] shrink-0 rounded-3xl shadow-xl overflow-hidden h-full">
=======

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 bg-[#397234]/80 backdrop-blur-3xl border border-[#397234]/20 p-5 text-white/80 w-[240px] shrink-0 rounded-3xl shadow-2xl overflow-hidden h-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
          <div className="flex items-center gap-3 pb-2">
            <h1 className="m-0 text-2xl font-bold tracking-tight">Ecofy</h1>
          </div>

          <nav className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
<<<<<<< HEAD
                className={`flex justify-between items-center text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.key 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" 
                    : "text-emerald-100 hover:bg-white/10"
=======
                className={`flex justify-between items-center text-left text-sm font-bold px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.key
                    ? "bg-[#397239] text-white shadow-lg shadow-black/20"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count > 0 && (
<<<<<<< HEAD
                  <span className="bg-emerald-900/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
=======
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    item.key === 'inquiries'
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-white/10'
                  }`}>
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-white border border-white/5 backdrop-blur-sm shrink-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow-inner">{staffInitials}</div>
            <div className="min-w-0">
              <p className="m-0 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-300/80">Staff Portal</p>
              <p className="m-0 text-xs font-bold truncate">{staffName}</p>
              <button className="mt-0.5 cursor-pointer border-none bg-transparent p-0 text-[0.65rem] font-bold text-white/60 hover:text-white hover:underline transition-all" onClick={() => setShowLogoutModal(true)}>Logout</button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

          {/* Header */}
          <header className="mb-3 hidden lg:flex flex-row items-center justify-between py-1 px-2 shrink-0">
            <h2 className="m-0 text-2xl font-bold tracking-tight text-emerald-900 truncate">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative w-[280px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Search />
                </span>
                <input type="text" className="w-full rounded-2xl border border-emerald-100 bg-white/60 p-[8px_12px_8px_38px] text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-900/5 placeholder:text-gray-400" placeholder="Search tasks..." />
              </div>
              <div className="relative cursor-pointer" onClick={() => setActiveTab('pending')}>
                <div className={`grid h-9 w-9 place-items-center rounded-full border transition-all shadow-sm ${activeTab === 'pending' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-50'}`}>
                  <Icons.Bell />
                </div>
                {pendingTasks.length > 0 && (
                  <div className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">{pendingTasks.length}</div>
                )}
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white/60 px-3 py-1.5 text-xs font-bold text-emerald-900 backdrop-blur-sm">Staff</div>
              {!roleLoading && role === 'Admin' && (
<<<<<<< HEAD
                <button onClick={handleSwitchDashboard} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-700 shadow-md shadow-emerald-900/10">Switch to Admin</button>
=======
                <button onClick={handleSwitchDashboard} className="rounded-xl bg-[#397239] px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#244c21] shadow-md">Switch to Admin</button>
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
              )}
            </div>
          </header>

          {/* Scrollable Main Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar lg:pr-1">
            <div className="h-full">
              {notification && (
<<<<<<< HEAD
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl text-white font-bold text-sm bg-emerald-600 animate-in fade-in slide-in-from-top-4 duration-300">
=======
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl text-white font-black text-sm animate-in fade-in slide-in-from-top-4 duration-300 uppercase tracking-widest ${
                  notification.type === 'error' ? 'bg-red-500' : 'bg-[#397239]'
                }`}>
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
                  {notification.message}
                </div>
              )}

<<<<<<< HEAD
              {/* Stats Bar (Clickable with Glow Effect) */}
              <section className="grid grid-cols-3 gap-3 mb-4">
                <button 
                  onClick={() => setActiveTab('pending')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 bg-white/40 backdrop-blur-md ${
                    activeTab === 'pending' 
                      ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-white/70' 
                      : 'border-emerald-200/40 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <p className="text-2xl font-bold leading-none text-emerald-700">
                    {pendingTasks.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-emerald-600/60">
                    Pending
                  </p>
                </button>

                <button 
                  onClick={() => setActiveTab('active')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 bg-white/40 backdrop-blur-md ${
                    activeTab === 'active' 
                      ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-white/70' 
                      : 'border-emerald-200/40 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <p className="text-2xl font-bold leading-none text-emerald-700">
                    {ongoingTasks.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-emerald-600/60">
                    Active
                  </p>
                </button>

                <button 
                  onClick={() => setActiveTab('completed')}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 bg-white/40 backdrop-blur-md ${
                    activeTab === 'completed' 
                      ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-white/70' 
                      : 'border-emerald-200/40 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <p className="text-2xl font-bold leading-none text-emerald-700">
                    {completedTasks.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-emerald-600/60">
                    Completed
                  </p>
                </button>
              </section>

              {/* Task Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
=======
              <div className={`grid grid-cols-1 gap-4 ${activeTab === 'active' || activeTab === 'completed' ? '' : 'md:grid-cols-2'}`}>
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
                {activeTab === 'pending' && (
                  pendingTasks.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-emerald-200 bg-white/20 p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Icons.PendingTasks /></div>
                      <p className="text-emerald-900/60 font-bold tracking-tight">All caught up! No pending tasks.</p>
                    </div>
                  ) : (
                    pendingTasks.map((task) => renderTaskCard(task))
                  )
                )}

                {activeTab === 'inquiries' && (
                  <div className="col-span-full">
                    <InquiriesPanel />
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="col-span-full">
                    {settingsLoading ? (
                      <div className="rounded-3xl border border-dashed border-[#397239]/20 bg-[#D6E9CA]/20 p-12 text-center text-[#397239]/60 font-black uppercase tracking-widest text-[10px]">
                        Loading settings...
                      </div>
                    ) : (
                      <SettingsPanel />
                    )}
                  </div>
                )}

                {activeTab === 'active' && (
                  ongoingTasks.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-emerald-200 bg-white/20 p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Icons.ActiveTasks /></div>
                      <p className="text-emerald-900/60 font-bold tracking-tight">No active tasks in progress.</p>
                    </div>
                  ) : (
                    ongoingTasks.map((task) => (
                      <div key={task._id} className="col-span-full">
                        {renderTaskCard(task)}
                      </div>
                    ))
                  )
                )}

                {activeTab === 'completed' && (
                  completedTasks.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-emerald-200 bg-white/20 p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Icons.CompletedTasks /></div>
                      <p className="text-emerald-900/60 font-bold tracking-tight">No tasks completed yet today.</p>
                    </div>
                  ) : (
                    completedTasks.map((task) => (
                      <div key={task._id} className="col-span-full">
                        {renderTaskCard(task, true)}
                      </div>
                    ))
                  )
                )}
              </div>
              <footer className="mt-8 text-[0.75rem] text-emerald-800/40 pb-6 text-center">&copy; 2026 Ecofy Waste Management</footer>
            </div>
          </main>
        </div>
      </div>

<<<<<<< HEAD
      {/* Mobile Elements */}
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-emerald-100/50 bg-emerald-900/95 px-4 py-2.5 text-white backdrop-blur-xl lg:hidden">
=======
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-[#112A0F] px-4 py-2.5 text-white backdrop-blur-xl lg:hidden">
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0"><h2 className="truncate text-base font-bold leading-tight">{getPageTitle()}</h2></div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white"><Icons.Menu /></button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-4 top-4 bottom-4 flex w-[86%] max-w-[300px] flex-col gap-4 overflow-y-auto bg-emerald-900/90 backdrop-blur-xl p-5 text-white shadow-2xl border border-white/10 rounded-3xl">
            <div className="flex items-center justify-between gap-2 pb-2">
              <h1 className="m-0 text-lg font-bold">Ecofy</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 text-xs font-bold">✕</button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
<<<<<<< HEAD
                <button key={item.key} onClick={() => { setActiveTab(item.key); setIsMobileMenuOpen(false); }} className={`flex justify-between items-center text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all ${activeTab === item.key ? "bg-emerald-600" : "hover:bg-white/10"}`}>
                   <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                   {item.count > 0 && <span className="text-[10px] opacity-60">{item.count}</span>}
=======
                <button key={item.key} onClick={() => { setActiveTab(item.key); setIsMobileMenuOpen(false); }} className={`flex justify-between items-center text-left text-sm font-bold px-4 py-3 rounded-xl transition-all ${activeTab === item.key ? "bg-[#397239] text-white shadow-lg" : "hover:bg-white/10"}`}>
                  <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                  {item.count > 0 && <span className="text-[10px] opacity-60">{item.count}</span>}
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
                </button>
              ))}
            </nav>
            <button onClick={handleSignOut} className="mt-auto w-full rounded-xl bg-white py-2.5 text-xs font-bold text-emerald-900">Logout</button>
          </aside>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-3xl bg-white p-6 text-center shadow-2xl">
            <h3 className="mb-2 text-xl font-bold text-emerald-900 tracking-tight">Confirm Sign Out</h3>
            <p className="mb-6 text-sm text-gray-500">Are you sure you want to exit the Staff Portal?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 rounded-2xl bg-gray-100 py-3 text-sm font-bold text-gray-600">Cancel</button>
              <button onClick={handleSignOut} className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20">Sign Out</button>
            </div>
          </div>
        </div>
      )}

      {selectedPendingOrder && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/20 bg-[#f4f9f4] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-[#397234]/10 bg-white/85 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#397239]/50">Pending order details</p>
                <h3 className="mt-1 text-2xl font-black text-[#244c21]">
                  Order #{selectedPendingOrder._id?.slice(-8)?.toUpperCase() || 'N/A'}
                </h3>
                <p className="mt-1 text-sm font-bold text-[#397239]/70">
                  {renderOrderDetailValue(selectedPendingOrder.location)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPendingOrder(null)}
                className="rounded-full border border-[#397234]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-[#397239] transition hover:bg-[#D6E9CA]/40"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2">
              <section className="rounded-2xl border border-[#397234]/10 bg-white/85 p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#397239]/45">Customer</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-[#397239]/45">Name</dt>
                    <dd className="mt-1 font-black text-[#244c21]">{renderOrderDetailValue(selectedPendingOrder.customer_name)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-[#397239]/45">Email</dt>
                    <dd className="mt-1 break-words font-bold text-[#244c21]">{renderOrderDetailValue(selectedPendingOrder.customer_email)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-[#397239]/45">Phone</dt>
                    <dd className="mt-1 font-bold text-[#244c21]">{renderOrderDetailValue(selectedPendingOrder.customer_phone)}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-2xl border border-[#397234]/10 bg-white/85 p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#397239]/45">Pickup</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-[#397239]/45">Service</dt>
                    <dd className="mt-1 font-black text-[#244c21]">{renderOrderDetailValue(selectedPendingOrder.service_type)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-[#397239]/45">Waste</dt>
                    <dd className="mt-1 font-bold text-[#244c21]">{renderOrderDetailValue(selectedPendingOrder.waste_category)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-[#397239]/45">Date</dt>
                    <dd className="mt-1 font-bold text-[#244c21]">{formatOrderDate(selectedPendingOrder.scheduled_date)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-[#397239]/45">PIN</dt>
                    <dd className="mt-1 font-black text-[#244c21]">{renderOrderDetailValue(selectedPendingOrder.pickupPin)}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-2xl border border-[#397234]/10 bg-white/85 p-4 shadow-sm md:col-span-2">
                <div className="grid gap-4 md:grid-cols-[1fr_0.6fr]">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#397239]/45">Address</p>
                    <p className="mt-2 text-sm font-bold leading-relaxed text-[#244c21]">
                      {renderOrderDetailValue(selectedPendingOrder.location)}
                    </p>
                    {selectedPendingOrder.notes && (
                      <>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#397239]/45">Notes</p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-[#244c21]">{selectedPendingOrder.notes}</p>
                      </>
                    )}
                  </div>
                  <div className="rounded-2xl bg-[#D6E9CA]/45 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#397239]/45">Estimated amount</p>
                    <p className="mt-2 text-2xl font-black text-[#244c21]">
                      {formatCurrency(getEstimatedAmount(selectedPendingOrder))}
                    </p>
                    <p className="mt-2 text-xs font-bold text-[#397239]/60">
                      Status: {selectedPendingOrder.status || 'Pending'}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#397234]/10 bg-white/80 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedPendingOrder(null);
                  openNavigationForOrder(selectedPendingOrder);
                }}
                className="rounded-2xl border border-[#397234]/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-[#397239] transition hover:bg-[#D6E9CA]/40"
              >
                View route
              </button>
              <button
                type="button"
                onClick={() => confirmPickup(selectedPendingOrder)}
                disabled={confirmingOrderId === selectedPendingOrder._id}
                className="rounded-2xl bg-[#397239] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#244c21] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirmingOrderId === selectedPendingOrder._id ? 'Confirming...' : 'Confirm Pickup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showNavigationModal && navigationOrder && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/20 bg-[#f4f9f4] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-[#397234]/10 bg-white/80 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#397239]/50">Pickup route</p>
                <h3 className="mt-1 text-2xl font-black text-[#244c21]">Leaflet + OSRM navigation</h3>
                <p className="mt-1 text-sm font-medium text-[#397239]/70">
                  {navigationOrder.location || 'Location not available'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNavigationModal(false)}
                className="rounded-full border border-[#397234]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-[#397239] transition hover:bg-[#D6E9CA]/40"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="overflow-hidden rounded-[1.5rem] border border-[#397234]/10 bg-white shadow-inner min-h-[520px]">
                <PickupNavigationMap order={navigationOrder} />
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-[#397234]/10 bg-white/90 p-5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/40">Destination</p>
                    <p className="mt-1 text-sm font-bold text-[#244c21]">{navigationOrder.location || 'Location not available'}</p>
                  </div>

                  <div className="rounded-2xl bg-[#D6E9CA]/35 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/40">Order</p>
                    <p className="mt-1 text-sm font-black text-[#244c21]">{navigationOrder._id?.slice(-8)?.toUpperCase() || 'N/A'}</p>
                    <p className="text-xs font-medium text-[#397239]/60">{navigationOrder.service_type || 'Pickup'}</p>
                  </div>

                  <div className="rounded-2xl bg-[#D6E9CA]/35 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/40">Navigation</p>
                    <p className="mt-1 text-xs font-medium text-[#397239]/60">Use your current location inside the map to draw the OSRM route line, then open the same path in OpenStreetMap directions if needed.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNavigationModal(false)}
                    className="rounded-2xl bg-[#397239] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#244c21]"
                  >
                    Close route view
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNavigationModal(false);
                      setNavigationOrder(null);
                    }}
                    className="rounded-2xl border border-[#397234]/10 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-[#397239] transition hover:bg-[#D6E9CA]/40"
                  >
                    Back to dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
