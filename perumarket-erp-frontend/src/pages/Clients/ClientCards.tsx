import type { Cliente } from "../../types/clientes/Client";
import { formatDate } from "../../utils/format";
import { useThemeClasses } from '../../hooks/useThemeClasses';
import {
  FiCreditCard,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit3,
  FiTrash2,
  FiBriefcase,
  FiUser,
  FiMapPin
} from "react-icons/fi";

interface Props {
  data: Cliente;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ClienteCard({ data, onEdit, onDelete }: Props) {
  const { isDark, colors } = useThemeClasses();

  // Safe initials logic
  const iniciales = `${
    data.persona?.nombres?.charAt(0)?.toUpperCase() || ""
  }${data.persona?.apellidoPaterno?.charAt(0)?.toUpperCase() || ""}`;

  const fechaRegistro = data.fechaCreacion ? formatDate(data.fechaCreacion) : "N/A";
  const esJuridica = data.tipo === 'JURIDICA';

  // Theme configuration using accent colors
  const theme = esJuridica
    ? {
        gradient: `from-[${colors[600]}] via-[${colors[500]}] to-[${colors[400]}]`,
        icon: <FiBriefcase />
      }
    : {
        gradient: `from-[${colors[500]}] via-[${colors[400]}] to-[${colors[300]}]`,
        icon: <FiUser />
      };

  return (
    <div className={`group relative flex flex-col h-full rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
      isDark
        ? 'bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1'
        : 'bg-white border-slate-200 hover:shadow-xl hover:shadow-orange-200/40 hover:-translate-y-1'
    }`}>

      {/* --- HEADER VISUAL (Cover) --- */}
      <div
        className="h-28 w-full relative"
        style={{
          background: `linear-gradient(to right, ${colors[600]}, ${colors[500]}, ${colors[400]})`
        }}
      >
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        {/* Floating Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border shadow-sm ring-1 backdrop-blur-md flex items-center gap-1.5 ${
            isDark
              ? 'bg-gray-800/90 text-gray-200 border-gray-600/50 ring-gray-500/20'
              : 'bg-white/90 text-orange-800 border-white/50 ring-orange-500/20'
          }`}>
            {theme.icon}
            {data.tipo}
          </span>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="px-6 flex-1 flex flex-col relative">

        {/* Overlapping Avatar/Initial with thick ring */}
        <div className="-mt-12 mb-4 flex justify-between items-end">
          <div className={`relative rounded-2xl p-1 shadow-sm ring-1 ${isDark ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-slate-100'}`}>
            {/* Avatar */}
            <div className={`h-20 w-20 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner ${
              isDark ? 'bg-gray-700' : 'bg-gradient-to-br from-orange-50 to-slate-100'
            }`} style={isDark ? undefined : undefined}>
               <span className="text-2xl font-bold tracking-tight" style={{ color: colors[500] }}>
                 {iniciales}
               </span>
            </div>
          </div>

          {/* ID Pill (Discrete) */}
          <div className="mb-1 hidden sm:block">
            <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
              isDark
                ? 'text-gray-400 bg-gray-700 border-gray-600'
                : 'text-slate-500 bg-slate-50 border-slate-200'
            }`}>
              ID: {data.id?.toString().padStart(4, '0')}
            </span>
          </div>
        </div>

        {/* Main Info: Name & Document */}
        <div className="mb-6">
          <h3 className={`text-lg font-bold leading-tight transition-colors truncate ${
            isDark ? 'text-gray-100 group-hover:text-orange-400' : 'text-slate-800 group-hover:text-orange-600'
          }`} title={`${data.persona.nombres} ${data.persona.apellidoPaterno}`}>
            {data.persona.nombres} {data.persona.apellidoPaterno}
          </h3>
          <div className={`flex items-center gap-2 mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            <FiCreditCard className="w-3.5 h-3.5" style={{ color: colors[500] }} />
            <p className="text-sm font-medium truncate">
              {data.persona.tipoDocumento}: <span className={isDark ? 'text-gray-300 font-mono' : 'text-slate-700 font-mono'}>{data.persona.numeroDocumento}</span>
            </p>
          </div>
        </div>

        {/* Dashed Separator */}
        <div className={`border-t border-dashed mb-5 ${isDark ? 'border-gray-700' : 'border-slate-200'}`}></div>

        {/* Data Grid (Clean Layout) */}
        <div className="space-y-4">

          {/* Row 1: Email */}
          <InfoItem
            icon={<FiMail />}
            label="Email"
            value={data.persona.correo}
            isEmail
            isDark={isDark}
            colors={colors}
          />

          {/* Row 2: Phone & Date */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              icon={<FiPhone />}
              label="Teléfono"
              value={data.persona.telefono}
              isDark={isDark}
              colors={colors}
            />
            <InfoItem
              icon={<FiCalendar />}
              label="Registro"
              value={fechaRegistro}
              isDark={isDark}
              colors={colors}
            />
          </div>

          {/* Row 3: Address */}
          <InfoItem
            icon={<FiMapPin />}
            label="Dirección"
            value={data.persona.direccion}
            truncate
            isDark={isDark}
            colors={colors}
          />
        </div>

        {/* Flexible Spacer */}
        <div className="flex-grow min-h-[20px]"></div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className={`px-4 py-3 border-t flex items-center gap-3 backdrop-blur-sm ${
        isDark
          ? 'bg-gray-900/50 border-gray-700'
          : 'bg-slate-50/80 border-slate-100'
      }`}>
        <button
          onClick={onEdit}
          className={`flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${
            isDark ? '' : 'bg-slate-900 hover:bg-orange-600 hover:shadow-orange-200'
          }`}
          style={{ backgroundColor: isDark ? colors[600] : undefined }}
        >
          <FiEdit3 className="w-4 h-4 mr-2" />
          Administrar
        </button>

        <button
          onClick={onDelete}
          className={`p-2 rounded-lg transition-colors border border-transparent ${
            isDark
              ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30 hover:border-red-800'
              : 'text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100'
          }`}
          title="Eliminar cliente"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// --- Subcomponent InfoItem ---
const InfoItem = ({ icon, label, value, isEmail, truncate, isDark }: any) => (
  <div className="flex items-start gap-3 group/item">
    {/* Encapsulated Icon */}
    <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
      isDark
        ? 'bg-gray-700 border-gray-600 text-gray-400 group-hover/item:bg-gray-600 group-hover/item:border-gray-500'
        : 'bg-slate-50 border-slate-100 text-slate-400 group-hover/item:bg-white group-hover/item:border-orange-200'
    }`}
    >
      <div className="w-3.5 h-3.5">
        {icon}
      </div>
    </div>

    <div className="min-w-0 flex-1">
      <p className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
        {label}
      </p>
      <p
        className={`text-sm font-medium leading-tight
          ${isDark ? 'text-gray-300' : 'text-slate-700'}
          ${isEmail ? 'truncate hover:text-clip hover:whitespace-normal break-all' : ''}
          ${truncate ? 'truncate' : ''}
        `}
        title={value || ""}
      >
        {value || <span className={`italic text-xs ${isDark ? 'text-gray-600' : 'text-slate-300'}`}>--</span>}
      </p>
    </div>
  </div>
);
