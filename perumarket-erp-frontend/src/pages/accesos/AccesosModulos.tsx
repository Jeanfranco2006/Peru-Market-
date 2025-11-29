import { FiSettings, FiEye, FiEdit, FiTrash2, FiLink, FiFileText } from "react-icons/fi";

export const ModulosTab = ({ 
  modulos, 
  searchTerm,
  statusFilter,
  onVerDetalles,
  onEditar,
  onEliminar,
  getEstadoColor
}: {
  modulos: any[];
  searchTerm: string;
  statusFilter: string;
  onVerDetalles: (modulo: any) => void;
  onEditar: (modulo: any) => void;
  onEliminar: (modulo: any) => void;
  getEstadoColor: (estado: string) => string;
}) => {
  
  const modulosFiltrados = modulos.filter(modulo => {
    const matchesSearch = modulo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modulo.ruta.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || modulo.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Módulo</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Descripción</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Ruta</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Estado</th>
              <th className="px-6 py-5 text-right text-sm font-semibold text-gray-700 uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80">
            {modulosFiltrados.map((modulo, index) => (
              <tr 
                key={modulo.id} 
                className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <FiSettings className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{modulo.nombre}</p>
                      {modulo.icono && (
                        <p className="text-sm text-gray-500 mt-1">Icono: {modulo.icono}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-start gap-2 max-w-xs">
                    <FiFileText className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-gray-600 leading-relaxed">{modulo.descripcion}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <FiLink className="text-gray-400" size={16} />
                    <code className="text-sm font-medium text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-200/60">
                      {modulo.ruta}
                    </code>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold ${getEstadoColor(modulo.estado)} border border-white/20 shadow-sm`}>
                    {modulo.estado}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => onVerDetalles(modulo)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-blue-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn shadow-sm hover:shadow-md"
                      title="Ver detalles"
                    >
                      <FiEye size={18} />
                    </button>
                    <button 
                      onClick={() => onEditar(modulo)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-emerald-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn shadow-sm hover:shadow-md"
                      title="Editar"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      onClick={() => onEliminar(modulo)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn shadow-sm hover:shadow-md"
                      title="Eliminar"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden p-4 space-y-4">
        {modulosFiltrados.map((modulo, index) => (
          <div 
            key={modulo.id} 
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <FiSettings className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{modulo.nombre}</p>
                  {modulo.icono && (
                    <p className="text-sm text-gray-500 mt-1">Icono: {modulo.icono}</p>
                  )}
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-semibold ${getEstadoColor(modulo.estado)} border border-white/20 shadow-sm`}>
                {modulo.estado}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <FiFileText className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                <p className="text-gray-600 text-sm leading-relaxed">{modulo.descripcion}</p>
              </div>
              <div className="flex items-center gap-2">
                <FiLink className="text-gray-400" size={16} />
                <code className="text-sm font-medium text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-200/60">
                  {modulo.ruta}
                </code>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => onVerDetalles(modulo)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium shadow-sm"
              >
                <FiEye size={16} />
              </button>
              <button 
                onClick={() => onEditar(modulo)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium shadow-sm"
              >
                <FiEdit size={16} />
              </button>
              <button 
                onClick={() => onEliminar(modulo)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium shadow-sm"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {modulosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FiSettings className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron módulos</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm || statusFilter 
              ? `No hay módulos que coincidan con tu búsqueda${searchTerm ? ` "${searchTerm}"` : ''}${statusFilter ? ` en estado "${statusFilter}"` : ''}`
              : 'No hay módulos configurados en el sistema'
            }
          </p>
        </div>
      )}
    </div>
  );
};