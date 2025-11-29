import { FiLock, FiEye, FiEdit, FiTrash2, FiShield, FiUsers, FiLayers } from "react-icons/fi";

export const RolesTab = ({ 
  roles, 
  searchTerm,
  onVerDetalles,
  onEditar,
  onEliminar,
  onGestionarPermisos
}: {
  roles: any[];
  searchTerm: string;
  onVerDetalles: (rol: any) => void;
  onEditar: (rol: any) => void;
  onEliminar: (rol: any) => void;
  onGestionarPermisos: (rol: any) => void;
}) => {
  
  const rolesFiltrados = roles.filter(rol =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Rol</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Descripción</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Usuarios</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Módulos</th>
              <th className="px-6 py-5 text-right text-sm font-semibold text-gray-700 uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80">
            {rolesFiltrados.map((rol, index) => (
              <tr 
                key={rol.id} 
                className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <FiLock className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{rol.nombre}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-gray-600 max-w-xs leading-relaxed">{rol.descripcion}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-gray-400" size={16} />
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                      {rol.usuarios_count || 0} usuarios
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <FiLayers className="text-gray-400" size={16} />
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {rol.modulos_activos || 0} módulos
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => onVerDetalles(rol)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-blue-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn"
                      title="Ver detalles"
                    >
                      <FiEye size={18} />
                    </button>
                    <button 
                      onClick={() => onGestionarPermisos(rol)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-purple-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn"
                      title="Gestionar permisos"
                    >
                      <FiShield size={18} />
                    </button>
                    <button 
                      onClick={() => onEditar(rol)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-emerald-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn"
                      title="Editar"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      onClick={() => onEliminar(rol)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn"
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
        {rolesFiltrados.map((rol, index) => (
          <div 
            key={rol.id} 
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <FiLock className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{rol.nombre}</p>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{rol.descripcion}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200/60">
                <FiUsers className="text-blue-600" size={16} />
                <span className="font-semibold text-blue-700">{rol.usuarios_count || 0} usuarios</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200/60">
                <FiLayers className="text-emerald-600" size={16} />
                <span className="font-semibold text-emerald-700">{rol.modulos_activos || 0} módulos</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onVerDetalles(rol)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
              >
                <FiEye size={16} /> Detalles
              </button>
              <button 
                onClick={() => onGestionarPermisos(rol)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
              >
                <FiShield size={16} /> Permisos
              </button>
              <button 
                onClick={() => onEditar(rol)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
              >
                <FiEdit size={16} /> Editar
              </button>
              <button 
                onClick={() => onEliminar(rol)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
              >
                <FiTrash2 size={16} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {rolesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FiLock className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron roles</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            No hay roles que coincidan con tu búsqueda "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};