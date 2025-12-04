import React from 'react';
import {
    FaEdit, FaTrash, FaBuilding, FaPhone, FaEnvelope, FaUser, FaIdCard, FaCircle
} from 'react-icons/fa';
import type { ProveedorData } from '../../../types/proveedor/proveedorType';

interface Props {
    proveedor: ProveedorData;
    onEdit: (p: ProveedorData) => void;
    onDelete: (p: ProveedorData) => void;
}

export default function ProveedorCard({ proveedor, onEdit, onDelete }: Props) {
    const isActive = proveedor.estado === 'ACTIVO';

    return (
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-200 border-t-4 border-t-indigo-600 w-full h-full relative overflow-hidden">

            {/* Estado Flotante (Esquina Superior Derecha) */}
            <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-extrabold border flex items-center gap-1 shadow-sm z-10 ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                <FaCircle size={4} className={isActive ? "text-emerald-500" : "text-red-400"} />
                {proveedor.estado}
            </div>

            {/* 1. ENCABEZADO */}
            <div className="p-5 pb-0">
                {/* Icono */}
                <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md mb-4 transition-transform group-hover:scale-110 duration-300">
                    <FaBuilding />
                </div>

                {/* Nombre Empresa */}
                <h3 className="font-black text-slate-900 text-base leading-tight break-words mb-2 pr-10">
                    {proveedor.razon_social}
                </h3>

                {/* RUC */}
                <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-slate-500 text-[10px] font-bold font-mono">
                    <FaIdCard className="text-slate-400" /> {proveedor.ruc}
                </div>
            </div>

            {/* 2. CUERPO (Datos apilados para que quepan en columna estrecha) */}
            <div className="flex-1 px-5 py-4 space-y-3">

                {/* Contacto */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                    <FaUser className="text-slate-400 text-xs shrink-0" />
                    <span className="text-xs font-bold text-slate-600 truncate">
                        {proveedor.contacto || "Sin contacto"}
                    </span>
                </div>

                {/* Teléfono */}
                <div className="flex items-center gap-2">
                    <FaPhone className="text-emerald-600 text-xs shrink-0" />
                    <span className="text-xs font-medium text-slate-500 truncate">{proveedor.telefono || "--"}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-600 text-xs shrink-0" />
                    <span className="text-xs font-medium text-slate-500 truncate" title={proveedor.correo}>
                        {proveedor.correo || "--"}
                    </span>
                </div>
            </div>

            {/* 3. FOOTER */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex gap-2 mt-auto">
                <button onClick={() => onEdit(proveedor)}
                    className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md transform hover:scale-105 flex items-center justify-center gap-2">
                    EDITAR
                </button>
                <button onClick={() => onDelete(proveedor)}
                    className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm transform hover:scale-110">
                    <FaTrash size={10} />
                </button>
            </div>
        </div>
    );
}