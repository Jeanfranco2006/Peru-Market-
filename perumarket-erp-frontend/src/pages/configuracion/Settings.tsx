import { useState, useEffect } from "react";
import {
  FiUser, FiLock, FiInfo, FiSave, FiMail, FiPhone,
  FiMapPin, FiShield, FiCheck, FiAlertCircle, FiEye, FiEyeOff,
  FiSun, FiMoon, FiDroplet
} from "react-icons/fi";
import { configuracionService } from "../../services/configuracionService";
import type { ProfileData, UpdateProfileRequest, SystemInfo } from "../../services/configuracionService";
import { useTheme, COLOR_PALETTES, type ColorScheme } from "../../context/ThemeContext";

type Tab = "perfil" | "seguridad" | "apariencia" | "sistema";

const COLOR_OPTIONS: { id: ColorScheme; name: string; preview: string }[] = [
  { id: "amber", name: "Ámbar", preview: "#f59e0b" },
  { id: "blue", name: "Azul", preview: "#3b82f6" },
  { id: "green", name: "Verde", preview: "#10b981" },
  { id: "purple", name: "Morado", preview: "#a855f7" },
  { id: "red", name: "Rojo", preview: "#ef4444" },
];

export default function Settings() {
  const { mode, colorScheme, setMode, setColorScheme, colors } = useTheme();
  const isDark = mode === "dark";

  const [tab, setTab] = useState<Tab>("perfil");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({
    nombres: "", apellidoPaterno: "", apellidoMaterno: "",
    correo: "", telefono: "", direccion: ""
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getUserId = (): number | null => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) return JSON.parse(authData).user?.id || null;
    } catch { /* ignore */ }
    return null;
  };

  useEffect(() => { loadProfile(); }, []);
  useEffect(() => { if (tab === "sistema" && !systemInfo) loadSystemInfo(); }, [tab]);
  useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(""), 4000); return () => clearTimeout(t); } }, [successMsg]);
  useEffect(() => { if (errorMsg) { const t = setTimeout(() => setErrorMsg(""), 5000); return () => clearTimeout(t); } }, [errorMsg]);

  const loadProfile = async () => {
    const userId = getUserId();
    if (!userId) { setLoading(false); return; }
    try {
      setLoading(true);
      const data = await configuracionService.getProfile(userId);
      setProfile(data);
      setProfileForm({
        nombres: data.persona.nombres || "",
        apellidoPaterno: data.persona.apellidoPaterno || "",
        apellidoMaterno: data.persona.apellidoMaterno || "",
        correo: data.persona.correo || "",
        telefono: data.persona.telefono || "",
        direccion: data.persona.direccion || ""
      });
    } catch (error: any) {
      setErrorMsg("Error al cargar el perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemInfo = async () => {
    try {
      const data = await configuracionService.getSystemInfo();
      setSystemInfo(data);
    } catch (error: any) {
      console.error("Error cargando info del sistema:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId) return;
    try {
      setSaving(true); setErrorMsg("");
      const updatedProfile = await configuracionService.updateProfile(userId, profileForm);
      setProfile(updatedProfile);
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.user.nombres = updatedProfile.persona.nombres;
        parsed.user.apellidos = `${updatedProfile.persona.apellidoPaterno} ${updatedProfile.persona.apellidoMaterno}`;
        parsed.user.email = updatedProfile.persona.correo;
        localStorage.setItem("auth", JSON.stringify(parsed));
      }
      setSuccessMsg("Perfil actualizado correctamente");
    } catch (error: any) {
      setErrorMsg("Error al actualizar perfil: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setErrorMsg("Las contraseñas nuevas no coinciden"); return; }
    if (passwordForm.newPassword.length < 4) { setErrorMsg("La nueva contraseña debe tener al menos 4 caracteres"); return; }
    try {
      setSaving(true); setErrorMsg("");
      const result = await configuracionService.changePassword(userId, {
        currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword
      });
      if (result.success) {
        setSuccessMsg("Contraseña actualizada correctamente");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else { setErrorMsg(result.message); }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || error.message);
    } finally { setSaving(false); }
  };

  const getIniciales = () => {
    if (!profile) return "U";
    return ((profile.persona.nombres?.charAt(0) || "") + (profile.persona.apellidoPaterno?.charAt(0) || "")).toUpperCase() || "U";
  };

  const getNombreCompleto = () => {
    if (!profile) return "";
    return `${profile.persona.nombres} ${profile.persona.apellidoPaterno} ${profile.persona.apellidoMaterno}`.trim();
  };

  const tabs = [
    { id: "perfil" as Tab, nombre: "Mi Perfil", icon: FiUser },
    { id: "seguridad" as Tab, nombre: "Seguridad", icon: FiLock },
    { id: "apariencia" as Tab, nombre: "Apariencia", icon: FiDroplet },
    { id: "sistema" as Tab, nombre: "Sistema", icon: FiInfo }
  ];

  // Dynamic styles
  const cardBg = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const cardBgClean = isDark ? "bg-gray-800" : "bg-white";
  const inputStyle = `w-full px-4 py-3 border rounded-xl transition-all outline-none ${
    isDark
      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[var(--color-primary-400)]"
      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[var(--color-primary-400)]"
  } focus:ring-4 focus:ring-[var(--color-primary-500)]/10`;
  const labelStyle = `block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`;
  const pageBg = isDark ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100";
  const subtleBg = isDark ? "bg-gray-700/50" : "bg-gray-50";

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto" style={{ borderColor: colors[500] }}></div>
          <p className={`mt-4 text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Configuración</h1>
          <p className={isDark ? "text-gray-400 text-lg" : "text-gray-600 text-lg"}>Gestiona tu perfil, seguridad y apariencia del sistema</p>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl animate-fadeIn">
            <FiCheck size={20} className="text-green-500 flex-shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl animate-fadeIn">
            <FiAlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Tabs */}
        <div className={`flex flex-wrap gap-3 p-3 rounded-2xl shadow-sm mb-8 ${cardBgClean}`}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                tab === t.id
                  ? "tab-active"
                  : isDark
                    ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                    : "text-gray-600 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <t.icon size={20} />
              <span className="font-semibold">{t.nombre}</span>
            </button>
          ))}
        </div>

        {/* Saving overlay */}
        {saving && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className={`p-8 rounded-2xl shadow-xl ${cardBgClean}`}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: colors[500] }}></div>
              <p className={`mt-4 font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Guardando...</p>
            </div>
          </div>
        )}

        {/* ==================== TAB: PERFIL ==================== */}
        {tab === "perfil" && profile && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className={`rounded-2xl shadow-sm p-8 ${cardBg} border`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b" style={{ borderColor: isDark ? "#374151" : "#f3f4f6" }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${colors[400]}, ${colors[600]})`, boxShadow: `0 8px 20px -4px ${colors[500]}40` }}>
                  {getIniciales()}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{getNombreCompleto()}</h2>
                  <p className={isDark ? "text-gray-400 font-medium" : "text-gray-500 font-medium"}>@{profile.username}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge-primary inline-flex items-center gap-1.5">
                      <FiShield size={14} />
                      {profile.rol.nombre}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      profile.estado === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {profile.estado}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account info (read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Usuario", value: `@${profile.username}` },
                  { label: "Documento", value: `${profile.persona.tipoDocumento} - ${profile.persona.numeroDocumento}` },
                  { label: "Fecha Nacimiento", value: profile.persona.fechaNacimiento || "No registrada" }
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl p-4 ${subtleBg}`}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: isDark ? "#9ca3af" : "#9ca3af" }}>{item.label}</p>
                    <p className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className={`rounded-2xl shadow-sm p-8 ${cardBg} border`}>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>Editar Información Personal</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div><label className={labelStyle}>Nombres</label>
                    <input type="text" value={profileForm.nombres} onChange={(e) => setProfileForm({ ...profileForm, nombres: e.target.value })} className={inputStyle} required /></div>
                  <div><label className={labelStyle}>Apellido Paterno</label>
                    <input type="text" value={profileForm.apellidoPaterno} onChange={(e) => setProfileForm({ ...profileForm, apellidoPaterno: e.target.value })} className={inputStyle} required /></div>
                  <div><label className={labelStyle}>Apellido Materno</label>
                    <input type="text" value={profileForm.apellidoMaterno} onChange={(e) => setProfileForm({ ...profileForm, apellidoMaterno: e.target.value })} className={inputStyle} required /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelStyle}><FiMail className="inline mr-2" size={16} />Correo Electrónico</label>
                    <input type="email" value={profileForm.correo} onChange={(e) => setProfileForm({ ...profileForm, correo: e.target.value })} className={inputStyle} /></div>
                  <div><label className={labelStyle}><FiPhone className="inline mr-2" size={16} />Teléfono</label>
                    <input type="text" value={profileForm.telefono} onChange={(e) => setProfileForm({ ...profileForm, telefono: e.target.value })} className={inputStyle} /></div>
                </div>
                <div><label className={labelStyle}><FiMapPin className="inline mr-2" size={16} />Dirección</label>
                  <input type="text" value={profileForm.direccion} onChange={(e) => setProfileForm({ ...profileForm, direccion: e.target.value })} className={inputStyle} /></div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    <FiSave size={18} /> Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TAB: SEGURIDAD ==================== */}
        {tab === "seguridad" && (
          <div className="space-y-6">
            <div className={`rounded-2xl shadow-sm p-8 ${cardBg} border`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors[100], color: colors[600] }}><FiLock size={24} /></div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Cambiar Contraseña</h3>
                  <p className={isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Actualiza tu contraseña para mantener tu cuenta segura</p>
                </div>
              </div>
              <form onSubmit={handleChangePassword} className="max-w-lg space-y-6">
                <div>
                  <label className={labelStyle}>Contraseña Actual</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? "text" : "password"} value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className={inputStyle + " pr-12"} required placeholder="Ingresa tu contraseña actual" />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Nueva Contraseña</label>
                  <div className="relative">
                    <input type={showNewPassword ? "text" : "password"} value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className={inputStyle + " pr-12"} required minLength={4} placeholder="Ingresa la nueva contraseña" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Confirmar Nueva Contraseña</label>
                  <input type="password" value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className={`${inputStyle} ${passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword ? "!border-red-400" : ""}`}
                    required minLength={4} placeholder="Confirma la nueva contraseña" />
                  {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500 font-medium">Las contraseñas no coinciden</p>
                  )}
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={saving || (passwordForm.confirmPassword !== "" && passwordForm.newPassword !== passwordForm.confirmPassword)}
                    className="btn-primary flex items-center gap-2">
                    <FiLock size={18} /> Actualizar Contraseña
                  </button>
                </div>
              </form>
            </div>

            <div className={`rounded-2xl p-8 border ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100"}`}>
              <h4 className={`font-bold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>Recomendaciones de Seguridad</h4>
              <ul className={`space-y-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {["Usa una contraseña de al menos 8 caracteres con letras, números y símbolos",
                  "No reutilices contraseñas de otros servicios",
                  "Cambia tu contraseña periódicamente",
                  "No compartas tu contraseña con nadie"
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FiCheck className="mt-0.5 flex-shrink-0" size={18} style={{ color: colors[500] }} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ==================== TAB: APARIENCIA ==================== */}
        {tab === "apariencia" && (
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className={`rounded-2xl shadow-sm p-8 ${cardBg} border`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors[100], color: colors[600] }}>
                  {isDark ? <FiMoon size={24} /> : <FiSun size={24} />}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Modo de Visualización</h3>
                  <p className={isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Elige entre modo claro u oscuro</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                {/* Light mode */}
                <button
                  onClick={() => setMode("light")}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                    mode === "light"
                      ? "border-[var(--color-primary-500)] shadow-lg"
                      : isDark
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {mode === "light" && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: colors[500] }}>
                      <FiCheck size={14} />
                    </div>
                  )}
                  <div className="w-full h-24 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 mb-4 flex items-center justify-center overflow-hidden">
                    <div className="w-4/5 flex gap-2">
                      <div className="w-8 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-white rounded border border-gray-200 w-full"></div>
                        <div className="h-8 bg-white rounded border border-gray-200 w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiSun size={22} className={isDark ? "text-gray-400" : "text-amber-500"} />
                    <div>
                      <p className={`font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Modo Claro</p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Fondo blanco, ideal para el día</p>
                    </div>
                  </div>
                </button>

                {/* Dark mode */}
                <button
                  onClick={() => setMode("dark")}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                    mode === "dark"
                      ? "border-[var(--color-primary-500)] shadow-lg"
                      : isDark
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {mode === "dark" && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: colors[500] }}>
                      <FiCheck size={14} />
                    </div>
                  )}
                  <div className="w-full h-24 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 mb-4 flex items-center justify-center overflow-hidden">
                    <div className="w-4/5 flex gap-2">
                      <div className="w-8 h-16 bg-gray-700 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-700 rounded w-full"></div>
                        <div className="h-8 bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMoon size={22} className={isDark ? "text-indigo-400" : "text-gray-400"} />
                    <div>
                      <p className={`font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>Modo Oscuro</p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Fondo oscuro, reduce fatiga visual</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Color Selection */}
            <div className={`rounded-2xl shadow-sm p-8 ${cardBg} border`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl" style={{ backgroundColor: colors[100], color: colors[600] }}>
                  <FiDroplet size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Color del Tema</h3>
                  <p className={isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Selecciona el color principal para botones, acentos y elementos del sistema</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {COLOR_OPTIONS.map((option) => {
                  const palette = COLOR_PALETTES[option.id];
                  const isSelected = colorScheme === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setColorScheme(option.id)}
                      className={`relative p-5 rounded-2xl border-2 transition-all duration-300 group ${
                        isSelected
                          ? "shadow-lg"
                          : isDark
                            ? "border-gray-600 hover:border-gray-500"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                      style={isSelected ? { borderColor: palette[500] } : {}}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: palette[500] }}>
                          <FiCheck size={12} />
                        </div>
                      )}

                      {/* Color preview circles */}
                      <div className="flex justify-center gap-1.5 mb-4">
                        <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: palette[400] }}></div>
                        <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: palette[500] }}></div>
                        <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: palette[600] }}></div>
                      </div>

                      {/* Mini button preview */}
                      <div className="w-full h-8 rounded-lg mb-3 text-white text-xs font-bold flex items-center justify-center"
                        style={{ background: `linear-gradient(to right, ${palette[500]}, ${palette[600]})` }}>
                        Botón
                      </div>

                      <p className={`text-center font-bold text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>{option.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Preview */}
            <div className={`rounded-2xl shadow-sm p-8 ${cardBg} border`}>
              <h3 className={`text-lg font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>Vista Previa</h3>
              <div className={`rounded-xl p-6 border ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <button className="btn-primary text-sm">Botón Principal</button>
                  <button className={`px-6 py-3 rounded-xl font-semibold text-sm border transition-all ${
                    isDark ? "border-gray-600 text-gray-300 hover:bg-gray-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}>
                    Botón Secundario
                  </button>
                  <span className="badge-primary">Etiqueta</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: colors[500] }}>
                    <FiCheck size={16} /> Texto de acento
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: colors[500] }}>Tab Activo</div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-600"}`}>Tab Inactivo</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${colors[400]}, ${colors[600]})` }}>
                    PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: SISTEMA ==================== */}
        {tab === "sistema" && (
          <div className="space-y-6">
            <div className={`rounded-2xl shadow-sm p-8 ${cardBg} border`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl" style={{ backgroundColor: isDark ? "#1e3a5f" : "#dbeafe", color: isDark ? "#93c5fd" : "#2563eb" }}>
                  <FiInfo size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Información del Sistema</h3>
                  <p className={isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Datos generales del sistema ERP</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Aplicación", value: systemInfo?.nombre || "PeruMarket ERP", color: colors[500], bgFrom: colors[50], bgTo: colors[100] },
                  { label: "Versión", value: systemInfo?.version || "1.0.0", color: "#3b82f6", bgFrom: "#eff6ff", bgTo: "#dbeafe" },
                  { label: "Usuarios Activos", value: String(systemInfo?.usuariosActivos ?? "-"), color: "#10b981", bgFrom: "#ecfdf5", bgTo: "#d1fae5" },
                  { label: "Total Usuarios", value: String(systemInfo?.totalUsuarios ?? "-"), color: "#a855f7", bgFrom: "#faf5ff", bgTo: "#f3e8ff" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl p-6 border ${isDark ? "bg-gray-700/50 border-gray-600" : "border-gray-100"}`}
                    style={!isDark ? { background: `linear-gradient(135deg, ${item.bgFrom}, ${item.bgTo})` } : {}}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: item.color }}>{item.label}</p>
                    <p className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {profile && (
              <div className={`rounded-2xl shadow-sm p-8 ${cardBg} border`}>
                <h4 className={`font-bold text-lg mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>Sesión Actual</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Usuario", value: `@${profile.username}` },
                    { label: "Rol", value: profile.rol.nombre },
                    { label: "Estado", value: profile.estado, isBadge: true }
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl p-4 ${subtleBg}`}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#9ca3af" }}>{item.label}</p>
                      {item.isBadge ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.value === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>{item.value}</span>
                      ) : (
                        <p className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
