import { useMemo, useState } from "react";
import type { Employee } from "../../types/Employee";
import { formatDate } from "../../utils/format";
import { 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiEdit3,
  FiTrash2,
  FiCreditCard,
  FiBriefcase
} from "react-icons/fi";

interface Props {
  data: Employee;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeCard({ data, onEdit, onDelete }: Props) {
  const [imageError, setImageError] = useState(false);

  const nombreCompleto = useMemo(() => 
    `${data.persona.nombres} ${data.persona.apellidoPaterno}`, 
  [data.persona]);

  const isValidFoto = useMemo(() => {
    if (!data.foto || imageError) return false;
    if (data.foto.startsWith('blob:')) return false; 
    
    return (
      data.foto.startsWith('http') || 
      data.foto.startsWith('data:image/')
    );
  }, [data.foto, imageError]);

  const estadoInfo = useMemo(() => {
    const estado = data.estado?.toLowerCase();
    switch(estado) {
      case "activo":
        return { label: 'Activo', color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      case "inactivo":
        return { label: 'Inactivo', color: "text-slate-600 bg-slate-100 border-slate-200" };
      case "vacaciones":
        return { label: 'Vacaciones', color: "text-blue-700 bg-blue-50 border-blue-200" };
      case "licencia":
        return { label: 'Licencia', color: "text-amber-700 bg-amber-50 border-amber-200" };
      default:
        return { label: 'Desconocido', color: "text-slate-500 bg-slate-50 border-slate-200" };
    }
  }, [data.estado]);

  // Clases del botón "Editar" solicitadas
  const primaryButtonClass = "inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 focus:ring-indigo-500";

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden h-full">
      
      {/* --- HEADER: Fondo Indigo Corporativo (Color solicitado) --- */}
      <div className="relative h-24 bg-indigo-600 w-full overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Degradado ajustado a la paleta Indigo para profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>

        {/* Badge de Estado */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border shadow-sm ${estadoInfo.color}`}>
            {estadoInfo.label}
          </span>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="px-5 pb-5 relative flex-1 flex flex-col">
        
        {/* Avatar + Info Principal */}
        <div className="flex flex-col sm:flex-row items-start gap-4 -mt-10 mb-5">
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-md border border-slate-100">
              {isValidFoto ? (
                <img 
                  src={data.foto} 
                  alt={nombreCompleto} 
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover rounded-lg bg-slate-50"
                />
              ) : (
                <div className="h-full w-full rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <span className="text-2xl font-bold">
                    {data.persona.nombres.charAt(0)}{data.persona.apellidoPaterno.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 pt-0 sm:pt-11 text-center sm:text-left w-full">
            <h3 className="text-lg font-bold text-slate-900 leading-tight truncate" title={nombreCompleto}>
              {nombreCompleto}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mt-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-slate-500 font-medium">
                <FiBriefcase className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{data.puesto || "Sin cargo"}</span>
              </div>
              
              {data.sueldo && <span className="hidden sm:inline text-slate-300">|</span>}

              {data.sueldo && (
                <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block mx-auto sm:mx-0">
                  S/. {data.sueldo?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mb-4 w-full"></div>

        {/* Grid de Información */}
        <div className="space-y-3 w-full">
          <InfoItem 
            icon={<FiMapPin />} 
            label="Departamento" 
            value={data.departamento?.nombre} 
          />
          <InfoItem 
            icon={<FiCreditCard />} 
            label="ID / Documento" 
            value={data.persona.numeroDocumento} 
            isMono
          />
          <InfoItem 
            icon={<FiMail />} 
            label="Correo" 
            value={data.persona.correo} 
            isEmail 
          />
          <div className="grid grid-cols-2 gap-2">
            <InfoItem 
              icon={<FiPhone />} 
              label="Móvil" 
              value={data.persona.telefono} 
            />
            <InfoItem 
              icon={<FiCalendar />} 
              label="Ingreso" 
              value={data.fechaContratacion ? formatDate(data.fechaContratacion) : "N/A"} 
            />
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-auto bg-slate-50 border-t border-slate-200 px-4 py-3 flex gap-3">
        {/* Botón Principal (Mismo color que el header) */}
        <button
          onClick={onEdit}
          className={`flex-1 ${primaryButtonClass}`}
        >
          <FiEdit3 className="w-4 h-4 mr-2" />
          Editar
        </button>
        
        {/* Botón Eliminar */}
        <button
          onClick={onDelete}
          className="inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 border border-slate-300 text-slate-700 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-sm focus:ring-red-500"
          title="Eliminar empleado"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value, isEmail, isMono }: { icon: any, label: string, value?: string, isEmail?: boolean, isMono?: boolean }) => (
  <div className="flex items-start gap-3 w-full overflow-hidden">
    <div className="mt-0.5 text-slate-400 flex-shrink-0">
      <div className="w-4 h-4">{icon}</div>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-0.5">
        {label}
      </p>
      <p 
        className={`text-sm text-slate-700 font-medium leading-snug
          ${isEmail ? 'truncate hover:text-clip hover:whitespace-normal transition-all' : 'truncate'}
          ${isMono ? 'font-mono text-slate-600' : ''}
        `} 
        title={value || ""}
      >
        {value || <span className="text-slate-300 italic">No registrado</span>}
      </p>
    </div>
  </div>
);