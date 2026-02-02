import React, { useState, useEffect } from 'react';
import { FaFileSignature, FaUser, FaPhone, FaEnvelope, FaExclamationCircle, FaBuilding, FaMapMarkerAlt, FaTimes, FaSave, FaIdCard } from 'react-icons/fa';
import type { ProveedorData } from '../../../types/proveedor/proveedorType';
import { useThemeClasses } from '../../../hooks/useThemeClasses';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProveedorData) => Promise<void>;
  initialData?: ProveedorData;
  isEditing: boolean;
  existingProviders?: ProveedorData[];
}

const DEFAULT_DATA: ProveedorData = {
  ruc: '', razon_social: '', contacto: '', telefono: '', correo: '', direccion: '', estado: 'ACTIVO'
};

export default function ProveedorFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
  existingProviders = []
}: Props) {
  const [formData, setFormData] = useState<ProveedorData>(DEFAULT_DATA);
  const [error, setError] = useState<string | null>(null);
  const { isDark, heading, textTertiary } = useThemeClasses();

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || DEFAULT_DATA);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'ruc' || name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.ruc.trim() || !formData.razon_social.trim() || !formData.contacto.trim() || !formData.telefono.trim()) {
      setError('Por favor complete todos los campos obligatorios.');
      return false;
    }

    if (existingProviders && existingProviders.length > 0) {
      const normalizedRuc = formData.ruc.trim();
      const duplicate = existingProviders.find(p => {
        if (isEditing && String(p.id) === String(formData.id)) return false;
        return String(p.ruc) === normalizedRuc;
      });

      if (duplicate) {
        setError(`El RUC ${normalizedRuc} ya existe en el sistema.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Error al guardar. Intente nuevamente.');
    }
  };

  if (!isOpen) return null;

  const inputContainerClass = "relative group";
  const labelClass = `block text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-slate-500'} uppercase tracking-wider mb-1.5 ml-1`;
  const iconClass = `absolute top-[2.4rem] left-3.5 ${isDark ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'} transition-colors z-10 text-sm`;
  const inputClass = `w-full pl-10 pr-4 py-2.5 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} border rounded-xl text-sm font-medium focus:outline-none transition-all`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 transition-opacity duration-300">

      <div className={`
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh]
          overflow-y-auto flex flex-col relative animate-fadeInUp border
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      `}>

        {/* === HEADER === */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} p-5 border-b flex justify-between items-center sticky top-0 z-30`}>
           <div className="flex items-center gap-3">
             <div className={`${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} p-2.5 rounded-lg`}>
                <FaFileSignature size={20} />
             </div>
             <div>
                <h2 className={`text-lg font-bold ${heading} tracking-tight`}>
                  {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </h2>
                <p className={`text-xs ${textTertiary} font-medium`}>Complete la ficha tecnica</p>
             </div>
           </div>

           <button onClick={onClose} className={`${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'} p-2 rounded-full transition-colors`}>
              <FaTimes />
           </button>
        </div>

        {/* === ERROR ALERT === */}
        {error && (
          <div className={`mx-6 mt-6 p-4 ${isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-100'} border rounded-xl flex items-start gap-3 animate-pulse`}>
            <FaExclamationCircle className="text-red-500 text-lg shrink-0 mt-0.5" />
            <div>
              <h4 className={`text-sm font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>Atencion</h4>
              <p className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'} font-medium`}>{error}</p>
            </div>
          </div>
        )}

        {/* === FORMULARIO === */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* SECCION: FISCAL */}
            <div className={`md:col-span-2 flex items-center gap-2 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'} mb-2`}>
                <FaBuilding className={isDark ? 'text-gray-500' : 'text-slate-400'} />
                <span className={`text-xs font-bold ${heading} uppercase tracking-widest`}>Informacion Fiscal</span>
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>RUC <span className="text-red-500">*</span></label>
              <FaIdCard className={iconClass} />
              <input
                type="text"
                inputMode="numeric"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                maxLength={20}
                placeholder="Ej: 20123456789"
                className={`${inputClass} font-mono tracking-wide`}
              />
              <div className={`absolute right-3 top-[2.5rem] text-[9px] font-bold ${isDark ? 'text-gray-500 bg-gray-600' : 'text-slate-400 bg-slate-100'} px-1.5 rounded`}>
                {formData.ruc.length}/11
              </div>
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>Razon Social <span className="text-red-500">*</span></label>
              <FaBuilding className={iconClass} />
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                className={inputClass}
                placeholder="Nombre de la empresa"
              />
            </div>

            {/* SECCION: CONTACTO */}
            <div className={`md:col-span-2 flex items-center gap-2 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'} mb-2 mt-2`}>
                <FaUser className={isDark ? 'text-gray-500' : 'text-slate-400'} />
                <span className={`text-xs font-bold ${heading} uppercase tracking-widest`}>Contacto Directo</span>
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>Persona de Contacto <span className="text-red-500">*</span></label>
              <FaUser className={iconClass} />
              <input
                type="text"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                placeholder="Nombre completo"
                className={inputClass}
              />
            </div>

            <div className={inputContainerClass}>
              <label className={labelClass}>Telefono <span className="text-red-500">*</span></label>
              <FaPhone className={iconClass} />
              <input
                type="text"
                inputMode="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="999 999 999"
                maxLength={9}
                className={inputClass}
              />
            </div>

            <div className={`${inputContainerClass} md:col-span-2`}>
              <label className={labelClass}>Correo Electronico</label>
              <FaEnvelope className={iconClass} />
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="ejemplo@empresa.com"
                className={inputClass}
              />
            </div>

            <div className={`${inputContainerClass} md:col-span-2`}>
              <label className={labelClass}>Direccion Fiscal</label>
              <FaMapMarkerAlt className={iconClass} />
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Av. Principal 123, Oficina 404"
                className={inputClass}
              />
            </div>

            <div className={`md:col-span-2 ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-slate-50 border-slate-100'} p-4 rounded-xl border mt-2`}>
              <label className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider mb-2 block`}>Estado del Proveedor</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer group">
                    <input
                        type="radio"
                        name="estado"
                        value="ACTIVO"
                        checked={formData.estado === 'ACTIVO'}
                        onChange={handleChange}
                        className="hidden peer"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 ${isDark ? 'border-gray-500' : 'border-slate-300'} peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all relative`}></div>
                    <span className={`ml-2 text-sm font-medium ${isDark ? 'text-gray-400 peer-checked:text-white' : 'text-slate-600 peer-checked:text-slate-900'}`}>Activo</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                    <input
                        type="radio"
                        name="estado"
                        value="INACTIVO"
                        checked={formData.estado === 'INACTIVO'}
                        onChange={handleChange}
                        className="hidden peer"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 ${isDark ? 'border-gray-500' : 'border-slate-300'} peer-checked:border-red-500 peer-checked:bg-red-500 transition-all relative`}></div>
                    <span className={`ml-2 text-sm font-medium ${isDark ? 'text-gray-400 peer-checked:text-white' : 'text-slate-600 peer-checked:text-slate-900'}`}>Inactivo</span>
                </label>
              </div>
            </div>

            {/* === FOOTER === */}
            <div className={`
               md:col-span-2 flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'}
            `}>
                <button
                    type="button"
                    onClick={onClose}
                    className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold ${isDark ? 'text-gray-400 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-gray-200' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-800'} border transition-all text-sm`}
                >
                  Cancelar
                </button>
                <button
                    type="submit"
                    className={`w-full md:w-auto px-8 py-2.5 ${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-blue-600'} text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 transform active:scale-95`}
                >
                  <FaSave />
                  {isEditing ? 'Guardar Cambios' : 'Registrar Proveedor'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
