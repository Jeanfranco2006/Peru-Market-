import { FiUser, FiEye, FiEdit, FiTrash2, FiMail, FiCalendar } from "react-icons/fi";

export const UsuariosTab = ({ 
  usuarios, 
  searchTerm, 
  statusFilter,
  onVerDetalles,
  onEditar,
  onEliminar,
  getNombreCompleto,
  getEstadoColor,
  getRolColor
}: {
  usuarios: any[];
  searchTerm: string;
  statusFilter: string;
  onVerDetalles: (usuario: any) => void;
  onEditar: (usuario: any) => void;
  onEliminar: (usuario: any) => void;
  getNombreCompleto: (persona: any) => string;
  getEstadoColor: (estado: string) => string;
  getRolColor: (rolNombre: string) => string;
}) => {
  
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesSearch = usuario.persona?.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.persona?.correo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || usuario.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Usuario</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Información Personal</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Rol</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Estado</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Último Acceso</th>
              <th className="px-6 py-5 text-right text-sm font-semibold text-gray-700 uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80">
            {usuariosFiltrados.map((usuario, index) => (
              <tr 
                key={usuario.id} 
                className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <FiUser className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">@{usuario.username}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                        <FiMail size={14} />
                        <p className="text-sm">{usuario.persona?.correo}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="font-semibold text-gray-900 text-lg">{getNombreCompleto(usuario.persona!)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {usuario.persona?.tipo_documento} • {usuario.persona?.numero_documento}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold shadow-sm ${getRolColor(usuario.rol?.nombre || '')} text-white border border-white/20`}>
                    {usuario.rol?.nombre}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold ${getEstadoColor(usuario.estado)} border border-white/20 shadow-sm`}>
                    {usuario.estado}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar size={16} />
                    <span className="font-medium">{usuario.ultimoAcceso}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => onVerDetalles(usuario)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-blue-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn shadow-sm hover:shadow-md"
                      title="Ver detalles"
                    >
                      <FiEye size={18} />
                    </button>
                    <button 
                      onClick={() => onEditar(usuario)}
                      className="p-2.5 text-gray-400 hover:text-white hover:bg-emerald-500 rounded-xl transition-all duration-200 hover:scale-105 group/btn shadow-sm hover:shadow-md"
                      title="Editar"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      onClick={() => onEliminar(usuario)}
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
        {usuariosFiltrados.map((usuario, index) => (
          <div 
            key={usuario.id} 
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <FiUser className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">@{usuario.username}</p>
                  <p className="text-gray-500 text-sm mt-1">{getNombreCompleto(usuario.persona!)}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-semibold ${getEstadoColor(usuario.estado)} border border-white/20 shadow-sm`}>
                {usuario.estado}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiMail size={16} />
                <span className="text-sm">{usuario.persona?.correo}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm font-medium">Documento:</span>
                <span className="text-sm">{usuario.persona?.tipo_documento} {usuario.persona?.numero_documento}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Rol:</span>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-semibold ${getRolColor(usuario.rol?.nombre || '')} text-white border border-white/20 shadow-sm`}>
                  {usuario.rol?.nombre}
                </span>
              </div>
              {usuario.ultimoAcceso && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar size={16} />
                  <span className="text-sm">Último acceso: {usuario.ultimoAcceso}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => onVerDetalles(usuario)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium shadow-sm"
              >
                <FiEye size={16} />
              </button>
              <button 
                onClick={() => onEditar(usuario)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium shadow-sm"
              >
                <FiEdit size={16} />
              </button>
              <button 
                onClick={() => onEliminar(usuario)}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium shadow-sm"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {usuariosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm || statusFilter 
              ? `No hay usuarios que coincidan con tu búsqueda${searchTerm ? ` "${searchTerm}"` : ''}${statusFilter ? ` en estado "${statusFilter}"` : ''}`
              : 'No hay usuarios registrados en el sistema'
            }
          </p>
        </div>
      )}
    </div>
  );
};