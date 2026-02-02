import { useState, useEffect } from "react";
import { FiX, FiCheck, FiAlertCircle, FiEyeOff, FiEye, FiSearch, FiShield, FiSettings, FiUser, FiLock, FiMail, FiFileText } from "react-icons/fi";
import { useThemeClasses } from "../../hooks/useThemeClasses";

// Helper to get dark-aware modal styles
const getModalStyles = (isDark: boolean) => ({
  overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in",
  container: `rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border transform animate-scale-in ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`,
  header: `flex justify-between items-center p-8 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-white'}`,
  title: `text-2xl font-semibold tracking-tight ${isDark ? 'text-gray-100' : 'text-blue-700'}`,
  subtitle: `text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`,
  closeButton: `p-2 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`,
  content: `p-8 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin ${isDark ? 'scrollbar-thumb-gray-600' : 'scrollbar-thumb-gray-300'} scrollbar-track-transparent`,
  footer: `border-t px-8 py-6 flex gap-3 justify-end ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`,
  button: "rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
  buttonSizes: { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-base" },
  buttonPrimary: "btn-primary focus:ring-blue-500",
  buttonSecondary: `border focus:ring-gray-500 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`,
  buttonDanger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500",
  input: `border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all duration-200 w-full ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`,
  select: `border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all duration-200 w-full ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-800'}`,
  label: `block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`,
  card: `rounded-xl p-6 border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-100'}`,
  iconContainer: `p-3 rounded-xl ${isDark ? 'bg-[var(--color-primary-500)]/10 text-[var(--color-primary-400)]' : 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 text-blue-600'}`,
  textPrimary: isDark ? 'text-gray-100' : 'text-gray-900',
  textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
});


// Animaciones CSS personalizadas
const styles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}
`;

// Componente de icono de campo de formulario
const FieldIcon = ({ icon, type }: { icon?: React.ReactNode; type?: string }) => {
  if (icon) return <>{icon}</>;
  
  const defaultIcons = {
    username: <FiUser className="text-gray-400" size={18} />,
    email: <FiMail className="text-gray-400" size={18} />,
    password: <FiLock className="text-gray-400" size={18} />,
    document: <FiFileText className="text-gray-400" size={18} />,
    default: <FiFileText className="text-gray-400" size={18} />
  };

  return defaultIcons[type as keyof typeof defaultIcons] || defaultIcons.default;
};

// Modal para ver detalles - MEJORADO
export const ModalDetalles = ({
  isOpen,
  titulo,
  subtitulo,
  children,
  onClose
}: {
  isOpen: boolean;
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  onClose: () => void
}) => {
  const { isDark } = useThemeClasses();
  const ms = getModalStyles(isDark);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div className={ms.overlay} onClick={onClose}>
        <div
          className={ms.container}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={ms.header}>
            <div>
              <h2 className={ms.title}>{titulo}</h2>
              {subtitulo && <p className={ms.subtitle}>{subtitulo}</p>}
            </div>
            <button
              onClick={onClose}
              className={ms.closeButton}
              aria-label="Cerrar modal"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className={ms.content}>
            {children}
          </div>
          <div className={ms.footer}>
            <button
              onClick={onClose}
              className={`${ms.button} ${ms.buttonSizes.md} ${ms.buttonSecondary}`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Modal para editar/crear - PROFESIONAL
export const ModalEditar = ({
  isOpen,
  titulo,
  subtitulo,
  fields,
  onSave,
  onClose,
  type = "edit",
  rolesDropdown = [],
  onSearchDni,
  onChangeField
}: {
  isOpen: boolean;
  titulo: string;
  subtitulo?: string;
  fields: any;
  onSave: (data: any) => void;
  onClose: () => void;
  type?: string;
  rolesDropdown?: any[];
  onSearchDni?: () => void;
  onChangeField?: (field: string, value: any) => void;
}) => {
  const { isDark } = useThemeClasses();
  const ms = getModalStyles(isDark);
  const [formData, setFormData] = useState<any>(fields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loadingDni, setLoadingDni] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
    
    onChangeField?.(key, value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (type === "usuario") {
      if (!formData.username?.trim()) newErrors.username = 'El usuario es requerido';
      if (!formData.nombres?.trim()) newErrors.nombres = 'Los nombres son requeridos';
      if (!formData.correo?.trim()) newErrors.correo = 'El correo es requerido';
      if (formData.correo && !/\S+@\S+\.\S+/.test(formData.correo)) newErrors.correo = 'Correo electrónico inválido';
      if (!formData.idRol) newErrors.idRol = 'El rol es requerido';
      if (!formData.id && (!formData.password || formData.password.length < 6)) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }
    
    if (type === "rol" && !formData.nombre?.trim()) newErrors.nombre = 'El nombre del rol es requerido';
    if (type === "modulo" && !formData.nombre?.trim()) newErrors.nombre = 'El nombre del módulo es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSearchDni = async () => {
    if (onSearchDni) {
      setLoadingDni(true);
      try {
        await onSearchDni();
      } finally {
        setLoadingDni(false);
      }
    }
  };

  useEffect(() => {
    setFormData(fields);
    setShowPassword(false);
    setErrors({});
  }, [fields, isOpen]);

  if (!isOpen) return null;

  const renderField = (key: string, value: any) => {
    if (key === 'id' || key === 'fecha_creacion' || key === 'fecha_actualizacion' || 
        key === 'id_persona' || key === 'usuarioId') return null;
    
    const labelMap: Record<string, string> = {
      username: 'Usuario',
      nombres: 'Nombres Completos',
      correo: 'Correo Electrónico',
      idRol: 'Rol del Sistema',
      estado: 'Estado',
      tipoDocumento: 'Tipo de Documento',
      numeroDocumento: 'Número de Documento',
      password: 'Contraseña'
    };

    const label = labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
    
    if (key === 'estado') {
      return (
        <div key={key} className="space-y-2">
          <label className={ms.label}>{label}</label>
          <select
            value={value || 'ACTIVO'}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`${ms.select} ${errors[key] ? 'border-red-500' : ''}`}
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
          {errors[key] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} />
            {errors[key]}
          </p>}
        </div>
      );
    }

    if (key === 'tipoDocumento') {
      return (
        <div key={key} className="space-y-2">
          <label className={ms.label}>{label}</label>
          <select
            value={value || 'DNI'}
            onChange={(e) => handleChange(key, e.target.value)}
            className={ms.select}
          >
            <option value="DNI">DNI</option>
            <option value="RUC">RUC</option>
            <option value="PASAPORTE">PASAPORTE</option>
            <option value="OTRO">OTRO</option>
          </select>
        </div>
      );
    }

    if (key === 'idRol') {
      return (
        <div key={key} className="space-y-2">
          <label className={ms.label}>Rol del Sistema</label>
          <select
            value={value || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`${ms.select} ${errors[key] ? 'border-red-500' : ''}`}
          >
            <option value="">Seleccionar rol...</option>
            {rolesDropdown.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
          {errors[key] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} />
            {errors[key]}
          </p>}
        </div>
      );
    }

    if (key === 'password') {
      return (
        <div key={key} className="space-y-2">
          <label className={ms.label}>
            Contraseña {!formData.id && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FieldIcon type="password" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={value || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`${ms.input} ${errors[key] ? 'border-red-500' : ''} pl-10 pr-12`}
              placeholder={formData.id ? "Dejar vacío para mantener actual" : "Ingrese nueva contraseña"}
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors[key] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} />
            {errors[key]}
          </p>}
          {formData.id && (
            <p className="text-sm text-gray-500 mt-1">Dejar vacío para mantener la contraseña actual</p>
          )}
        </div>
      );
    }

    // Campo especial para DNI con búsqueda
    if (key === 'numeroDocumento' && type === "usuario") {
      return (
        <div key={key} className="space-y-2">
          <label className={ms.label}>
            Número de Documento
            {formData.tipoDocumento === 'DNI' && (
              <span className="text-blue-600 text-sm ml-2 font-normal">(Búsqueda RENIEC)</span>
            )}
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FieldIcon type="document" />
              </div>
              <input
                type="text"
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`${ms.input} ${errors[key] ? 'border-red-500' : ''} pl-10`}
                placeholder="Ingrese número de documento"
                maxLength={8}
                onKeyPress={handleKeyPress}
              />
            </div>
            {formData.tipoDocumento === 'DNI' && value?.length === 8 && onSearchDni && (
              <button
                type="button"
                onClick={handleSearchDni}
                disabled={loadingDni}
                className={`${ms.button} ${ms.buttonSizes.md} ${ms.buttonSecondary} whitespace-nowrap`}
              >
                {loadingDni ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <FiSearch size={16} />
                    Buscar
                  </>
                )}
              </button>
            )}
          </div>
          {formData.tipoDocumento === 'DNI' && (
            <p className="text-sm text-gray-500">
              Ingrese 8 dígitos para buscar en RENIEC (solo personas en padrón electoral)
            </p>
          )}
          {errors[key] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FiAlertCircle size={14} />
            {errors[key]}
          </p>}
        </div>
      );
    }
    
    return (
      <div key={key} className="space-y-2">
        <label className={ms.label}>{label}</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FieldIcon type={key} />
          </div>
          <input
            type={key.includes('correo') ? 'email' : key.includes('telefono') ? 'tel' : key.includes('fecha') ? 'date' : 'text'}
            value={value || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`${ms.input} ${errors[key] ? 'border-red-500' : ''} pl-10`}
            placeholder={`Ingrese ${label.toLowerCase()}`}
            onKeyPress={handleKeyPress}
          />
        </div>
        {errors[key] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <FiAlertCircle size={14} />
          {errors[key]}
        </p>}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className={ms.overlay} onClick={onClose}>
        <div
          className={`rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border transform animate-scale-in ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={ms.header}>
            <div>
              <h2 className={ms.title}>{titulo}</h2>
              {subtitulo && <p className={ms.subtitle}>{subtitulo}</p>}
            </div>
            <button onClick={onClose} className={ms.closeButton}>
              <FiX size={20} />
            </button>
          </div>
          <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin">
            {Object.entries(formData).map(([key, value]) => renderField(key, value))}
          </div>
          <div className={ms.footer}>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className={`${ms.button} ${ms.buttonSizes.md} ${ms.buttonSecondary}`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${ms.button} ${ms.buttonSizes.md} ${ms.buttonPrimary} min-w-[120px]`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {formData.id ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <FiCheck size={18} />
                  {formData.id ? 'Actualizar' : 'Crear'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Modal para permisos - PROFESIONAL
export const ModalPermisos = ({
  isOpen,
  rol,
  modulos,
  permisos,
  onSave,
  onClose
}: {
  isOpen: boolean;
  rol: any;
  modulos: any[];
  permisos: any[];
  onSave: (permisos: any[]) => void;
  onClose: () => void
}) => {
  const { isDark } = useThemeClasses();
  const ms = getModalStyles(isDark);
  const [permisosLocales, setPermisosLocales] = useState(permisos);
  const [isSaving, setIsSaving] = useState(false);

  const togglePermiso = (idModulo: number) => {
    setPermisosLocales(prev => 
      prev.map(p => 
        p.idModulo === idModulo 
          ? { ...p, hasAccess: !p.hasAccess }
          : p
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(permisosLocales);
      onClose();
    } catch (error) {
      console.error('Error al guardar permisos:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAll = (access: boolean) => {
    setPermisosLocales(prev => 
      prev.map(p => ({ ...p, hasAccess: access }))
    );
  };

  const permisosActivos = permisosLocales.filter(p => p.hasAccess).length;
  const totalPermisos = permisosLocales.length;

  useEffect(() => {
    setPermisosLocales(permisos);
  }, [permisos]);

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div className={ms.overlay} onClick={onClose}>
        <div
          className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border transform animate-scale-in ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={ms.header}>
            <div className="flex items-center gap-4">
              <div className={ms.iconContainer}>
                <FiShield size={28} />
              </div>
              <div>
                <h2 className={ms.title}>Gestión de Permisos</h2>
                <p className={ms.subtitle}>
                  Rol: <span className="font-semibold text-blue-600">{rol?.nombre}</span> • 
                  {permisosActivos} de {totalPermisos} módulos permitidos
                </p>
              </div>
            </div>
            <button onClick={onClose} className={ms.closeButton}>
              <FiX size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin">
            {/* Panel de control rápido */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-8 p-6 rounded-xl border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-blue-50/30 border-gray-100'}`}>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleAll(true)}
                  className={`${ms.button} ${ms.buttonSizes.sm} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500`}
                >
                  <FiCheck size={16} />
                  Permitir Todos
                </button>
                <button
                  onClick={() => toggleAll(false)}
                  className={`${ms.button} ${ms.buttonSizes.sm} ${ms.buttonDanger}`}
                >
                  <FiX size={16} />
                  Denegar Todos
                </button>
              </div>
              <div className="flex-1"></div>
              <div className={`px-4 py-2 rounded-lg border shadow-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {permisosActivos} / {totalPermisos} seleccionados
                </span>
              </div>
            </div>

            {/* Grid de módulos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modulos.map((modulo) => {
                const permiso = permisosLocales.find(p => p.idModulo === modulo.id);
                const tieneAcceso = permiso?.hasAccess || false;
                
                return (
                  <div
                    key={modulo.id}
                    className={`p-6 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                      tieneAcceso
                        ? isDark ? 'bg-green-900/20 border-green-800/50' : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200'
                        : isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
                    }`}
                    onClick={() => togglePermiso(modulo.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${isDark ? 'bg-[var(--color-primary-500)]/10' : 'bg-gradient-to-br from-blue-500/10 to-blue-600/10'}`}>
                            <FiSettings className={isDark ? 'text-[var(--color-primary-400)]' : 'text-blue-600'} size={18} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{modulo.nombre}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              tieneAcceso
                                ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                : isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {tieneAcceso ? 'Permitido' : 'Denegado'}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm mb-3 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{modulo.descripcion}</p>
                        <code className={`text-xs px-2 py-1 rounded-lg font-mono border ${isDark ? 'text-blue-400 bg-blue-900/20 border-blue-800/50' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                          {modulo.ruta}
                        </code>
                      </div>
                      
                      <div className="ml-4">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={tieneAcceso}
                              onChange={() => {}}
                              className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                              tieneAcceso ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${
                              tieneAcceso ? 'transform translate-x-6' : ''
                            }`}></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className={ms.footer}>
            <button
              onClick={onClose}
              disabled={isSaving}
              className={`${ms.button} ${ms.buttonSizes.md} ${ms.buttonSecondary}`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`${ms.button} ${ms.buttonSizes.md} ${ms.buttonPrimary} min-w-[140px]`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FiCheck size={18} />
                  Guardar Permisos
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Modal para confirmar eliminación - PROFESIONAL
export const ModalConfirmar = ({ 
  isOpen, 
  titulo, 
  mensaje, 
  onConfirm, 
  onCancel, 
  tipo = "eliminar",
  confirmText,
  cancelText = "Cancelar"
}: { 
  isOpen: boolean; 
  titulo: string; 
  mensaje: string; 
  onConfirm: () => void; 
  onCancel: () => void; 
  tipo?: string;
  confirmText?: string;
  cancelText?: string;
}) => {
  const { isDark } = useThemeClasses();
  const ms = getModalStyles(isDark);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  const isDanger = tipo === 'eliminar';
  const defaultConfirmText = isDanger ? 'Eliminar' : 'Confirmar';

  return (
    <>
      <style>{styles}</style>
      <div className={ms.overlay} onClick={onCancel}>
        <div
          className={`rounded-2xl shadow-2xl max-w-md w-full border transform animate-scale-in ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                isDanger
                  ? 'bg-gradient-to-br from-red-500/10 to-red-600/10 text-red-600'
                  : 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 text-blue-600'
              }`}>
                <FiAlertCircle size={24} />
              </div>
              <div className="flex-1">
                <h2 className={`text-xl font-semibold mb-2 ${
                  isDanger
                    ? isDark ? 'text-red-400' : 'text-red-700'
                    : isDark ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  {titulo}
                </h2>
                <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{mensaje}</p>
              </div>
            </div>
          </div>
          <div className={ms.footer}>
            <button
              onClick={onCancel}
              disabled={isConfirming}
              className={`${ms.button} ${ms.buttonSizes.md} ${ms.buttonSecondary}`}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className={`${ms.button} ${ms.buttonSizes.md} ${
                isDanger ? ms.buttonDanger : ms.buttonPrimary
              } min-w-[100px]`}
            >
              {isConfirming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                confirmText || defaultConfirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};