import React, { useState } from 'react';
import {
  FaPlus, FaSearch, FaThLarge, FaList, FaAddressBook,
  FaCheckCircle, FaTimesCircle, FaLayerGroup,FaUser, FaPhone, FaEnvelope, FaEdit, FaTrash,
  FaBoxOpen
} from 'react-icons/fa';

import { useProveedores } from '../../hooks/Proveedores/useProveedores';
import type { ProveedorData } from '../../types/proveedor/proveedorType';
import { useThemeClasses } from '../../hooks/useThemeClasses';

// Componentes Hijos
import ProveedorCard from './components/ProveedorCard';
import ProveedorFormModal from './components/ProveedorFormModal';
import ProveedorDeleteModal from './components/ProveedorDeleteModal';
import ProveedorProductosModal from './components/ProveedorProductosModal';

export default function Proveedores() {
  const { proveedores, loading, error, fetchProveedores, addProveedor, editProveedor, removeProveedor } = useProveedores();
  const { isDark, heading, textTertiary, emptyState } = useThemeClasses();

  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVO' | 'INACTIVO'>('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProveedorData | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorData | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  const [showProductsModal, setShowProductsModal] = useState(false);
  const [productsTarget, setProductsTarget] = useState<ProveedorData | undefined>(undefined);

  // Stats
  const totalActivos = proveedores.filter(p => p.estado === 'ACTIVO').length;
  const totalInactivos = proveedores.filter(p => p.estado === 'INACTIVO').length;

  const filteredProveedores = proveedores.filter(p => {
    if (filterStatus === 'ALL') return true;
    return p.estado === filterStatus;
  });

  // Handlers
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchProveedores(searchTerm); };
  const openCreateModal = () => { setIsEditing(false); setSelectedProveedor(undefined); setShowModal(true); };
  const openEditModal = (p: ProveedorData) => { setIsEditing(true); setSelectedProveedor(p); setShowModal(true); };
  const openDeleteModal = (p: ProveedorData) => { setDeleteTarget(p); setShowDeleteModal(true); };

  const openProductsModal = (p: ProveedorData) => {
    setProductsTarget(p);
    setShowProductsModal(true);
  };

  const handleSubmit = async (data: ProveedorData) => {
    const result = isEditing && data.id
      ? await editProveedor(data.id, data)
      : await addProveedor(data);
    if (result.success) setShowModal(false);
    else alert(result.message);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return;
    const result = await removeProveedor(deleteTarget.id);
    if (result.success) setShowDeleteModal(false);
    else alert(result.message);
  };

  // @ts-ignore
  const getNombre = (p: ProveedorData) => p.razonSocial || p.razon_social || "Sin Nombre";

  if (loading && proveedores.length === 0) return <div className={`min-h-screen flex items-center justify-center ${heading} font-bold tracking-widest uppercase text-sm animate-pulse`}>Cargando sistema...</div>;
  if (error) return <div className="p-4 m-8 text-center bg-red-100 text-red-800 border-l-4 border-red-600 shadow">{error}</div>;

  return (
    <div className={`w-full min-h-screen ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-slate-50 text-slate-800'} p-4 md:p-8 font-sans`}>

      {/* HEADER DASHBOARD */}
      <div className={`flex flex-col xl:flex-row items-center mb-8 gap-6 xl:gap-8 border-b ${isDark ? 'border-gray-700' : 'border-slate-200'} pb-8`}>
        <div className="flex items-center gap-4 w-full xl:w-auto justify-center xl:justify-start">
           <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shrink-0">
              <FaAddressBook size={24}/>
           </div>
           <div className="text-center xl:text-left">
              <h1 className={`text-2xl md:text-3xl font-black ${heading} uppercase tracking-tight leading-none`}>Proveedores</h1>
           </div>
        </div>

        {/* STATS CARDS */}
        <div className="w-full xl:flex-1 flex justify-center mt-2 xl:mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-4xl">
                 <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} p-3 rounded-xl border shadow-sm flex items-center gap-3 hover:shadow-md transition-all`}>
                     <div className={`${isDark ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-600'} p-2.5 rounded-lg shrink-0`}><FaLayerGroup size={18}/></div>
                     <div className="min-w-0">
                         <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-slate-400'} uppercase leading-none mb-1`}>Total</p>
                         <p className={`text-xl font-black ${heading} leading-none truncate`}>{proveedores.length}</p>
                     </div>
                 </div>
                 <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} p-3 rounded-xl border shadow-sm flex items-center gap-3 hover:shadow-md transition-all`}>
                     <div className={`${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} p-2.5 rounded-lg shrink-0`}><FaCheckCircle size={18}/></div>
                     <div className="min-w-0">
                         <p className={`text-[10px] font-bold ${isDark ? 'text-emerald-500' : 'text-emerald-500'} uppercase leading-none mb-1`}>Activos</p>
                         <p className={`text-xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-700'} leading-none truncate`}>{totalActivos}</p>
                     </div>
                 </div>
                 <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} p-3 rounded-xl border shadow-sm flex items-center gap-3 hover:shadow-md transition-all`}>
                     <div className={`${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-500'} p-2.5 rounded-lg shrink-0`}><FaTimesCircle size={18}/></div>
                     <div className="min-w-0">
                         <p className={`text-[10px] font-bold ${isDark ? 'text-red-400' : 'text-red-400'} uppercase leading-none mb-1`}>Inactivos</p>
                         <p className={`text-xl font-black ${isDark ? 'text-red-400' : 'text-red-700'} leading-none truncate`}>{totalInactivos}</p>
                     </div>
                 </div>
              </div>
        </div>

        <div className="w-full xl:w-auto flex justify-center xl:justify-end mt-2 xl:mt-0">
              <button onClick={openCreateModal} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all font-bold flex items-center justify-center gap-2 uppercase tracking-wide text-xs md:text-sm">
                 <FaPlus/> <span className="hidden sm:inline">Nuevo Proveedor</span><span className="sm:hidden">Nuevo</span>
              </button>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} p-2 rounded-xl shadow-sm border mb-6 flex flex-col lg:flex-row gap-3`}>
         <form onSubmit={handleSearch} className="flex-1 relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaSearch className={isDark ? 'text-gray-500' : 'text-slate-400'} /></div>
            <input type="text" placeholder="Buscar por RUC o Razon Social" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`block w-full pl-9 pr-3 py-2.5 ${isDark ? 'bg-gray-700 text-gray-200 placeholder-gray-500 focus:bg-gray-600 focus:border-gray-500' : 'bg-slate-50 text-slate-800 focus:bg-white focus:border-slate-300'} border-transparent rounded-lg text-sm font-bold focus:ring-0 transition-all`}/>
         </form>
         <div className={`flex ${isDark ? 'bg-gray-700' : 'bg-slate-100'} p-1 rounded-lg shrink-0 overflow-x-auto`}>
            <button onClick={() => setFilterStatus('ALL')} className={`px-3 py-2 rounded-md text-[10px] font-bold uppercase transition-all ${filterStatus === 'ALL' ? `${isDark ? 'bg-gray-600 text-white' : 'bg-white text-slate-900'} shadow-sm` : `${isDark ? 'text-gray-400' : 'text-slate-400'}`}`}>Todos</button>
            <button onClick={() => setFilterStatus('ACTIVO')} className={`px-3 py-2 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${filterStatus === 'ACTIVO' ? `${isDark ? 'bg-gray-600 text-emerald-400' : 'bg-white text-emerald-600'} shadow-sm` : `${isDark ? 'text-gray-400' : 'text-slate-400'}`}`}><FaCheckCircle/> Activos</button>
            <button onClick={() => setFilterStatus('INACTIVO')} className={`px-3 py-2 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${filterStatus === 'INACTIVO' ? `${isDark ? 'bg-gray-600 text-red-400' : 'bg-white text-red-600'} shadow-sm` : `${isDark ? 'text-gray-400' : 'text-slate-400'}`}`}><FaTimesCircle/> Inactivos</button>
         </div>
         <div className={`hidden lg:block w-px ${isDark ? 'bg-gray-600' : 'bg-slate-200'} my-1`}></div>
         <div className={`flex ${isDark ? 'bg-gray-700' : 'bg-slate-100'} p-1 rounded-lg shrink-0`}>
             <button onClick={()=>setViewMode('grid')} className={`px-3 py-2 rounded-md text-xs font-bold transition-all ${viewMode==='grid' ? `${isDark ? 'bg-gray-600 text-white' : 'bg-white text-slate-900'} shadow-sm` : `${isDark ? 'text-gray-400' : 'text-slate-400'}`}`}><FaThLarge/></button>
             <button onClick={()=>setViewMode('table')} className={`px-3 py-2 rounded-md text-xs font-bold transition-all ${viewMode==='table' ? `${isDark ? 'bg-gray-600 text-white' : 'bg-white text-slate-900'} shadow-sm` : `${isDark ? 'text-gray-400' : 'text-slate-400'}`}`}><FaList/></button>
         </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
          {filteredProveedores.map((p) => (
            <ProveedorCard
                key={p.id}
                proveedor={p}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onViewProducts={openProductsModal}
            />
          ))}
          {filteredProveedores.length === 0 && (
            <div className={`col-span-full py-12 text-center ${emptyState} font-bold`}>No se encontraron datos.</div>
          )}
        </div>
      ) : (
        // Vista Tabla
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className={`${isDark ? 'bg-gray-900 text-gray-300' : 'bg-slate-900 text-white'}`}>
                <tr>
                  <th className="p-4 text-xs font-bold uppercase">Empresa</th>
                  <th className="p-4 text-xs font-bold uppercase">Contacto</th>
                  <th className="p-4 hidden md:table-cell text-xs font-bold uppercase">Info</th>
                  <th className="p-4 text-xs font-bold uppercase">Estado</th>
                  <th className="p-4 text-right text-xs font-bold uppercase">Accion</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-slate-100'} text-sm`}>
                {filteredProveedores.map((p) => (
                  <tr key={p.id} className={`${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className={`p-4 font-bold ${heading}`}>
                        {getNombre(p)}
                        <br/><span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-slate-400'} font-normal`}>{p.ruc}</span>
                    </td>
                    <td className={`p-4 ${textTertiary} flex items-center gap-2`}><FaUser className={isDark ? 'text-gray-500' : 'text-slate-400'}/> {p.contacto}</td>
                    <td className={`p-4 hidden md:table-cell ${textTertiary} text-xs space-y-1`}><div><FaPhone className="inline mr-1"/>{p.telefono}</div><div><FaEnvelope className="inline mr-1"/>{p.correo}</div></td>
                    <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${p.estado === 'ACTIVO' ? (isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-700' : 'bg-emerald-50 text-emerald-700 border-emerald-200') : (isDark ? 'bg-gray-700 text-red-400 border-red-700' : 'bg-slate-50 text-red-600 border-red-200')}`}>{p.estado}</span></td>
                    <td className="p-4 text-right flex justify-end gap-1">
                        <button onClick={()=>openProductsModal(p)} className={`p-2 ${isDark ? 'text-indigo-400 hover:bg-indigo-900/30' : 'text-indigo-500 hover:bg-indigo-50'} rounded-lg transition-colors`} title="Productos"><FaBoxOpen/></button>
                        <button onClick={()=>openEditModal(p)} className={`p-2 ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'} rounded-lg transition-colors`}><FaEdit/></button>
                        <button onClick={()=>openDeleteModal(p)} className={`p-2 ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'} rounded-lg transition-colors`}><FaTrash/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALES */}
      <ProveedorFormModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
            initialData={selectedProveedor}
            isEditing={isEditing}
            existingProviders={proveedores}
      />

      <ProveedorDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            nombreProveedor={deleteTarget ? getNombre(deleteTarget) : ''}
      />

      <ProveedorProductosModal
        isOpen={showProductsModal}
        onClose={() => setShowProductsModal(false)}
        proveedor={productsTarget}
      />
    </div>
  );
}
