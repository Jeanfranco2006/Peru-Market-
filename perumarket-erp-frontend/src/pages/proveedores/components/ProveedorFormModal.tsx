import React, { useState, useEffect } from 'react';
import { FaFileSignature, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import type { ProveedorData } from '../../../types/proveedor/proveedorType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProveedorData) => Promise<void>;
  initialData?: ProveedorData;
  isEditing: boolean;
}

const DEFAULT_DATA: ProveedorData = {
  ruc: '', razon_social: '', contacto: '', telefono: '', correo: '', direccion: '', estado: 'ACTIVO'
};

export default function ProveedorFormModal({ isOpen, onClose, onSubmit, initialData, isEditing }: Props) {
  const [formData, setFormData] = useState<ProveedorData>(DEFAULT_DATA);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || DEFAULT_DATA);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeInUp">
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
           <h2 className="text-xl font-bold flex items-center gap-3 uppercase tracking-wide"><FaFileSignature className="text-slate-400"/>{isEditing ? 'Editar Ficha' : 'Nueva Ficha'}</h2>
           <div className="text-xs font-mono opacity-50">ID: {isEditing ? formData.id : 'NEW'}</div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
           <div className="md:col-span-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">Información Fiscal</div>
           <div className="space-y-1"><label className="text-xs font-bold text-slate-700">RUC</label><input name="ruc" value={formData.ruc} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm font-bold font-mono transition-all"/></div>
           <div className="space-y-1"><label className="text-xs font-bold text-slate-700">Razón Social</label><input name="razon_social" value={formData.razon_social} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm font-bold transition-all"/></div>
           <div className="md:col-span-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2 mt-4">Contacto</div>
           <div className="relative"><FaUser className="absolute top-3.5 left-3 text-slate-400"/><input name="contacto" value={formData.contacto} onChange={handleChange} placeholder="Nombre Contacto" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-sm font-medium"/></div>
           <div className="relative"><FaPhone className="absolute top-3.5 left-3 text-slate-400"/><input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-sm font-medium"/></div>
           <div className="relative md:col-span-2"><FaEnvelope className="absolute top-3.5 left-3 text-slate-400"/><input name="correo" type="email" value={formData.correo} onChange={handleChange} placeholder="Correo Electrónico" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-sm font-medium"/></div>
           <div className="relative md:col-span-2"><input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección Fiscal Completa" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 outline-none text-sm font-medium"/></div>
           <div className="md:col-span-2 pt-6 flex items-center justify-between border-t border-slate-100 mt-2">
              <div className="flex items-center gap-3"><span className="text-xs font-bold text-slate-500 uppercase">Estado:</span><select name="estado" value={formData.estado} onChange={handleChange} className="p-2 bg-slate-50 border border-slate-200 rounded text-sm font-bold cursor-pointer outline-none"><option value="ACTIVO">ACTIVO</option><option value="INACTIVO">INACTIVO</option></select></div>
              <div className="flex gap-3"><button type="button" onClick={onClose} className="px-6 py-3 rounded-lg font-bold text-slate-500 bg-slate-200 hover:bg-slate-300 transition-colors text-sm">Cancelar</button><button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition shadow-lg">Guardar</button></div>
           </div>
        </form>
      </div>
    </div>
  );
}