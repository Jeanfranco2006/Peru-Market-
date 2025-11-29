import { useState, useEffect } from "react";
import { FiX, FiCheck, FiAlertCircle, FiEyeOff, FiEye, FiSearch, FiShield, FiSettings, FiUser, FiLock, FiMail, FiFileText } from "react-icons/fi";

// Sistema de diseño mejorado con variables CSS-like
const designSystem = {
  colors: {
    primary: {
      50: "from-blue-50 to-blue-100/50",
      100: "from-blue-100 to-blue-200/50",
      500: "from-blue-500 to-blue-600",
      600: "from-blue-600 to-blue-700",
      700: "from-blue-700 to-blue-800",
      text: "text-blue-700"
    },
    danger: {
      50: "from-red-50 to-red-100/50",
      500: "from-red-500 to-red-600",
      600: "from-red-600 to-red-700",
      text: "text-red-700"
    },
    success: {
      50: "from-green-50 to-green-100/50",
      500: "from-green-500 to-green-600",
      text: "text-green-700"
    },
    gray: {
      50: "from-gray-50 to-gray-100/50",
      100: "from-gray-100 to-gray-200/50",
      500: "text-gray-500",
      600: "text-gray-600",
      700: "text-gray-700"
    }
  },
  spacing: {
    xs: "px-3 py-1.5",
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
    xl: "p-8"
  },
  typography: {
    h1: "text-3xl font-bold tracking-tight",
    h2: "text-2xl font-semibold tracking-tight",
    h3: "text-lg font-semibold",
    body: "text-base leading-relaxed",
    caption: "text-sm text-gray-600"
  }
};

// Estilos modales mejorados con sistema de diseño
const modalStyles = {
  overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in",
  container: "bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100 transform animate-scale-in",
  header: "flex justify-between items-center p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white",
  title: `${designSystem.typography.h2} ${designSystem.colors.primary.text}`,
  subtitle: `${designSystem.typography.caption} mt-1`,
  closeButton: "p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-600 hover:scale-105",
  content: "p-8 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
  footer: "border-t border-gray-100 px-8 py-6 bg-gray-50 flex gap-3 justify-end",
  button: "rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
  buttonSizes: {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-base"
  },
  buttonPrimary: `bg-gradient-to-r ${designSystem.colors.primary[500]} hover:${designSystem.colors.primary[600]} text-white focus:ring-blue-500`,
  buttonSecondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
  buttonDanger: `bg-gradient-to-r ${designSystem.colors.danger[500]} hover:${designSystem.colors.danger[600]} text-white focus:ring-red-500`,
  input: "bg-white border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 w-full placeholder-gray-400",
  select: "bg-white border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 w-full",
  badge: "px-3 py-1 rounded-full text-xs font-semibold border",
  card: `bg-gradient-to-br ${designSystem.colors.gray[50]} rounded-xl p-6 border border-gray-100`,
  iconContainer: "p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 text-blue-600"
};

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
      <div className={modalStyles.overlay} onClick={onClose}>
        <div 
          className={modalStyles.container} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className={modalStyles.header}>
            <div>
              <h2 className={modalStyles.title}>{titulo}</h2>
              {subtitulo && <p className={modalStyles.subtitle}>{subtitulo}</p>}
            </div>
            <button 
              onClick={onClose} 
              className={modalStyles.closeButton}
              aria-label="Cerrar modal"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className={modalStyles.content}>
            {children}
          </div>
          <div className={modalStyles.footer}>
            <button
              onClick={onClose}
              className={`${modalStyles.button} ${modalStyles.buttonSizes.md} ${modalStyles.buttonSecondary}`}
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select
            value={value || 'ACTIVO'}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`${modalStyles.select} ${errors[key] ? 'border-red-500 bg-red-50' : ''}`}
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select
            value={value || 'DNI'}
            onChange={(e) => handleChange(key, e.target.value)}
            className={modalStyles.select}
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rol del Sistema</label>
          <select
            value={value || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`${modalStyles.select} ${errors[key] ? 'border-red-500 bg-red-50' : ''}`}
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              className={`${modalStyles.input} ${errors[key] ? 'border-red-500 bg-red-50' : ''} pl-10 pr-12`}
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                className={`${modalStyles.input} ${errors[key] ? 'border-red-500 bg-red-50' : ''} pl-10`}
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
                className={`${modalStyles.button} ${modalStyles.buttonSizes.md} ${modalStyles.buttonSecondary} whitespace-nowrap`}
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FieldIcon type={key} />
          </div>
          <input
            type={key.includes('correo') ? 'email' : key.includes('telefono') ? 'tel' : key.includes('fecha') ? 'date' : 'text'}
            value={value || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className={`${modalStyles.input} ${errors[key] ? 'border-red-500 bg-red-50' : ''} pl-10`}
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
      <div className={modalStyles.overlay} onClick={onClose}>
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-gray-100 transform animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={modalStyles.header}>
            <div>
              <h2 className={modalStyles.title}>{titulo}</h2>
              {subtitulo && <p className={modalStyles.subtitle}>{subtitulo}</p>}
            </div>
            <button onClick={onClose} className={modalStyles.closeButton}>
              <FiX size={20} />
            </button>
          </div>
          <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin">
            {Object.entries(formData).map(([key, value]) => renderField(key, value))}
          </div>
          <div className={modalStyles.footer}>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className={`${modalStyles.button} ${modalStyles.buttonSizes.md} ${modalStyles.buttonSecondary}`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`${modalStyles.button} ${modalStyles.buttonSizes.md} ${modalStyles.buttonPrimary} min-w-[120px]`}
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
      <div className={modalStyles.overlay} onClick={onClose}>
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-100 transform animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={modalStyles.header}>
            <div className="flex items-center gap-4">
              <div className={modalStyles.iconContainer}>
                <FiShield size={28} />
              </div>
              <div>
                <h2 className={modalStyles.title}>Gestión de Permisos</h2>
                <p className={modalStyles.subtitle}>
                  Rol: <span className="font-semibold text-blue-600">{rol?.nombre}</span> • 
                  {permisosActivos} de {totalPermisos} módulos permitidos
                </p>
              </div>
            </div>
            <button onClick={onClose} className={modalStyles.closeButton}>
              <FiX size={20} />
            </button>
          </div>
          
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin">
            {/* Panel de control rápido */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => toggleAll(true)}
                  className={`${modalStyles.button} ${modalStyles.buttonSizes.sm} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500`}
                >
                  <FiCheck size={16} />
                  Permitir Todos
                </button>
                <button
                  onClick={() => toggleAll(false)}
                  className={`${modalStyles.button} ${modalStyles.buttonSizes.sm} ${modalStyles.buttonDanger}`}
                >
                  <FiX size={16} />
                  Denegar Todos
                </button>
              </div>
              <div className="flex-1"></div>
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-700">
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
                        ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200' 
                        : 'bg-white border-gray-200'
                    }`}
                    onClick={() => togglePermiso(modulo.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                            <FiSettings className="text-blue-600" size={18} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{modulo.nombre}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              tieneAcceso 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {tieneAcceso ? 'Permitido' : 'Denegado'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{modulo.descripcion}</p>
                        <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg font-mono border border-blue-100">
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
          
          <div className={modalStyles.footer}>
            <button
              onClick={onClose}
              disabled={isSaving}
              className={`${modalStyles.button} ${modalStyles.buttonSizes.md} ${modalStyles.buttonSecondary}`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`${modalStyles.button} ${modalStyles.buttonSizes.md} ${modalStyles.buttonPrimary} min-w-[140px]`}
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
      <div className={modalStyles.overlay} onClick={onCancel}>
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 transform animate-scale-in"
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
                  isDanger ? 'text-red-700' : 'text-blue-700'
                }`}>
                  {titulo}
                </h2>
                <p className="text-gray-600 leading-relaxed">{mensaje}</p>
              </div>
            </div>
          </div>
          <div className={modalStyles.footer}>
            <button
              onClick={onCancel}
              disabled={isConfirming}
              className={`${modalStyles.button} ${modalStyles.buttonSizes.md} ${modalStyles.buttonSecondary}`}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className={`${modalStyles.button} ${modalStyles.buttonSizes.md} ${
                isDanger ? modalStyles.buttonDanger : modalStyles.buttonPrimary
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