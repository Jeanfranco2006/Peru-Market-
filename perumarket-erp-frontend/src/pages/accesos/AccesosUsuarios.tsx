import { FiUser, FiEye, FiEdit, FiTrash2, FiMail, FiCalendar } from "react-icons/fi";
import { useThemeClasses } from "../../hooks/useThemeClasses";

export const UsuariosTab = ({
  usuarios, searchTerm, statusFilter, onVerDetalles, onEditar, onEliminar,
  getNombreCompleto, getEstadoColor, getRolColor
}: {
  usuarios: any[]; searchTerm: string; statusFilter: string;
  onVerDetalles: (usuario: any) => void; onEditar: (usuario: any) => void;
  onEliminar: (usuario: any) => void; getNombreCompleto: (persona: any) => string;
  getEstadoColor: (estado: string) => string; getRolColor: (rolNombre: string) => string;
}) => {
  const { isDark, colors, card, tableHeader, tableHeaderText, heading, textTertiary } = useThemeClasses();

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchesSearch = usuario.persona?.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.persona?.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || usuario.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`rounded-2xl shadow-sm overflow-hidden border ${card}`}>
      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className={tableHeader}>
            <tr>
              {['Usuario', 'Información Personal', 'Rol', 'Estado', 'Último Acceso'].map(h => (
                <th key={h} className={`px-6 py-5 text-left text-sm font-semibold uppercase tracking-wide ${tableHeaderText}`}>{h}</th>
              ))}
              <th className={`px-6 py-5 text-right text-sm font-semibold uppercase tracking-wide ${tableHeaderText}`}>Acciones</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100/80'}`}>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id} className={`transition-all duration-200 group ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50/50'}`}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}>
                      <FiUser className="text-white" size={20} />
                    </div>
                    <div>
                      <p className={`font-bold text-lg ${heading}`}>@{usuario.username}</p>
                      <div className={`flex items-center gap-1.5 mt-1 ${textTertiary}`}>
                        <FiMail size={14} />
                        <p className="text-sm">{usuario.persona?.correo}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className={`font-semibold text-lg ${heading}`}>{getNombreCompleto(usuario.persona!)}</p>
                  <p className={`text-sm mt-1 ${textTertiary}`}>{usuario.persona?.tipo_documento} • {usuario.persona?.numero_documento}</p>
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
                  <div className={`flex items-center gap-2 ${textTertiary}`}>
                    <FiCalendar size={16} />
                    <span className="font-medium">{usuario.ultimoAcceso}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-1">
                    {[
                      { icon: FiEye, onClick: () => onVerDetalles(usuario), color: 'blue', title: 'Ver detalles' },
                      { icon: FiEdit, onClick: () => onEditar(usuario), color: 'emerald', title: 'Editar' },
                      { icon: FiTrash2, onClick: () => onEliminar(usuario), color: 'red', title: 'Eliminar' },
                    ].map(({ icon: Icon, onClick, color, title }) => (
                      <button key={title} onClick={onClick} title={title}
                        className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md ${isDark ? `text-gray-400 hover:text-white hover:bg-${color}-600` : `text-gray-400 hover:text-white hover:bg-${color}-500`}`}>
                        <Icon size={18} />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden p-4 space-y-4">
        {usuariosFiltrados.map((usuario) => (
          <div key={usuario.id} className={`border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ${card}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}>
                  <FiUser className="text-white" size={20} />
                </div>
                <div>
                  <p className={`font-bold text-lg ${heading}`}>@{usuario.username}</p>
                  <p className={`text-sm mt-1 ${textTertiary}`}>{getNombreCompleto(usuario.persona!)}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-semibold ${getEstadoColor(usuario.estado)}`}>
                {usuario.estado}
              </span>
            </div>
            <div className="space-y-3 mb-4">
              <div className={`flex items-center gap-2 ${textTertiary}`}><FiMail size={16} /><span className="text-sm">{usuario.persona?.correo}</span></div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${textTertiary}`}>Rol:</span>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-semibold ${getRolColor(usuario.rol?.nombre || '')} text-white`}>{usuario.rol?.nombre}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => onVerDetalles(usuario)} className="flex items-center justify-center py-3 text-white rounded-xl text-sm font-medium shadow-sm"
                style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}><FiEye size={16} /></button>
              <button onClick={() => onEditar(usuario)} className="flex items-center justify-center py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm"><FiEdit size={16} /></button>
              <button onClick={() => onEliminar(usuario)} className="flex items-center justify-center py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium shadow-sm"><FiTrash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {usuariosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiUser className={isDark ? 'text-gray-500' : 'text-gray-400'} size={32} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${heading}`}>No se encontraron usuarios</h3>
          <p className={`max-w-sm mx-auto ${textTertiary}`}>
            {searchTerm || statusFilter
              ? `No hay usuarios que coincidan con tu búsqueda${searchTerm ? ` "${searchTerm}"` : ''}${statusFilter ? ` en estado "${statusFilter}"` : ''}`
              : 'No hay usuarios registrados en el sistema'}
          </p>
        </div>
      )}
    </div>
  );
};
