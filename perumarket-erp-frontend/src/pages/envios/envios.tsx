import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiTruck,
  FiMap,
  FiUser,
  FiPackage,
  FiSearch,
  FiX,
  FiChevronRight,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiAlertCircle
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { envioService } from "../../services/envios/envioService";
import type {
  EnvioResponse,
  EnvioRequest,
  Vehiculo,
  Conductor,
  Ruta,
  VentaResumen
} from "../../services/envios/envioService";

// Fix leaflet default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 16); }, [map, lat, lng]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type TabType = "envios" | "conductores" | "rutas";

const DEFAULT_LAT = -12.0464;
const DEFAULT_LNG = -77.0428;

const getNombreConductor = (c: Conductor) =>
  `${c.nombres ?? ""} ${c.apellidoPaterno ?? ""}`.trim() || "Sin nombre";

export default function Envios() {
  const {
    isDark, colors, pageBg, heading, textTertiary, textSecondary,
    card, cardHover, input, border, btnPrimary, btnSecondary, btnGhost,
    tabActive, tabInactive, tableHeader, tableHeaderText, tableRow, tableCell,
    modalOverlay, modalContent, modalHeader, subtleBg, searchBg, shadow,
    badgeSuccess, badgeDanger, badgeWarning, badgeInfo, emptyState, spinnerColor
  } = useThemeClasses();

  const [activeTab, setActiveTab] = useState<TabType>("envios");

  // Data
  const [envios, setEnvios] = useState<EnvioResponse[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [ventas, setVentas] = useState<VentaResumen[]>([]);
  const [conductorVehiculoMap, setConductorVehiculoMap] = useState<Record<number, number>>({});

  // UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: TabType; id: number; label: string } | null>(null);

  // Envio
  const [envioSeleccionado, setEnvioSeleccionado] = useState<EnvioResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [envioForm, setEnvioForm] = useState({
    idVenta: "", idConductor: "", idRuta: "",
    direccionEnvio: "", costoTransporte: "", observaciones: "",
    fechaEnvio: "", fechaEntrega: ""
  });

  // Map
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number }>({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [hasMarker, setHasMarker] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [reversingGeocode, setReversingGeocode] = useState(false);
  const addressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Conductor (with vehicle)
  const [conductorEdit, setConductorEdit] = useState<Conductor | null>(null);
  const [conductorForm, setConductorForm] = useState({
    nombres: "", apellidoPaterno: "", apellidoMaterno: "", telefono: "", numeroDocumento: "",
    licencia: "", categoriaLicencia: "",
    placa: "", marca: "", modelo: "", capacidadKg: ""
  });

  // Ruta
  const [rutaEdit, setRutaEdit] = useState<Ruta | null>(null);
  const [rutaForm, setRutaForm] = useState({
    nombre: "", origen: "", destino: "", distanciaKm: "", tiempoEstimadoHoras: "", costoBase: ""
  });

  // ── Fetch data ──
  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [e, v, c, r, vt] = await Promise.all([
        envioService.fetchEnvios(),
        envioService.fetchVehiculos(),
        envioService.fetchConductores(),
        envioService.fetchRutas(),
        envioService.fetchVentas(),
      ]);
      setEnvios(e); setVehiculos(v); setConductores(c); setRutas(r); setVentas(vt);
      const cvMap: Record<number, number> = {};
      for (const env of e) {
        if (env.nombreConductor && env.placaVehiculo) {
          const cMatch = c.find((cd) => getNombreConductor(cd) === env.nombreConductor);
          const vMatch = v.find((vh) => vh.placa === env.placaVehiculo);
          if (cMatch && vMatch) cvMap[cMatch.id] = vMatch.id;
        }
      }
      setConductorVehiculoMap((prev) => ({ ...cvMap, ...prev }));
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally { setLoading(false); }
  };

  // ── Computed ──
  const enviosFiltrados = useMemo(() => {
    return envios.filter((envio) => {
      const term = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        String(envio.id).includes(term) ||
        (envio.nombreCliente ?? "").toLowerCase().includes(term) ||
        (envio.direccionEnvio ?? "").toLowerCase().includes(term) ||
        (envio.nombreRuta ?? "").toLowerCase().includes(term);
      const matchEstado = !filterEstado || envio.estado === filterEstado;
      return matchSearch && matchEstado;
    });
  }, [envios, searchTerm, filterEstado]);

  const ventasDisponibles = useMemo(() => {
    const conEnvio = new Set(envios.map((e) => e.idVenta).filter(Boolean));
    return ventas.filter((v) => v.estado === "PENDIENTE" && !conEnvio.has(v.id));
  }, [ventas, envios]);

  const getVehiculoForConductor = useCallback((conductorId: number): Vehiculo | null => {
    const vId = conductorVehiculoMap[conductorId];
    if (!vId) return null;
    return vehiculos.find((v) => v.id === vId) ?? null;
  }, [conductorVehiculoMap, vehiculos]);

  // ── Address search (Nominatim) ──
  const searchAddress = useCallback((query: string) => {
    if (addressTimeout.current) clearTimeout(addressTimeout.current);
    if (query.length < 3) { setAddressSuggestions([]); setShowSuggestions(false); return; }
    setSearchingAddress(true);
    addressTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=pe&limit=5&addressdetails=1`
        );
        const data: NominatimResult[] = await res.json();
        setAddressSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch { setAddressSuggestions([]); }
      finally { setSearchingAddress(false); }
    }, 400);
  }, []);

  const selectAddress = (result: NominatimResult) => {
    setEnvioForm((p) => ({ ...p, direccionEnvio: result.display_name }));
    setMapCoords({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setHasMarker(true);
    setShowSuggestions(false);
  };

  // ── Reverse geocode (click on map) ──
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setMapCoords({ lat, lng });
    setHasMarker(true);
    setReversingGeocode(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await res.json();
      if (data.display_name) {
        setEnvioForm((p) => ({ ...p, direccionEnvio: data.display_name }));
      }
    } catch (err) {
      console.error("Error reverse geocoding:", err);
    } finally { setReversingGeocode(false); }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── KPI ──
  const kpiTotal = envios.length;
  const kpiEnRuta = envios.filter((e) => e.estado === "EN_RUTA").length;
  const kpiPendientes = envios.filter((e) => e.estado === "PENDIENTE").length;
  const kpiEntregados = envios.filter((e) => e.estado === "ENTREGADO").length;

  // ── Style helpers ──
  const getEstadoStyle = (estado: string) => {
    const m: Record<string, string> = {
      ENTREGADO: badgeSuccess, EN_RUTA: badgeInfo, PENDIENTE: badgeWarning, CANCELADO: badgeDanger,
      DISPONIBLE: badgeSuccess, ACTIVO: badgeSuccess,
      INACTIVO: isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600",
      MANTENIMIENTO: isDark ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-700",
    };
    return m[estado] ?? (isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600");
  };

  const inputCl = `w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${input}`;
  const labelCl = `block text-sm font-medium mb-1.5 ${textSecondary}`;
  const cardCl = `${card} border rounded-xl`;

  const formatDate = (d: string | null) => {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("es-PE"); } catch { return d; }
  };

  // ══════════════ ENVIO HANDLERS ══════════════
  const resetEnvioForm = () => {
    setEnvioForm({ idVenta: "", idConductor: "", idRuta: "", direccionEnvio: "", costoTransporte: "", observaciones: "", fechaEnvio: "", fechaEntrega: "" });
    setIsEditing(false); setEnvioSeleccionado(null);
    setMapCoords({ lat: DEFAULT_LAT, lng: DEFAULT_LNG }); setHasMarker(false);
    setAddressSuggestions([]); setShowSuggestions(false);
  };

  const handleNuevoEnvio = () => { resetEnvioForm(); setShowModal(true); };

  const handleEditarEnvio = (envio: EnvioResponse) => {
    setEnvioSeleccionado(envio); setIsEditing(true);
    const cMatch = conductores.find((c) => getNombreConductor(c) === envio.nombreConductor);
    const rMatch = rutas.find((r) => r.nombre === envio.nombreRuta);
    setEnvioForm({
      idVenta: envio.idVenta != null ? String(envio.idVenta) : "",
      idConductor: cMatch ? String(cMatch.id) : "",
      idRuta: rMatch ? String(rMatch.id) : "",
      direccionEnvio: envio.direccionEnvio ?? "",
      costoTransporte: envio.costoTransporte != null ? String(envio.costoTransporte) : "",
      observaciones: envio.observaciones ?? "",
      fechaEnvio: envio.fechaEnvio ?? "",
      fechaEntrega: envio.fechaEntrega ?? "",
    });
    setMapCoords({ lat: DEFAULT_LAT, lng: DEFAULT_LNG }); setHasMarker(false);
    setShowModal(true);
  };

  const handleSubmitEnvio = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    let idVehiculo: number | undefined;
    if (envioForm.idConductor) {
      const veh = getVehiculoForConductor(Number(envioForm.idConductor));
      if (veh) idVehiculo = veh.id;
    }
    const payload: EnvioRequest = {
      direccionEnvio: envioForm.direccionEnvio,
      ...(envioForm.idVenta ? { idVenta: Number(envioForm.idVenta) } : {}),
      ...(idVehiculo ? { idVehiculo } : {}),
      ...(envioForm.idConductor ? { idConductor: Number(envioForm.idConductor) } : {}),
      ...(envioForm.idRuta ? { idRuta: Number(envioForm.idRuta) } : {}),
      ...(envioForm.costoTransporte ? { costoTransporte: Number(envioForm.costoTransporte) } : {}),
      ...(envioForm.observaciones ? { observaciones: envioForm.observaciones } : {}),
      ...(envioForm.fechaEnvio ? { fechaEnvio: envioForm.fechaEnvio } : {}),
      ...(envioForm.fechaEntrega ? { fechaEntrega: envioForm.fechaEntrega } : {}),
    };
    try {
      if (isEditing && envioSeleccionado) await envioService.actualizarEnvio(envioSeleccionado.id, payload);
      else await envioService.crearEnvio(payload);
      await cargarDatos(); setShowModal(false); resetEnvioForm();
    } catch (error) { console.error("Error al guardar envio:", error); }
    finally { setSaving(false); }
  };

  const cambiarEstado = async (envioId: number, nuevoEstado: string) => {
    try { await envioService.actualizarEstado(envioId, nuevoEstado); await cargarDatos(); }
    catch (error) { console.error("Error al cambiar estado:", error); }
  };

  // ══════════════ CONDUCTOR HANDLERS ══════════════
  const resetConductorForm = () => { setConductorForm({ nombres: "", apellidoPaterno: "", apellidoMaterno: "", telefono: "", numeroDocumento: "", licencia: "", categoriaLicencia: "", placa: "", marca: "", modelo: "", capacidadKg: "" }); setConductorEdit(null); setIsEditing(false); };
  const handleNuevoConductor = () => { resetConductorForm(); setShowModal(true); };
  const handleEditarConductor = (c: Conductor) => {
    setConductorEdit(c); setIsEditing(true);
    const veh = getVehiculoForConductor(c.id);
    setConductorForm({ nombres: c.nombres ?? "", apellidoPaterno: c.apellidoPaterno ?? "", apellidoMaterno: c.apellidoMaterno ?? "", telefono: c.telefono ?? "", numeroDocumento: c.numeroDocumento ?? "", licencia: c.licencia, categoriaLicencia: c.categoriaLicencia ?? "", placa: veh?.placa ?? "", marca: veh?.marca ?? "", modelo: veh?.modelo ?? "", capacidadKg: veh?.capacidadKg ? String(veh.capacidadKg) : "" });
    setShowModal(true);
  };

  const handleSubmitConductor = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (isEditing && conductorEdit) {
        await envioService.actualizarConductor(conductorEdit.id, { nombres: conductorForm.nombres, apellidoPaterno: conductorForm.apellidoPaterno, apellidoMaterno: conductorForm.apellidoMaterno || undefined, telefono: conductorForm.telefono || undefined, numeroDocumento: conductorForm.numeroDocumento || undefined, licencia: conductorForm.licencia, categoriaLicencia: conductorForm.categoriaLicencia || undefined });
        const existingVeh = getVehiculoForConductor(conductorEdit.id);
        if (conductorForm.placa) {
          const vPayload = { placa: conductorForm.placa, marca: conductorForm.marca || undefined, modelo: conductorForm.modelo || undefined, capacidadKg: conductorForm.capacidadKg ? Number(conductorForm.capacidadKg) : undefined };
          if (existingVeh) await envioService.actualizarVehiculo(existingVeh.id, vPayload);
          else { const nv = await envioService.crearVehiculo(vPayload); setConductorVehiculoMap((p) => ({ ...p, [conductorEdit.id]: nv.id })); }
        }
      } else {
        let newVehiculoId: number | undefined;
        if (conductorForm.placa) {
          const veh = await envioService.crearVehiculo({ placa: conductorForm.placa, marca: conductorForm.marca || undefined, modelo: conductorForm.modelo || undefined, capacidadKg: conductorForm.capacidadKg ? Number(conductorForm.capacidadKg) : undefined });
          newVehiculoId = veh.id;
        }
        const nc = await envioService.crearConductor({ nombres: conductorForm.nombres, apellidoPaterno: conductorForm.apellidoPaterno, apellidoMaterno: conductorForm.apellidoMaterno || undefined, telefono: conductorForm.telefono || undefined, numeroDocumento: conductorForm.numeroDocumento || undefined, licencia: conductorForm.licencia, categoriaLicencia: conductorForm.categoriaLicencia || undefined });
        if (newVehiculoId) setConductorVehiculoMap((p) => ({ ...p, [nc.id]: newVehiculoId }));
      }
      await cargarDatos(); setShowModal(false); resetConductorForm();
    } catch (error) { console.error("Error al guardar conductor:", error); }
    finally { setSaving(false); }
  };

  // ══════════════ RUTA HANDLERS ══════════════
  const resetRutaForm = () => { setRutaForm({ nombre: "", origen: "", destino: "", distanciaKm: "", tiempoEstimadoHoras: "", costoBase: "" }); setRutaEdit(null); setIsEditing(false); };
  const handleNuevaRuta = () => { resetRutaForm(); setShowModal(true); };
  const handleEditarRuta = (r: Ruta) => {
    setRutaEdit(r); setIsEditing(true);
    setRutaForm({ nombre: r.nombre, origen: r.origen, destino: r.destino, distanciaKm: r.distanciaKm ? String(r.distanciaKm) : "", tiempoEstimadoHoras: r.tiempoEstimadoHoras ? String(r.tiempoEstimadoHoras) : "", costoBase: r.costoBase ? String(r.costoBase) : "" });
    setShowModal(true);
  };

  const handleSubmitRuta = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { nombre: rutaForm.nombre, origen: rutaForm.origen, destino: rutaForm.destino, distanciaKm: rutaForm.distanciaKm ? Number(rutaForm.distanciaKm) : undefined, tiempoEstimadoHoras: rutaForm.tiempoEstimadoHoras ? Number(rutaForm.tiempoEstimadoHoras) : undefined, costoBase: rutaForm.costoBase ? Number(rutaForm.costoBase) : undefined };
    try {
      if (isEditing && rutaEdit) await envioService.actualizarRuta(rutaEdit.id, payload);
      else await envioService.crearRuta(payload);
      await cargarDatos(); setShowModal(false); resetRutaForm();
    } catch (error) { console.error("Error al guardar ruta:", error); }
    finally { setSaving(false); }
  };

  // ══════════════ DELETE ══════════════
  const handleDelete = (type: TabType, id: number, label: string) => { setDeleteTarget({ type, id, label }); setShowDeleteModal(true); };
  const confirmarEliminar = async () => {
    if (!deleteTarget) return;
    try {
      switch (deleteTarget.type) {
        case "envios": await envioService.eliminarEnvio(deleteTarget.id); break;
        case "conductores": { const veh = getVehiculoForConductor(deleteTarget.id); await envioService.eliminarConductor(deleteTarget.id); if (veh) { try { await envioService.eliminarVehiculo(veh.id); } catch { /* ignore */ } } break; }
        case "rutas": await envioService.eliminarRuta(deleteTarget.id); break;
      }
      await cargarDatos();
    } catch (error) { console.error("Error al eliminar:", error); }
    finally { setShowDeleteModal(false); setDeleteTarget(null); }
  };

  // ══════════════ HELPERS ══════════════
  const closeModal = () => { setShowModal(false); resetEnvioForm(); resetConductorForm(); resetRutaForm(); };
  const handleNuevo = () => { switch (activeTab) { case "envios": handleNuevoEnvio(); break; case "conductores": handleNuevoConductor(); break; case "rutas": handleNuevaRuta(); break; } };

  const Skeleton = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-gray-700/50" : "bg-gray-100"}`} />
      ))}
    </div>
  );

  const tabs: { key: TabType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "envios", label: "Envios", icon: <FiTruck size={18} />, count: envios.length },
    { key: "conductores", label: "Conductores", icon: <FiUser size={18} />, count: conductores.length },
    { key: "rutas", label: "Rutas", icon: <FiMap size={18} />, count: rutas.length },
  ];

  const btnLabel: Record<TabType, string> = { envios: "Nuevo Envio", conductores: "Nuevo Conductor", rutas: "Nueva Ruta" };

  // ══════════════ RENDER ══════════════
  return (
    <div className={`w-full min-h-screen ${pageBg}`}>
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}>
              <FiTruck size={24} />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${heading}`}>Gestion de Envios</h1>
              <p className={`mt-1 text-sm ${textTertiary}`}>Administra envios, conductores y rutas</p>
            </div>
          </div>
          <button onClick={handleNuevo} className={`${btnPrimary} flex items-center gap-2 px-5 py-3 rounded-xl w-full sm:w-auto justify-center`}>
            <FiPlus size={18} /> {btnLabel[activeTab]}
          </button>
        </div>

        {/* KPI Cards */}
        {activeTab === "envios" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              { label: "Total", value: kpiTotal, icon: <FiPackage /> },
              { label: "En Ruta", value: kpiEnRuta, icon: <FiTruck /> },
              { label: "Pendientes", value: kpiPendientes, icon: <FiClock /> },
              { label: "Entregados", value: kpiEntregados, icon: <FiPackage /> },
            ].map((kpi, idx) => (
              <div key={kpi.label} className={`${cardCl} p-4 ${shadow} hover:shadow-md transition-shadow`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg text-white" style={{ backgroundColor: idx === 0 ? colors[600] : idx === 1 ? colors[500] : idx === 2 ? "#d97706" : "#16a34a" }}>
                    <span className="text-lg">{kpi.icon}</span>
                  </div>
                  <div>
                    <p className={`text-xs ${textTertiary}`}>{kpi.label}</p>
                    <p className={`text-xl font-bold ${heading}`}>{loading ? "-" : kpi.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto ${isDark ? "bg-gray-800/60" : "bg-gray-100"}`}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key ? tabActive : tabInactive
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : isDark ? "bg-gray-700 text-gray-500" : "bg-gray-200/80 text-gray-500"
              }`}>
                {loading ? "..." : tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters (envios only) */}
        {activeTab === "envios" && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${textTertiary}`} />
              <input
                type="text"
                placeholder="Buscar por ID, cliente, direccion, ruta..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:border-transparent ${searchBg}`}
                style={{ focusRingColor: colors[500] } as React.CSSProperties}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className={`w-full sm:w-48 px-4 py-3 rounded-xl border focus:ring-2 focus:border-transparent ${searchBg}`}
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_RUTA">En Ruta</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        )}

        {/* ═══════ TAB: ENVIOS ═══════ */}
        {activeTab === "envios" && (
          <div className={`${cardCl} ${shadow} overflow-hidden`}>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={tableHeader}>
                  <tr>
                    {["#ID", "Venta", "Cliente", "Direccion", "Conductor / Vehiculo", "Ruta", "Fecha", "Estado", "Acciones"].map((h) => (
                      <th key={h} className={`p-3 text-left text-xs font-semibold uppercase tracking-wider ${tableHeaderText}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={9}><Skeleton count={5} /></td></tr> :
                   enviosFiltrados.length === 0 ? (
                    <tr><td colSpan={9} className={`p-12 text-center ${emptyState}`}>
                      <FiAlertCircle className="mx-auto mb-2 text-3xl opacity-40" />
                      No se encontraron envios
                    </td></tr>
                  ) : enviosFiltrados.map((envio) => (
                    <tr key={envio.id} className={`border-b transition-colors ${tableRow}`}>
                      <td className={`p-3 font-semibold ${heading}`}>{envio.id}</td>
                      <td className="p-3 font-medium" style={{ color: colors[500] }}>#{envio.idVenta ?? "-"}</td>
                      <td className={`p-3 ${tableCell}`}>{envio.nombreCliente ?? "-"}</td>
                      <td className={`p-3 max-w-[180px] truncate ${tableCell}`}>{envio.direccionEnvio ?? "-"}</td>
                      <td className={`p-3 ${tableCell}`}>
                        <div>{envio.nombreConductor ?? "-"}</div>
                        {envio.placaVehiculo && <div className={`text-xs ${textTertiary}`}><FiTruck className="inline mr-1" size={11} />{envio.placaVehiculo}</div>}
                      </td>
                      <td className={`p-3 ${tableCell}`}>{envio.nombreRuta ?? "-"}</td>
                      <td className={`p-3 ${tableCell}`}>{formatDate(envio.fechaEnvio)}</td>
                      <td className="p-3">
                        <select value={envio.estado} onChange={(e) => cambiarEstado(envio.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs border-0 cursor-pointer ${getEstadoStyle(envio.estado)}`}>
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="EN_RUTA">EN RUTA</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1.5 justify-center">
                          <button onClick={() => { setEnvioSeleccionado(envio); setShowDetailModal(true); }} className={`p-2 rounded-lg transition-colors ${btnGhost}`} style={{ color: colors[500] }} title="Ver"><FiEye size={16} /></button>
                          <button onClick={() => handleEditarEnvio(envio)} className={`p-2 rounded-lg transition-colors ${btnGhost}`} title="Editar"><FiEdit size={16} /></button>
                          <button onClick={() => handleDelete("envios", envio.id, `Envio #${envio.id}`)} className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-red-900/30 text-red-400" : "hover:bg-red-50 text-red-600"}`} title="Eliminar"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="block lg:hidden p-4 space-y-3">
              {loading ? <Skeleton count={3} /> :
               enviosFiltrados.length === 0 ? (
                <p className={`text-center py-8 ${emptyState}`}>No se encontraron envios</p>
              ) : enviosFiltrados.map((envio) => (
                <div key={envio.id} className={`${cardCl} p-4`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className={`font-bold text-lg ${heading}`}>#{envio.id}</p>
                      <p className="text-sm font-medium" style={{ color: colors[500] }}>Venta #{envio.idVenta ?? "-"}</p>
                      <p className={`text-sm ${textTertiary}`}>{envio.nombreCliente ?? "-"}</p>
                    </div>
                    <select value={envio.estado} onChange={(e) => cambiarEstado(envio.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 cursor-pointer ${getEstadoStyle(envio.estado)}`}>
                      <option value="PENDIENTE">PENDIENTE</option><option value="EN_RUTA">EN RUTA</option><option value="ENTREGADO">ENTREGADO</option><option value="CANCELADO">CANCELADO</option>
                    </select>
                  </div>
                  <div className={`grid grid-cols-2 gap-2 text-xs mb-3 ${textTertiary}`}>
                    <div><FiUser className="inline mr-1" />{envio.nombreConductor ?? "-"}</div>
                    <div><FiTruck className="inline mr-1" />{envio.placaVehiculo ?? "-"}</div>
                    <div><FiMap className="inline mr-1" />{envio.nombreRuta ?? "-"}</div>
                    <div><FiClock className="inline mr-1" />{formatDate(envio.fechaEnvio)}</div>
                  </div>
                  {envio.direccionEnvio && <p className={`text-xs mb-3 ${textTertiary}`}><FiMapPin className="inline mr-1" />{envio.direccionEnvio}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => { setEnvioSeleccionado(envio); setShowDetailModal(true); }} className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-xs text-white" style={{ backgroundColor: colors[500] }}><FiEye size={14} /> Ver</button>
                    <button onClick={() => handleEditarEnvio(envio)} className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium ${btnSecondary}`}><FiEdit size={14} /> Editar</button>
                    <button onClick={() => handleDelete("envios", envio.id, `Envio #${envio.id}`)} className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium ${isDark ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600"}`}><FiTrash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ TAB: CONDUCTORES ═══════ */}
        {activeTab === "conductores" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? <Skeleton count={6} /> :
             conductores.length === 0 ? (
              <div className={`sm:col-span-2 lg:col-span-3 text-center py-12 ${emptyState}`}>
                <FiUser className="mx-auto mb-2 text-4xl opacity-30" />
                <p>No hay conductores registrados</p>
              </div>
            ) : conductores.map((c) => {
              const veh = getVehiculoForConductor(c.id);
              return (
                <div key={c.id} className={`${cardHover} border rounded-xl p-5 transition-all`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2.5 rounded-lg text-white" style={{ backgroundColor: colors[500] }}>
                      <FiUser className="text-xl" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoStyle(c.estado ?? "ACTIVO")}`}>{c.estado ?? "ACTIVO"}</span>
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${heading}`}>{getNombreConductor(c)}</h3>
                  {c.numeroDocumento && <p className={`text-xs ${textTertiary}`}>Doc: {c.numeroDocumento}</p>}
                  <p className={`text-sm ${textTertiary}`}>Licencia: {c.licencia}</p>
                  {c.categoriaLicencia && <p className={`text-xs mt-1 ${textTertiary}`}>Categoria: {c.categoriaLicencia}</p>}
                  {c.telefono && <p className={`text-xs mt-1 ${textTertiary}`}>Tel: {c.telefono}</p>}
                  {veh && (
                    <div className={`mt-3 p-3 rounded-lg flex items-center gap-3 border ${isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-100"}`}>
                      <FiTruck className="flex-shrink-0" style={{ color: colors[500] }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: colors[600] }}>{veh.placa}</p>
                        <p className={`text-xs ${textTertiary}`}>{veh.marca} {veh.modelo}{veh.capacidadKg ? ` · ${veh.capacidadKg} kg` : ""}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleEditarConductor(c)} className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${btnSecondary}`}>
                      <FiEdit size={14} /> Editar
                    </button>
                    <button onClick={() => handleDelete("conductores", c.id, getNombreConductor(c))} className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${isDark ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-600"}`}>
                      <FiTrash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════ TAB: RUTAS ═══════ */}
        {activeTab === "rutas" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? <Skeleton count={6} /> :
             rutas.length === 0 ? (
              <div className={`sm:col-span-2 lg:col-span-3 text-center py-12 ${emptyState}`}>
                <FiMap className="mx-auto mb-2 text-4xl opacity-30" />
                <p>No hay rutas registradas</p>
              </div>
            ) : rutas.map((r) => (
              <div key={r.id} className={`${cardHover} border rounded-xl p-5 transition-all`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg text-white" style={{ backgroundColor: colors[600] }}>
                    <FiMap className="text-xl" />
                  </div>
                  {r.costoBase != null && (
                    <span className="text-sm font-bold" style={{ color: colors[500] }}>S/ {r.costoBase.toFixed(2)}</span>
                  )}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${heading}`}>{r.nombre}</h3>
                <div className={`flex items-center gap-2 text-sm ${textTertiary}`}>
                  <span>{r.origen}</span>
                  <FiChevronRight className="flex-shrink-0" />
                  <span>{r.destino}</span>
                </div>
                <div className={`flex gap-4 mt-2 text-xs ${textTertiary}`}>
                  {r.distanciaKm && <span>{r.distanciaKm} km</span>}
                  {r.tiempoEstimadoHoras && <span>{r.tiempoEstimadoHoras} hrs</span>}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEditarRuta(r)} className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${btnSecondary}`}>
                    <FiEdit size={14} /> Editar
                  </button>
                  <button onClick={() => handleDelete("rutas", r.id, r.nombre)} className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${isDark ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-600"}`}>
                    <FiTrash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════ CREATE/EDIT MODAL ═══════ */}
      {showModal && (
        <div className={modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className={`${modalContent} rounded-2xl shadow-2xl w-full ${activeTab === "envios" ? "max-w-4xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto border`}>
            <div className={`p-5 border-b ${modalHeader} flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg text-white" style={{ backgroundColor: colors[500] }}>
                  {{ envios: <FiTruck size={18} />, conductores: <FiUser size={18} />, rutas: <FiMap size={18} /> }[activeTab]}
                </div>
                <h2 className={`text-xl font-bold ${heading}`}>
                  {isEditing ? "Editar" : "Crear"} {{ envios: "Envio", conductores: "Conductor", rutas: "Ruta" }[activeTab]}
                </h2>
              </div>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${btnGhost}`}><FiX size={20} /></button>
            </div>

            {/* ── ENVIO FORM ── */}
            {activeTab === "envios" && (
              <form onSubmit={handleSubmitEnvio} className="p-5">
                {/* Venta selector */}
                {!isEditing && (
                  <div className="mb-6 p-4 rounded-xl border-2 border-dashed" style={{ borderColor: `${colors[500]}40`, backgroundColor: `${colors[500]}08` }}>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors[600] }}>
                      <FiPackage className="inline mr-2" />Venta a enviar *
                    </label>
                    {ventasDisponibles.length === 0 ? (
                      <p className={`text-sm py-2 ${textTertiary}`}>No hay ventas pendientes de envio.</p>
                    ) : (
                      <select value={envioForm.idVenta} onChange={(e) => setEnvioForm((p) => ({ ...p, idVenta: e.target.value }))} className={`${inputCl} font-medium`} required>
                        <option value="">-- Seleccionar venta pendiente --</option>
                        {ventasDisponibles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.nombreCliente} | {v.fecha ? new Date(v.fecha).toLocaleDateString("es-PE") : "Sin fecha"} | S/ {v.total?.toFixed(2) ?? "0.00"}
                          </option>
                        ))}
                      </select>
                    )}
                    {envioForm.idVenta && (() => {
                      const sel = ventas.find((v) => v.id === Number(envioForm.idVenta));
                      return sel ? (
                        <div className={`mt-3 p-4 rounded-xl text-sm ${subtleBg}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-bold ${heading}`}>{sel.nombreCliente}</span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoStyle(sel.estado)}`}>{sel.estado}</span>
                          </div>
                          <div className={`flex items-center gap-4 ${textTertiary}`}>
                            <span className="flex items-center gap-1"><FiCalendar size={13} />{sel.fecha ? new Date(sel.fecha).toLocaleDateString("es-PE") : "-"}</span>
                            <span className="font-semibold" style={{ color: colors[500] }}>S/ {sel.total?.toFixed(2) ?? "0.00"}</span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
                {isEditing && envioForm.idVenta && (() => {
                  const sel = ventas.find((v) => v.id === Number(envioForm.idVenta));
                  return (
                    <div className={`mb-6 p-4 rounded-xl text-sm border ${subtleBg} ${border}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${textSecondary}`}>
                          <FiPackage className="inline mr-1" /> Venta #{envioForm.idVenta} {sel ? `- ${sel.nombreCliente}` : ""}
                        </span>
                        {sel && <span className="font-semibold" style={{ color: colors[500] }}>S/ {sel.total?.toFixed(2)}</span>}
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Left - Transporte */}
                  <div className="space-y-4">
                    <h3 className={`text-xs font-bold uppercase tracking-widest pb-2 border-b flex items-center gap-2 ${textTertiary} ${border}`}>
                      <FiTruck />Transporte
                    </h3>
                    <div>
                      <label className={labelCl}>Conductor</label>
                      <select value={envioForm.idConductor} onChange={(e) => setEnvioForm((p) => ({ ...p, idConductor: e.target.value }))} className={inputCl}>
                        <option value="">Seleccionar conductor</option>
                        {conductores.map((c) => {
                          const veh = getVehiculoForConductor(c.id);
                          return <option key={c.id} value={c.id}>{getNombreConductor(c)} - {c.licencia}{veh ? ` (${veh.placa})` : ""}</option>;
                        })}
                      </select>
                    </div>
                    {envioForm.idConductor && (() => {
                      const veh = getVehiculoForConductor(Number(envioForm.idConductor));
                      return veh ? (
                        <div className={`p-3 rounded-xl flex items-center gap-3 border ${isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-100"}`}>
                          <FiTruck className="flex-shrink-0" style={{ color: colors[500] }} />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: colors[600] }}>{veh.placa} - {veh.marca} {veh.modelo}</p>
                            {veh.capacidadKg ? <p className={`text-xs ${textTertiary}`}>Capacidad: {veh.capacidadKg} kg</p> : null}
                          </div>
                        </div>
                      ) : (
                        <p className={`text-xs ${isDark ? "text-yellow-400/70" : "text-yellow-600"}`}>
                          <FiAlertCircle className="inline mr-1" size={12} />Este conductor no tiene vehiculo asignado
                        </p>
                      );
                    })()}
                    <div>
                      <label className={labelCl}>Ruta</label>
                      <select value={envioForm.idRuta} onChange={(e) => setEnvioForm((p) => ({ ...p, idRuta: e.target.value }))} className={inputCl}>
                        <option value="">Seleccionar ruta</option>
                        {rutas.map((r) => <option key={r.id} value={r.id}>{r.nombre} ({r.origen} → {r.destino})</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCl}><FiCalendar className="inline mr-1" size={13} />Fecha Envio</label>
                        <input type="date" value={envioForm.fechaEnvio} onChange={(e) => setEnvioForm((p) => ({ ...p, fechaEnvio: e.target.value }))} className={inputCl} />
                      </div>
                      <div>
                        <label className={labelCl}><FiCalendar className="inline mr-1" size={13} />Fecha Entrega</label>
                        <input type="date" value={envioForm.fechaEntrega} onChange={(e) => setEnvioForm((p) => ({ ...p, fechaEntrega: e.target.value }))} className={inputCl} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCl}>Costo de Transporte (S/)</label>
                      <input type="number" step="0.01" value={envioForm.costoTransporte} onChange={(e) => setEnvioForm((p) => ({ ...p, costoTransporte: e.target.value }))} className={inputCl} placeholder="0.00" />
                    </div>
                    <div>
                      <label className={labelCl}>Observaciones</label>
                      <textarea value={envioForm.observaciones} onChange={(e) => setEnvioForm((p) => ({ ...p, observaciones: e.target.value }))} rows={2} className={inputCl} placeholder="Notas adicionales..." />
                    </div>
                  </div>

                  {/* Right - Direccion + Mapa */}
                  <div className="space-y-4">
                    <h3 className={`text-xs font-bold uppercase tracking-widest pb-2 border-b flex items-center gap-2 ${textTertiary} ${border}`}>
                      <FiMapPin />Direccion de Envio
                    </h3>
                    <div className="relative" ref={suggestionsRef}>
                      <label className={labelCl}>Direccion *</label>
                      <div className="relative">
                        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${textTertiary}`} size={14} />
                        <input
                          type="text"
                          value={envioForm.direccionEnvio}
                          onChange={(e) => { setEnvioForm((p) => ({ ...p, direccionEnvio: e.target.value })); searchAddress(e.target.value); }}
                          onFocus={() => { if (addressSuggestions.length > 0) setShowSuggestions(true); }}
                          className={`${inputCl} pl-9`}
                          placeholder="Escribe para buscar o haz click en el mapa..."
                          required
                        />
                        {(searchingAddress || reversingGeocode) && (
                          <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${spinnerColor}`} />
                        )}
                      </div>
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className={`absolute z-50 w-full mt-1 rounded-xl shadow-xl border overflow-hidden ${modalContent}`}>
                          {addressSuggestions.map((s, i) => (
                            <button key={i} type="button" onClick={() => selectAddress(s)}
                              className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-start gap-2 ${isDark ? "hover:bg-gray-600 text-gray-200" : "hover:bg-gray-50 text-gray-700"} ${i > 0 ? `border-t ${border}` : ""}`}>
                              <FiMapPin className="mt-0.5 flex-shrink-0" style={{ color: colors[500] }} size={14} />
                              <span className="line-clamp-2">{s.display_name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Clickable Map */}
                    <div className={`rounded-xl overflow-hidden border ${border} ${shadow}`} style={{ height: 280 }}>
                      <MapContainer center={[mapCoords.lat, mapCoords.lng]} zoom={hasMarker ? 16 : 13} style={{ height: "100%", width: "100%" }} zoomControl={true} attributionControl={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {hasMarker && <Marker position={[mapCoords.lat, mapCoords.lng]} />}
                        <RecenterMap lat={mapCoords.lat} lng={mapCoords.lng} />
                        <MapClickHandler onMapClick={reverseGeocode} />
                      </MapContainer>
                    </div>
                    <p className={`text-xs flex items-center gap-1 ${textTertiary}`}>
                      <FiMapPin size={11} />
                      Haz click en el mapa para seleccionar la ubicacion, o busca por texto arriba
                    </p>
                  </div>
                </div>

                <div className={`flex gap-3 justify-end pt-4 border-t ${border}`}>
                  <button type="button" onClick={closeModal} className={`${btnSecondary} px-5 py-2.5 rounded-xl transition-colors`}>Cancelar</button>
                  <button type="submit" disabled={saving || (!isEditing && !envioForm.idVenta)}
                    className={`${btnPrimary} px-5 py-2.5 rounded-xl ${saving || (!isEditing && !envioForm.idVenta) ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {saving ? "Guardando..." : isEditing ? "Actualizar Envio" : "Crear Envio"}
                  </button>
                </div>
              </form>
            )}

            {/* ── CONDUCTOR FORM ── */}
            {activeTab === "conductores" && (
              <form onSubmit={handleSubmitConductor} className="p-5 space-y-5">
                <div>
                  <h3 className={`text-xs font-bold uppercase tracking-widest pb-2 mb-4 border-b flex items-center gap-2 ${textTertiary} ${border}`}>
                    <FiUser size={14} />Datos del Conductor
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className={labelCl}>Nombres *</label><input type="text" value={conductorForm.nombres} onChange={(e) => setConductorForm((p) => ({ ...p, nombres: e.target.value }))} className={inputCl} placeholder="Juan" required /></div>
                    <div><label className={labelCl}>Apellido Paterno *</label><input type="text" value={conductorForm.apellidoPaterno} onChange={(e) => setConductorForm((p) => ({ ...p, apellidoPaterno: e.target.value }))} className={inputCl} placeholder="Perez" required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className={labelCl}>Apellido Materno</label><input type="text" value={conductorForm.apellidoMaterno} onChange={(e) => setConductorForm((p) => ({ ...p, apellidoMaterno: e.target.value }))} className={inputCl} placeholder="Garcia" /></div>
                    <div><label className={labelCl}>N° Documento</label><input type="text" value={conductorForm.numeroDocumento} onChange={(e) => setConductorForm((p) => ({ ...p, numeroDocumento: e.target.value }))} className={inputCl} placeholder="12345678" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className={labelCl}>Telefono</label><input type="text" value={conductorForm.telefono} onChange={(e) => setConductorForm((p) => ({ ...p, telefono: e.target.value }))} className={inputCl} placeholder="999888777" /></div>
                    <div><label className={labelCl}>N° Licencia *</label><input type="text" value={conductorForm.licencia} onChange={(e) => setConductorForm((p) => ({ ...p, licencia: e.target.value }))} className={inputCl} placeholder="Q12345678" required /></div>
                  </div>
                  <div>
                    <label className={labelCl}>Categoria de Licencia</label>
                    <select value={conductorForm.categoriaLicencia} onChange={(e) => setConductorForm((p) => ({ ...p, categoriaLicencia: e.target.value }))} className={inputCl}>
                      <option value="">Seleccionar categoria</option>
                      {["A-I","A-IIa","A-IIb","A-IIIa","A-IIIb","A-IIIc","B-I","B-IIa","B-IIb","B-IIc"].map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest pb-2 mb-4 border-b flex items-center gap-2" style={{ color: colors[500], borderColor: isDark ? "#374151" : "#e5e7eb" }}>
                    <FiTruck size={14} />Vehiculo del Conductor
                  </h3>
                  <div className="mb-4">
                    <label className={labelCl}>Placa *</label>
                    <input type="text" value={conductorForm.placa} onChange={(e) => setConductorForm((p) => ({ ...p, placa: e.target.value }))} className={inputCl} placeholder="ABC-123" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className={labelCl}>Marca</label><input type="text" value={conductorForm.marca} onChange={(e) => setConductorForm((p) => ({ ...p, marca: e.target.value }))} className={inputCl} placeholder="Toyota" /></div>
                    <div><label className={labelCl}>Modelo</label><input type="text" value={conductorForm.modelo} onChange={(e) => setConductorForm((p) => ({ ...p, modelo: e.target.value }))} className={inputCl} placeholder="Hilux" /></div>
                  </div>
                  <div><label className={labelCl}>Capacidad (kg)</label><input type="number" value={conductorForm.capacidadKg} onChange={(e) => setConductorForm((p) => ({ ...p, capacidadKg: e.target.value }))} className={inputCl} placeholder="1000" /></div>
                </div>
                <div className={`flex gap-3 justify-end pt-4 border-t ${border}`}>
                  <button type="button" onClick={closeModal} className={`${btnSecondary} px-5 py-2.5 rounded-xl`}>Cancelar</button>
                  <button type="submit" disabled={saving || !conductorForm.licencia || !conductorForm.placa || !conductorForm.nombres || !conductorForm.apellidoPaterno}
                    className={`${btnPrimary} px-5 py-2.5 rounded-xl ${saving || !conductorForm.licencia || !conductorForm.placa || !conductorForm.nombres || !conductorForm.apellidoPaterno ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {saving ? "Guardando..." : isEditing ? "Actualizar Conductor" : "Crear Conductor"}
                  </button>
                </div>
              </form>
            )}

            {/* ── RUTA FORM ── */}
            {activeTab === "rutas" && (
              <form onSubmit={handleSubmitRuta} className="p-5 space-y-4">
                <div><label className={labelCl}>Nombre de la Ruta *</label><input type="text" value={rutaForm.nombre} onChange={(e) => setRutaForm((p) => ({ ...p, nombre: e.target.value }))} className={inputCl} placeholder="Lima - Arequipa" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCl}>Origen *</label><input type="text" value={rutaForm.origen} onChange={(e) => setRutaForm((p) => ({ ...p, origen: e.target.value }))} className={inputCl} placeholder="Lima" required /></div>
                  <div><label className={labelCl}>Destino *</label><input type="text" value={rutaForm.destino} onChange={(e) => setRutaForm((p) => ({ ...p, destino: e.target.value }))} className={inputCl} placeholder="Arequipa" required /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelCl}>Distancia (km)</label><input type="number" step="0.1" value={rutaForm.distanciaKm} onChange={(e) => setRutaForm((p) => ({ ...p, distanciaKm: e.target.value }))} className={inputCl} placeholder="0" /></div>
                  <div><label className={labelCl}>Tiempo (hrs)</label><input type="number" step="0.5" value={rutaForm.tiempoEstimadoHoras} onChange={(e) => setRutaForm((p) => ({ ...p, tiempoEstimadoHoras: e.target.value }))} className={inputCl} placeholder="0" /></div>
                  <div><label className={labelCl}>Costo Base (S/)</label><input type="number" step="0.01" value={rutaForm.costoBase} onChange={(e) => setRutaForm((p) => ({ ...p, costoBase: e.target.value }))} className={inputCl} placeholder="0.00" /></div>
                </div>
                <div className={`flex gap-3 justify-end pt-4 border-t ${border}`}>
                  <button type="button" onClick={closeModal} className={`${btnSecondary} px-5 py-2.5 rounded-xl`}>Cancelar</button>
                  <button type="submit" disabled={saving || !rutaForm.nombre || !rutaForm.origen || !rutaForm.destino}
                    className={`${btnPrimary} px-5 py-2.5 rounded-xl ${saving || !rutaForm.nombre || !rutaForm.origen || !rutaForm.destino ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {saving ? "Guardando..." : isEditing ? "Actualizar Ruta" : "Crear Ruta"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════ DETAIL MODAL ═══════ */}
      {showDetailModal && envioSeleccionado && (
        <div className={modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowDetailModal(false); }}>
          <div className={`${modalContent} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border`}>
            <div className={`p-5 border-b ${modalHeader} flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg text-white" style={{ backgroundColor: colors[500] }}>
                  <FiTruck className="text-xl" />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${heading}`}>Envio #{envioSeleccionado.id}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoStyle(envioSeleccionado.estado)}`}>{envioSeleccionado.estado.replace("_", " ")}</span>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className={`p-2 rounded-lg transition-colors ${btnGhost}`}><FiX size={20} /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Venta", value: envioSeleccionado.idVenta ? `#${envioSeleccionado.idVenta}` : "-" },
                  { label: "Cliente", value: envioSeleccionado.nombreCliente ?? "-" },
                  { label: "Vehiculo", value: envioSeleccionado.placaVehiculo ? `${envioSeleccionado.placaVehiculo} (${envioSeleccionado.marcaVehiculo ?? ""})` : "-" },
                  { label: "Conductor", value: envioSeleccionado.nombreConductor ? `${envioSeleccionado.nombreConductor}${envioSeleccionado.licenciaConductor ? ` (${envioSeleccionado.licenciaConductor})` : ""}` : "-" },
                  { label: "Ruta", value: envioSeleccionado.nombreRuta ? `${envioSeleccionado.nombreRuta}${envioSeleccionado.origenRuta ? ` (${envioSeleccionado.origenRuta} → ${envioSeleccionado.destinoRuta})` : ""}` : "-" },
                  { label: "Estado Venta", value: envioSeleccionado.estadoVenta ?? "-" },
                  { label: "Fecha Envio", value: formatDate(envioSeleccionado.fechaEnvio) },
                  { label: "Fecha Entrega", value: formatDate(envioSeleccionado.fechaEntrega) },
                  { label: "Costo Transporte", value: envioSeleccionado.costoTransporte != null ? `S/ ${envioSeleccionado.costoTransporte.toFixed(2)}` : "-" },
                  { label: "Total Venta", value: envioSeleccionado.totalVenta != null ? `S/ ${envioSeleccionado.totalVenta.toFixed(2)}` : "-" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className={`text-xs uppercase tracking-wider ${textTertiary}`}>{item.label}</p>
                    <p className={`font-medium text-sm mt-0.5 ${heading}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className={`p-3 rounded-xl ${subtleBg}`}>
                <p className={`text-xs uppercase tracking-wider mb-1 ${textTertiary}`}>Direccion de Envio</p>
                <p className={`text-sm font-medium ${heading}`}><FiMapPin className="inline mr-1" />{envioSeleccionado.direccionEnvio ?? "-"}</p>
              </div>
              {envioSeleccionado.observaciones && (
                <div className={`p-3 rounded-xl ${subtleBg}`}>
                  <p className={`text-xs uppercase tracking-wider mb-1 ${textTertiary}`}>Observaciones</p>
                  <p className={`text-sm ${textSecondary}`}>{envioSeleccionado.observaciones}</p>
                </div>
              )}
            </div>
            <div className={`p-5 border-t ${modalHeader} flex justify-end`}>
              <button onClick={() => setShowDetailModal(false)} className={`${btnPrimary} px-5 py-2.5 rounded-xl`}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ DELETE MODAL ═══════ */}
      {showDeleteModal && deleteTarget && (
        <div className={modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}>
          <div className={`${modalContent} rounded-2xl shadow-2xl w-full max-w-md border`}>
            <div className="p-6 text-center">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? "bg-red-900/30" : "bg-red-50"}`}>
                <FiTrash2 className={`text-2xl ${isDark ? "text-red-400" : "text-red-500"}`} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${heading}`}>Confirmar Eliminacion</h3>
              <p className={`${textTertiary} mb-1`}>Estas seguro de eliminar <strong className={heading}>{deleteTarget.label}</strong>?</p>
              <p className={`text-xs ${textTertiary}`}>Esta accion no se puede deshacer.</p>
            </div>
            <div className={`p-4 border-t ${modalHeader} flex gap-3`}>
              <button onClick={() => setShowDeleteModal(false)} className={`flex-1 ${btnSecondary} px-4 py-2.5 rounded-xl`}>Cancelar</button>
              <button onClick={confirmarEliminar} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
