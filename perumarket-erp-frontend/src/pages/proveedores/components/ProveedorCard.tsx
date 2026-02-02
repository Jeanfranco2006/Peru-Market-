import React from 'react';
import {
    FaTrash, FaBuilding, FaPhone, FaEnvelope, FaUser, FaIdCard, FaPen, FaCheckCircle, FaBan, FaBoxOpen
} from 'react-icons/fa';
import type { ProveedorData } from '../../../types/proveedor/proveedorType';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

interface Props {
    proveedor: ProveedorData;
    onEdit: (p: ProveedorData) => void;
    onDelete: (p: ProveedorData) => void;
    onViewProducts: (p: ProveedorData) => void;
}

export default function ProveedorCard({ proveedor, onEdit, onDelete, onViewProducts }: Props) {
    const { isDark } = useThemeClasses();
    const isActive = proveedor.estado?.toUpperCase() === 'ACTIVO';

    const estadoInfo = isActive
        ? { label: 'Activo', color: isDark ? "text-emerald-400 bg-emerald-900/30 border-emerald-700 ring-emerald-500/20" : "text-emerald-700 bg-emerald-50 border-emerald-100 ring-emerald-500/20" }
        : { label: 'Inactivo', color: isDark ? "text-gray-400 bg-gray-700 border-gray-600 ring-gray-500/20" : "text-slate-600 bg-slate-50 border-slate-200 ring-slate-500/20" };

    // @ts-ignore
    const nombreEmpresa = proveedor.razonSocial || proveedor.razon_social || "Sin Razon Social";

    return (
        <div className={`group relative flex flex-col h-full ${isDark ? 'bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-black/30' : 'bg-white border-slate-200 hover:shadow-xl hover:shadow-slate-200/60'} rounded-2xl shadow-sm border hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>

            {/* --- HEADER VISUAL --- */}
            <div className="h-24 w-full bg-gradient-to-r from-sky-600 via-blue-500 to-blue-600 relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border shadow-sm ring-1 backdrop-blur-md flex items-center gap-1.5 ${estadoInfo.color}`}>
                        {isActive ? <FaCheckCircle size={10} /> : <FaBan size={10} />}
                        {estadoInfo.label}
                    </span>
                </div>
            </div>

            {/* --- BODY --- */}
            <div className="px-6 flex-1 flex flex-col relative">
                <div className="-mt-10 mb-4 flex justify-between items-end">
                    <div className={`relative rounded-2xl p-1 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm ring-1 ${isDark ? 'ring-gray-700' : 'ring-slate-100'}`}>
                        <div className={`h-16 w-16 rounded-xl ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-slate-100'} flex items-center justify-center text-blue-600 shadow-inner`}>
                            <FaBuilding size={28} />
                        </div>
                    </div>
                    <div className="mb-1 hidden sm:block">
                        <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-gray-400 bg-gray-700 border-gray-600' : 'text-slate-600 bg-slate-50 border-slate-200'} px-3 py-1 rounded-full border flex items-center gap-1.5`}>
                            <FaIdCard className={isDark ? 'text-gray-500' : 'text-slate-400'} />
                            {proveedor.ruc}
                        </span>
                    </div>
                </div>

                <div className="mb-5">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-gray-200 group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'} leading-tight transition-colors line-clamp-2`} title={nombreEmpresa}>
                        {nombreEmpresa}
                    </h3>
                    <div className={`sm:hidden mt-2 inline-flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400 bg-gray-700 border-gray-600' : 'text-slate-500 bg-slate-50 border-slate-100'} font-mono px-2 py-0.5 rounded border`}>
                        <FaIdCard /> {proveedor.ruc}
                    </div>
                </div>

                <div className={`border-t border-dashed ${isDark ? 'border-gray-700' : 'border-slate-200'} mb-5`}></div>

                <div className="space-y-4 mb-4">
                    <InfoItem icon={<FaUser />} label="Contacto" value={proveedor.contacto} isDark={isDark} />
                    <div className="grid grid-cols-1 gap-3">
                        <InfoItem icon={<FaEnvelope />} label="Email Corporativo" value={proveedor.correo} isEmail isDark={isDark} />
                        <InfoItem icon={<FaPhone />} label="Telefono" value={proveedor.telefono} mono isDark={isDark} />
                    </div>
                </div>

                <div className="flex-grow min-h-[10px]"></div>
            </div>

            {/* --- FOOTER DE ACCIONES --- */}
            <div className={`px-4 py-3 ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-slate-50/80 border-slate-100'} border-t flex items-center gap-2 backdrop-blur-sm mt-auto`}>
                <button
                    onClick={() => onViewProducts(proveedor)}
                    className={`p-2 ${isDark ? 'text-indigo-400 bg-indigo-900/30 hover:bg-indigo-900/50 border-indigo-700' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'} border rounded-lg transition-colors group/btn`}
                    title="Ver catalogo de productos"
                >
                    <FaBoxOpen className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                </button>

                <button
                    onClick={() => onEdit(proveedor)}
                    className={`flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white ${isDark ? 'bg-gray-700 hover:bg-blue-600' : 'bg-slate-900 hover:bg-blue-600'} rounded-lg shadow-sm hover:shadow-blue-200 hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                    <FaPen className="w-3 h-3 mr-2" />
                    Editar
                </button>

                <button
                    onClick={() => onDelete(proveedor)}
                    className={`p-2 ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'} rounded-lg transition-colors border border-transparent hover:border-red-100`}
                    title="Eliminar registro"
                >
                    <FaTrash className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
    isEmail?: boolean;
    mono?: boolean;
    isDark?: boolean;
}

const InfoItem = ({ icon, label, value, isEmail, mono, isDark }: InfoItemProps) => (
  <div className="flex items-start gap-3 group/item">
    <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full ${isDark ? 'bg-gray-700 border-gray-600 text-gray-500 group-hover/item:text-blue-400 group-hover/item:border-blue-700 group-hover/item:bg-blue-900/30' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover/item:text-blue-500 group-hover/item:border-blue-100 group-hover/item:bg-blue-50'} border flex items-center justify-center transition-colors`}>
      <div className="w-3.5 h-3.5">{icon}</div>
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-[10px] uppercase tracking-wider font-bold ${isDark ? 'text-gray-500' : 'text-slate-400'} mb-0.5`}>{label}</p>
      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'} leading-tight ${isEmail ? 'truncate hover:text-clip hover:whitespace-normal break-all' : 'truncate'} ${mono ? `font-mono tracking-tight ${isDark ? 'text-gray-400' : 'text-slate-600'}` : ''}`} title={value || ""}>
        {value || <span className={`${isDark ? 'text-gray-600' : 'text-slate-300'} italic text-xs`}>No registrado</span>}
      </p>
    </div>
  </div>
);
