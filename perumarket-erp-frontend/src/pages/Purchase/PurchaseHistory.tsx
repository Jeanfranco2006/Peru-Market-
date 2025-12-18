import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { 
  IoMdAdd, IoIosEye, IoIosList, IoIosSearch, 
  IoIosDocument, IoIosCash, IoIosCalendar, 
  IoMdArrowRoundBack 
} from "react-icons/io";
import { api } from '../../services/api';

interface Compra {
  id: number;
  numeroComprobante: string;
  tipoComprobante: string;
  fechaCompra: string; 
  total: number;
  estado: string;
  proveedor: { razonSocial: string; };
  almacen: { nombre: string; };
}

// Helper para estilos de estado (Más sutiles)
const getStatusStyles = (status: string) => {
  const s = status ? status.toUpperCase() : '';
  switch (s) {
    case 'COMPLETADO': case 'APROBADO': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/20';
    case 'PENDIENTE': return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/20';
    case 'CANCELADO': return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/20';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 ring-1 ring-slate-600/20';
  }
};

// Helper para obtener iniciales del proveedor (Visual candy)
const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : '??';
};

export default function PurchaseList() {
  const navigate = useNavigate();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await api.get('/compras');
        setCompras(response.data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
  }, []);

  const comprasFiltradas = useMemo(() => {
    return compras.filter(compra => {
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        (compra.numeroComprobante || '').toLowerCase().includes(term) ||
        (compra.proveedor?.razonSocial || '').toLowerCase().includes(term);
      const matchEstado = filterEstado === 'all' || compra.estado === filterEstado;
      return matchSearch && matchEstado;
    });
  }, [searchTerm, filterEstado, compras]);

  const totalCompras = compras.reduce((sum, c) => sum + c.total, 0);
  const comprasCompletadas = compras.filter(c => c.estado === 'COMPLETADO' || c.estado === 'APROBADO').length;
  const comprasPendientes = compras.filter(c => c.estado === 'PENDIENTE').length;

  const formatearFecha = (fecha: string) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-PE', {
        day: '2-digit', month: 'short', year: 'numeric' // Month short es más limpio
    });
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans text-slate-600">
      
      {/* Header Superior con fondo blanco para separar del contenido */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Link to="/" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        <IoMdArrowRoundBack className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Historial de Compras</h1>
                        <p className="text-sm text-slate-500">Gestiona tus adquisiciones y proveedores</p>
                    </div>
                </div>
                
                <Link to="/compras/nueva" 
                    className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-sm shadow-indigo-200">
                    <IoMdAdd className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    Nueva Compra
                </Link>
            </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid - Estilo Bento */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <IoIosDocument className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Operaciones</p>
                <p className="text-2xl font-bold text-slate-800">{compras.length}</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <IoIosCash className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Invertido</p>
                <p className="text-2xl font-bold text-slate-800">S/ {totalCompras.toLocaleString('es-PE', {minimumFractionDigits: 2})}</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <IoIosCalendar className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completadas</p>
                <p className="text-2xl font-bold text-slate-800">{comprasCompletadas}</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <IoIosCalendar className="w-6 h-6"/>
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pendientes</p>
                <p className="text-2xl font-bold text-slate-800">{comprasPendientes}</p>
            </div>
          </div>
        </div>

        {/* Contenedor Principal de la Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Barra de Filtros */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <IoIosSearch className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder='Buscar por N° comprobante o proveedor...'
                        className='w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all'
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm text-slate-500 hidden sm:block">Estado:</span>
                    <select className="w-full md:w-auto border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-sm text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                        value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                        <option value="all">Todos</option>
                        <option value="COMPLETADO">Completado</option>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CANCELADO">Cancelado</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Comprobante</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Proveedor</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Almacén</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {comprasFiltradas.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">No se encontraron registros que coincidan con tu búsqueda.</td></tr>
                        ) : (
                            comprasFiltradas.map((compra) => (
                                <tr key={compra.id} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-indigo-600">{compra.numeroComprobante || 'S/N'}</div>
                                        <div className="text-xs text-slate-400">{compra.tipoComprobante}</div>
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3">
                                                {getInitials(compra.proveedor?.razonSocial)}
                                            </div>
                                            <div className="text-sm font-medium text-slate-700">
                                                {compra.proveedor?.razonSocial || 'Desconocido'}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {compra.almacen?.nombre || '-'}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {formatearFecha(compra.fechaCompra)}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-slate-700">
                                        S/ {compra.total?.toFixed(2)}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(compra.estado)}`}>
                                            {compra.estado}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Link to={`/compras/historial/${compra.id}`} 
                                            className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-indigo-50 inline-block">
                                            <IoIosEye className="w-5 h-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}