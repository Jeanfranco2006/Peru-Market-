import { useMemo, useState } from "react";
import type { Employee } from "../../types/Employee";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { formatDate } from "../../utils/format";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit3,
  FiTrash2,
  FiCreditCard,
  FiBriefcase,
} from "react-icons/fi";

interface Props {
  data: Employee;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeCard({ data, onEdit, onDelete }: Props) {
  const [imageError, setImageError] = useState(false);
  const theme = useThemeClasses();

  // --- Logica Original (Intacta) ---
  const nombreCompleto = useMemo(() =>
    `${data.persona.nombres} ${data.persona.apellidoPaterno}`,
  [data.persona]);

  const isValidFoto = useMemo(() => {
    if (!data.foto || imageError) return false;
    if (data.foto.startsWith('blob:')) return false;
    return (data.foto.startsWith('http') || data.foto.startsWith('data:image/'));
  }, [data.foto, imageError]);

  const estadoInfo = useMemo(() => {
    const estado = data.estado?.toLowerCase();
    switch(estado) {
      case "activo":
        return {
          label: 'Activo',
          color: theme.isDark
            ? "text-emerald-400 bg-emerald-900/30 border-emerald-800 ring-emerald-500/20"
            : "text-emerald-700 bg-emerald-50 border-emerald-100 ring-emerald-500/20"
        };
      case "inactivo":
        return {
          label: 'Inactivo',
          color: theme.isDark
            ? "text-gray-400 bg-gray-700 border-gray-600 ring-gray-500/20"
            : "text-slate-600 bg-slate-50 border-slate-200 ring-slate-500/20"
        };
      case "vacaciones":
        return {
          label: 'Vacaciones',
          color: theme.isDark
            ? "text-blue-400 bg-blue-900/30 border-blue-800 ring-blue-500/20"
            : "text-blue-700 bg-blue-50 border-blue-100 ring-blue-500/20"
        };
      case "licencia":
        return {
          label: 'Licencia',
          color: theme.isDark
            ? "text-amber-400 bg-amber-900/30 border-amber-800 ring-amber-500/20"
            : "text-amber-700 bg-amber-50 border-amber-100 ring-amber-500/20"
        };
      default:
        return {
          label: 'Desconocido',
          color: theme.isDark
            ? "text-gray-400 bg-gray-700 border-gray-600 ring-gray-500/20"
            : "text-slate-500 bg-slate-50 border-slate-200 ring-slate-500/20"
        };
    }
  }, [data.estado, theme.isDark]);

  return (
    <div className={`group relative flex flex-col h-full rounded-2xl shadow-sm border ${theme.cardHover} hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>

      {/* --- HEADER VISUAL (Cover) --- */}
      <div className={`h-28 w-full ${theme.gradientPrimary} relative`}>
        {/* Patron decorativo moderno */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        {/* Badge Flotante (Glassmorphism) */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm ring-1 backdrop-blur-md ${estadoInfo.color}`}>
            {estadoInfo.label}
          </span>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="px-6 flex-1 flex flex-col relative">

        {/* Avatar Superpuesto con anillo grueso */}
        <div className="-mt-12 mb-4 flex justify-between items-end">
          <div className={`relative rounded-2xl p-1 shadow-sm ring-1 ${theme.isDark ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-slate-100'}`}>
            <div className={`h-20 w-20 rounded-xl overflow-hidden ${theme.subtleBg} relative`}>
              {isValidFoto ? (
                <img
                  src={data.foto}
                  alt={nombreCompleto}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className={`h-full w-full ${theme.isDark ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-slate-100 to-slate-200'} flex items-center justify-center ${theme.textTertiary}`}>
                  <span className="text-2xl font-bold tracking-tight">
                    {data.persona.nombres.charAt(0)}{data.persona.apellidoPaterno.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sueldo (Pill discreto al lado del avatar) */}
          {data.sueldo && (
             <div className="mb-1 hidden sm:block">
               <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                 theme.isDark ? 'text-gray-300 bg-gray-700 border-gray-600' : 'text-slate-600 bg-slate-100 border-slate-200'
               }`}>
                 S/. {data.sueldo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
               </span>
             </div>
          )}
        </div>

        {/* Info Principal: Nombre y Cargo */}
        <div className="mb-6">
          <h3 className={`text-lg font-bold leading-tight transition-colors truncate ${theme.heading}`} title={nombreCompleto}>
            {nombreCompleto}
          </h3>
          <div className={`flex items-center gap-2 mt-1 ${theme.textTertiary}`}>
            <FiBriefcase className="w-4 h-4" style={{ color: 'var(--color-primary-400)' }} />
            <p className="text-sm font-medium truncate">{data.puesto || "Sin cargo asignado"}</p>
          </div>
        </div>

        {/* Separador punteado */}
        <div className={`border-t border-dashed ${theme.border} mb-5`}></div>

        {/* Grid de Datos (Layout mas limpio) */}
        <div className="space-y-4">

          {/* Fila 1: Departamento & DNI */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              icon={<FiMapPin />}
              label="Area"
              value={data.departamento?.nombre}
              delay="0"
              theme={theme}
            />
            <InfoItem
              icon={<FiCreditCard />}
              label="DNI"
              value={data.persona.numeroDocumento}
              mono
              delay="75"
              theme={theme}
            />
          </div>

          {/* Fila 2: Contacto */}
          <div className="space-y-3">
             <InfoItem
                icon={<FiMail />}
                label="Email Corporativo"
                value={data.persona.correo}
                isEmail
                delay="150"
                theme={theme}
             />
             <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={<FiPhone />}
                  label="Telefono"
                  value={data.persona.telefono}
                  delay="225"
                  theme={theme}
                />
                <InfoItem
                  icon={<FiCalendar />}
                  label="Ingreso"
                  value={data.fechaContratacion ? formatDate(data.fechaContratacion) : "N/A"}
                  delay="300"
                  theme={theme}
                />
             </div>
          </div>
        </div>

        {/* Espaciador flexible para empujar el footer al fondo si el card crece */}
        <div className="flex-grow min-h-[20px]"></div>
      </div>

      {/* --- FOOTER DE ACCIONES --- */}
      <div className={`px-4 py-3 border-t flex items-center gap-3 backdrop-blur-sm ${
        theme.isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-slate-50/80 border-slate-100'
      }`}>
        <button
          onClick={onEdit}
          className={`flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${theme.btnPrimary}`}
        >
          <FiEdit3 className="w-4 h-4 mr-2" />
          Administrar
        </button>

        <button
          onClick={onDelete}
          className={`p-2 rounded-lg transition-colors border border-transparent ${
            theme.isDark
              ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20 hover:border-red-800'
              : 'text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100'
          }`}
          title="Eliminar registro"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// --- Subcomponente de Info Modernizado ---
const InfoItem = ({ icon, label, value, isEmail, mono, delay, theme }: any) => (
  <div
    className="flex items-start gap-3 group/item"
  >
    {/* Icono encapsulado con fondo suave */}
    <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
      theme.isDark
        ? 'bg-gray-700 border-gray-600 text-gray-400 group-hover/item:text-[var(--color-primary-400)] group-hover/item:border-[var(--color-primary-800)] group-hover/item:bg-[var(--color-primary-900)]/20'
        : 'bg-slate-50 border-slate-100 text-slate-400 group-hover/item:text-indigo-500 group-hover/item:border-indigo-100 group-hover/item:bg-indigo-50'
    }`}>
      <div className="w-3.5 h-3.5">{icon}</div>
    </div>

    <div className="min-w-0 flex-1">
      <p className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${theme.isDark ? 'text-gray-500' : 'text-slate-400'}`}>
        {label}
      </p>
      <p
        className={`text-sm font-medium leading-tight ${theme.textSecondary}
          ${isEmail ? 'truncate hover:text-clip hover:whitespace-normal break-all' : 'truncate'}
          ${mono ? 'font-mono tracking-tight' : ''}
        `}
        title={value || ""}
      >
        {value || <span className={`italic text-xs ${theme.isDark ? 'text-gray-600' : 'text-slate-300'}`}>Sin datos</span>}
      </p>
    </div>
  </div>
);
