import { FiSettings, FiEye, FiEdit, FiTrash2, FiLink, FiFileText } from "react-icons/fi";
import { useThemeClasses } from "../../hooks/useThemeClasses";

export const ModulosTab = ({
  modulos, searchTerm, statusFilter, onVerDetalles, onEditar, onEliminar, getEstadoColor
}: {
  modulos: any[]; searchTerm: string; statusFilter: string;
  onVerDetalles: (modulo: any) => void; onEditar: (modulo: any) => void;
  onEliminar: (modulo: any) => void; getEstadoColor: (estado: string) => string;
}) => {
  const { isDark, colors, card, tableHeader, tableHeaderText, heading, textTertiary } = useThemeClasses();

  const modulosFiltrados = modulos.filter(modulo => {
    const matchesSearch = modulo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modulo.ruta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || modulo.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`rounded-2xl shadow-sm overflow-hidden border ${card}`}>
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className={tableHeader}>
            <tr>
              {['Módulo', 'Descripción', 'Ruta', 'Estado'].map(h => (
                <th key={h} className={`px-6 py-5 text-left text-sm font-semibold uppercase tracking-wide ${tableHeaderText}`}>{h}</th>
              ))}
              <th className={`px-6 py-5 text-right text-sm font-semibold uppercase tracking-wide ${tableHeaderText}`}>Acciones</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100/80'}`}>
            {modulosFiltrados.map((modulo) => (
              <tr key={modulo.id} className={`transition-all duration-200 group ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50/50'}`}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}>
                      <FiSettings className="text-white" size={20} />
                    </div>
                    <div>
                      <p className={`font-bold text-lg ${heading}`}>{modulo.nombre}</p>
                      {modulo.icono && <p className={`text-sm mt-1 ${textTertiary}`}>Icono: {modulo.icono}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-start gap-2 max-w-xs">
                    <FiFileText className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                    <p className={`leading-relaxed ${textTertiary}`}>{modulo.descripcion}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <FiLink className={isDark ? 'text-gray-500' : 'text-gray-400'} size={16} />
                    <code className={`text-sm font-medium px-3 py-1.5 rounded-xl border ${isDark ? 'text-blue-400 bg-blue-900/20 border-blue-800/50' : 'text-blue-600 bg-blue-50/50 border-blue-200/60'}`}>
                      {modulo.ruta}
                    </code>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold ${getEstadoColor(modulo.estado)} shadow-sm`}>
                    {modulo.estado}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onVerDetalles(modulo)} className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? 'text-gray-400 hover:text-white hover:bg-blue-600' : 'text-gray-400 hover:text-white hover:bg-blue-500'}`} title="Ver"><FiEye size={18} /></button>
                    <button onClick={() => onEditar(modulo)} className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? 'text-gray-400 hover:text-white hover:bg-emerald-600' : 'text-gray-400 hover:text-white hover:bg-emerald-500'}`} title="Editar"><FiEdit size={18} /></button>
                    <button onClick={() => onEliminar(modulo)} className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${isDark ? 'text-gray-400 hover:text-white hover:bg-red-600' : 'text-gray-400 hover:text-white hover:bg-red-500'}`} title="Eliminar"><FiTrash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden p-4 space-y-4">
        {modulosFiltrados.map((modulo) => (
          <div key={modulo.id} className={`border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all ${card}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}>
                  <FiSettings className="text-white" size={20} />
                </div>
                <div>
                  <p className={`font-bold text-lg ${heading}`}>{modulo.nombre}</p>
                  {modulo.icono && <p className={`text-sm mt-1 ${textTertiary}`}>Icono: {modulo.icono}</p>}
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-semibold ${getEstadoColor(modulo.estado)}`}>{modulo.estado}</span>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <FiFileText className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                <p className={`text-sm leading-relaxed ${textTertiary}`}>{modulo.descripcion}</p>
              </div>
              <div className="flex items-center gap-2">
                <FiLink className={isDark ? 'text-gray-500' : 'text-gray-400'} size={16} />
                <code className={`text-sm font-medium px-3 py-1.5 rounded-xl border ${isDark ? 'text-blue-400 bg-blue-900/20 border-blue-800/50' : 'text-blue-600 bg-blue-50/50 border-blue-200/60'}`}>{modulo.ruta}</code>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => onVerDetalles(modulo)} className="flex items-center justify-center py-3 text-white rounded-xl text-sm font-medium shadow-sm" style={{ background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` }}><FiEye size={16} /></button>
              <button onClick={() => onEditar(modulo)} className="flex items-center justify-center py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm"><FiEdit size={16} /></button>
              <button onClick={() => onEliminar(modulo)} className="flex items-center justify-center py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium shadow-sm"><FiTrash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {modulosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiSettings className={isDark ? 'text-gray-500' : 'text-gray-400'} size={32} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${heading}`}>No se encontraron módulos</h3>
          <p className={`max-w-sm mx-auto ${textTertiary}`}>
            {searchTerm || statusFilter
              ? `No hay módulos que coincidan con tu búsqueda${searchTerm ? ` "${searchTerm}"` : ''}${statusFilter ? ` en estado "${statusFilter}"` : ''}`
              : 'No hay módulos configurados en el sistema'}
          </p>
        </div>
      )}
    </div>
  );
};
