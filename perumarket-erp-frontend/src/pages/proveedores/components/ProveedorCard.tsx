import React from 'react';
import {
    FaTrash, FaBuilding, FaPhone, FaEnvelope, FaUser, FaIdCard, FaPen, FaCheckCircle, FaBan
} from 'react-icons/fa';
import type { ProveedorData } from '../../../types/proveedor/proveedorType';

interface Props {
    proveedor: ProveedorData;
    onEdit: (p: ProveedorData) => void;
    onDelete: (p: ProveedorData) => void;
}

export default function ProveedorCard({ proveedor, onEdit, onDelete }: Props) {
    const isActive = proveedor.estado === 'ACTIVO';

    // Configuración de estado (similar a EmployeeCard)
    const estadoInfo = isActive 
        ? { label: 'Activo', color: "text-emerald-700 bg-emerald-50 border-emerald-100 ring-emerald-500/20" }
        : { label: 'Inactivo', color: "text-slate-600 bg-slate-50 border-slate-200 ring-slate-500/20" };

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            
            {/* --- HEADER VISUAL (Cover) --- */}
            {/* Usamos Cyan/Blue para distinguir proveedores de empleados */}
            <div className="h-24 w-full bg-gradient-to-r from-sky-600 via-blue-500 to-blue-600 relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                
                {/* Badge Flotante */}
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border shadow-sm ring-1 backdrop-blur-md flex items-center gap-1.5 ${estadoInfo.color}`}>
                        {isActive ? <FaCheckCircle size={10} /> : <FaBan size={10} />}
                        {estadoInfo.label}
                    </span>
                </div>
            </div>

            {/* --- BODY --- */}
            <div className="px-6 flex-1 flex flex-col relative">
                
                {/* Icono Principal Superpuesto (Reemplaza al Avatar) */}
                <div className="-mt-10 mb-4 flex justify-between items-end">
                    <div className="relative rounded-2xl p-1 bg-white shadow-sm ring-1 ring-slate-100">
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-blue-600 shadow-inner">
                            <FaBuilding size={28} />
                        </div>
                    </div>
                    
                    {/* RUC Pill (Discreto) */}
                    <div className="mb-1 hidden sm:block">
                        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
                            <FaIdCard className="text-slate-400" />
                            {proveedor.ruc}
                        </span>
                    </div>
                </div>

                {/* Info Principal: Razón Social */}
                <div className="mb-5">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2" title={proveedor.razon_social}>
                        {proveedor.razon_social}
                    </h3>
                    {/* RUC visible en móvil aquí si se oculta arriba */}
                    <div className="sm:hidden mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        <FaIdCard /> {proveedor.ruc}
                    </div>
                </div>

                {/* Separador punteado */}
                <div className="border-t border-dashed border-slate-200 mb-5"></div>

                {/* Grid de Datos (InfoItem Style) */}
                <div className="space-y-4 mb-4">
                    
                    {/* Contacto Principal */}
                    <InfoItem 
                        icon={<FaUser />} 
                        label="Contacto" 
                        value={proveedor.contacto} 
                    />

                    <div className="grid grid-cols-1 gap-3">
                        {/* Email */}
                        <InfoItem 
                            icon={<FaEnvelope />} 
                            label="Email Corporativo" 
                            value={proveedor.correo} 
                            isEmail
                        />
                        {/* Teléfono */}
                        <InfoItem 
                            icon={<FaPhone />} 
                            label="Teléfono" 
                            value={proveedor.telefono} 
                            mono
                        />
                    </div>
                </div>

                {/* Espaciador flexible */}
                <div className="flex-grow min-h-[10px]"></div>
            </div>

            {/* --- FOOTER DE ACCIONES --- */}
            <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-3 backdrop-blur-sm mt-auto">
                <button
                    onClick={() => onEdit(proveedor)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-blue-200 hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FaPen className="w-3 h-3 mr-2" />
                    Editar
                </button>

                <button
                    onClick={() => onDelete(proveedor)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Eliminar registro"
                >
                    <FaTrash className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// --- Subcomponente InfoItem (Idéntico al de EmployeeCard para consistencia) ---
const InfoItem = ({ icon, label, value, isEmail, mono }: any) => (
  <div className="flex items-start gap-3 group/item">
    {/* Icono encapsulado */}
    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-blue-500 group-hover/item:border-blue-100 group-hover/item:bg-blue-50 transition-colors">
      <div className="w-3.5 h-3.5">{icon}</div>
    </div>
    
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
        {label}
      </p>
      <p 
        className={`text-sm font-medium text-slate-700 leading-tight
          ${isEmail ? 'truncate hover:text-clip hover:whitespace-normal break-all' : 'truncate'}
          ${mono ? 'font-mono tracking-tight text-slate-600' : ''}
        `} 
        title={value || ""}
      >
        {value || <span className="text-slate-300 italic text-xs">No registrado</span>}
      </p>
    </div>
  </div>
);