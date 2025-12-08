import type { Cliente } from "../../types/clientes/Client";
import { formatDate } from "../../utils/format";
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
  // Safe initials logic
  const iniciales = `${
    data.persona?.nombres?.charAt(0)?.toUpperCase() || ""
  }${data.persona?.apellidoPaterno?.charAt(0)?.toUpperCase() || ""}`;

  const fechaRegistro = data.fechaCreacion ? formatDate(data.fechaCreacion) : "N/A";
  const esJuridica = data.tipo === 'JURIDICA';

  // Theme configuration (Orange/Amber Palette)
  const theme = esJuridica 
    ? { 
        // Gradiente más sobrio para empresas
        gradient: 'from-orange-600 via-orange-500 to-amber-500',
        icon: <FiBriefcase /> 
      }
    : { 
        // Gradiente más brillante para personas
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        icon: <FiUser /> 
      };

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-orange-200/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      
      {/* --- HEADER VISUAL (Cover Orange) --- */}
      <div className={`h-28 w-full bg-gradient-to-r ${theme.gradient} relative`}>
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        {/* Floating Badge (Glassmorphism with Orange tint) */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border shadow-sm ring-1 backdrop-blur-md flex items-center gap-1.5 bg-white/90 text-orange-800 border-white/50 ring-orange-500/20`}>
            {theme.icon}
            {data.tipo}
          </span>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="px-6 flex-1 flex flex-col relative">
        
        {/* Overlapping Avatar/Initial with thick ring */}
        <div className="-mt-12 mb-4 flex justify-between items-end">
          <div className="relative rounded-2xl p-1 bg-white shadow-sm ring-1 ring-slate-100">
            {/* Avatar con un toque cálido */}
            <div className="h-20 w-20 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center text-orange-600 relative shadow-inner">
               <span className="text-2xl font-bold tracking-tight">
                 {iniciales}
               </span>
            </div>
          </div>
          
          {/* ID Pill (Discrete) */}
          <div className="mb-1 hidden sm:block">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              ID: {data.id?.toString().padStart(4, '0')}
            </span>
          </div>
        </div>

        {/* Main Info: Name & Document */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors truncate" title={`${data.persona.nombres} ${data.persona.apellidoPaterno}`}>
            {data.persona.nombres} {data.persona.apellidoPaterno}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-slate-500">
            <FiCreditCard className="w-3.5 h-3.5 text-orange-500" />
            <p className="text-sm font-medium truncate">
              {data.persona.tipoDocumento}: <span className="text-slate-700 font-mono">{data.persona.numeroDocumento}</span>
            </p>
          </div>
        </div>

        {/* Dashed Separator */}
        <div className="border-t border-dashed border-slate-200 mb-5"></div>

        {/* Data Grid (Clean Layout) */}
        <div className="space-y-4">
          
          {/* Row 1: Email */}
          <InfoItem 
            icon={<FiMail />} 
            label="Email" 
            value={data.persona.correo} 
            isEmail
          />

          {/* Row 2: Phone & Date */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem 
              icon={<FiPhone />} 
              label="Teléfono" 
              value={data.persona.telefono} 
            />
            <InfoItem 
              icon={<FiCalendar />} 
              label="Registro" 
              value={fechaRegistro} 
            />
          </div>

          {/* Row 3: Address */}
          <InfoItem 
            icon={<FiMapPin />} 
            label="Dirección" 
            value={data.persona.direccion} 
            truncate
          />
        </div>

        {/* Flexible Spacer */}
        <div className="flex-grow min-h-[20px]"></div>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-3 backdrop-blur-sm">
        <button
          onClick={onEdit}
          // Botón principal naranja
          className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-orange-200 hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <FiEdit3 className="w-4 h-4 mr-2" />
          Administrar
        </button>

        <button
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          title="Eliminar cliente"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// --- Subcomponent InfoItem (Standardized with Orange Accent) ---
const InfoItem = ({ icon, label, value, isEmail, truncate }: any) => (
  <div className="flex items-start gap-3 group/item">
    {/* Encapsulated Icon with Orange hover */}
    <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:bg-white group-hover/item:border-orange-200 group-hover/item:text-orange-500 transition-colors`}>
      <div className="w-3.5 h-3.5">{icon}</div>
    </div>
    
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
        {label}
      </p>
      <p 
        className={`text-sm font-medium text-slate-700 leading-tight
          ${isEmail ? 'truncate hover:text-clip hover:whitespace-normal break-all' : ''}
          ${truncate ? 'truncate' : ''}
        `} 
        title={value || ""}
      >
        {value || <span className="text-slate-300 italic text-xs">--</span>}
      </p>
    </div>
  </div>
);