import { FiLock, FiEye, FiEdit, FiTrash2, FiShield, FiUsers, FiLayers } from "react-icons/fi";
import { useThemeClasses } from "../../hooks/useThemeClasses";

export const RolesTab = ({
  roles, searchTerm, onVerDetalles, onEditar, onEliminar, onGestionarPermisos
}: {
  roles: any[]; searchTerm: string;
  onVerDetalles: (rol: any) => void; onEditar: (rol: any) => void;
  onEliminar: (rol: any) => void; onGestionarPermisos: (rol: any) => void;
}) => {
  const { isDark, colors, card, tableHeader, tableHeaderText, heading, textTertiary } = useThemeClasses();

  const rolesFiltrados = roles.filter(rol =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`rounded-2xl shadow-sm overflow-hidden border ${card}`}>
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className={tableHeader}>
            <tr>
              {['Rol', 'Descripción', 'Usuarios', 'Módulos'].map(h => (
                <th key={h} className={`px-6 py-5 text-left text-sm font-semibold uppercase tracking-wide ${tableHeaderText}`}>{h}</th>
              ))}
              <th className={`px-6 py-5 text-right text-sm font-semibold uppercase tracking-wide ${tableHeaderText}`}>Acciones</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100/80'}`}>
            {rolesFiltrados.map((rol) => (
              <tr key={rol.id} className={`transition-all duration-200 group ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50/50'}`}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}>
                      <FiLock className="text-white" size={20} />
                    </div>
                    <p className={`font-semibold text-lg ${heading}`}>{rol.nombre}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className={`max-w-xs leading-relaxed ${textTertiary}`}>{rol.descripcion}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <FiUsers className={isDark ? 'text-gray-500' : 'text-gray-400'} size={16} />
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'bg-blue-50 text-blue-700 border border-blue-200/60'}`}>
                      {rol.usuarios_count || 0} usuarios
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <FiLayers className={isDark ? 'text-gray-500' : 'text-gray-400'} size={16} />
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${isDark ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'}`}>
                      {rol.modulos_activos || 0} módulos
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onVerDetalles(rol)} className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? 'text-gray-400 hover:text-white hover:bg-blue-600' : 'text-gray-400 hover:text-white hover:bg-blue-500'}`} title="Ver detalles"><FiEye size={18} /></button>
                    <button onClick={() => onGestionarPermisos(rol)} className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? 'text-gray-400 hover:text-white hover:bg-purple-600' : 'text-gray-400 hover:text-white hover:bg-purple-500'}`} title="Permisos"><FiShield size={18} /></button>
                    <button onClick={() => onEditar(rol)} className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? 'text-gray-400 hover:text-white hover:bg-emerald-600' : 'text-gray-400 hover:text-white hover:bg-emerald-500'}`} title="Editar"><FiEdit size={18} /></button>
                    <button onClick={() => onEliminar(rol)} className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? 'text-gray-400 hover:text-white hover:bg-red-600' : 'text-gray-400 hover:text-white hover:bg-red-500'}`} title="Eliminar"><FiTrash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden p-4 space-y-4">
        {rolesFiltrados.map((rol) => (
          <div key={rol.id} className={`border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all ${card}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}>
                <FiLock className="text-white" size={20} />
              </div>
              <div>
                <p className={`font-bold text-lg ${heading}`}>{rol.nombre}</p>
                <p className={`text-sm mt-1 ${textTertiary}`}>{rol.descripcion}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDark ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-blue-50 border border-blue-200/60'}`}>
                <FiUsers className={isDark ? 'text-blue-400' : 'text-blue-600'} size={16} />
                <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{rol.usuarios_count || 0}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDark ? 'bg-emerald-900/30 border border-emerald-800/50' : 'bg-emerald-50 border border-emerald-200/60'}`}>
                <FiLayers className={isDark ? 'text-emerald-400' : 'text-emerald-600'} size={16} />
                <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{rol.modulos_activos || 0}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => onVerDetalles(rol)} className="flex items-center justify-center gap-2 py-3 text-white rounded-xl text-sm font-medium" style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}><FiEye size={16} /> Detalles</button>
              <button onClick={() => onGestionarPermisos(rol)} className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium"><FiShield size={16} /> Permisos</button>
              <button onClick={() => onEditar(rol)} className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium"><FiEdit size={16} /> Editar</button>
              <button onClick={() => onEliminar(rol)} className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium"><FiTrash2 size={16} /> Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {rolesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiLock className={isDark ? 'text-gray-500' : 'text-gray-400'} size={32} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${heading}`}>No se encontraron roles</h3>
          <p className={`max-w-sm mx-auto ${textTertiary}`}>No hay roles que coincidan con tu búsqueda "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};
