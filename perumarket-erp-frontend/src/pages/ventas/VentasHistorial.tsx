import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoMdArrowRoundBack, IoMdAdd
} from 'react-icons/io';
import {
  IoIosDocument, IoIosCash, IoIosCheckmarkCircle, IoIosTime, IoIosSearch
} from 'react-icons/io';
import { FaReceipt, FaTruck } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { ventaService } from '../../services/ventas/ventaService';
import ModalTicket from './ModalTicket';

// --- ESTILOS DE ESTADO ---
const getStatusStylesLight = (status: string) => {
  const s = status ? status.toUpperCase() : '';
  switch (s) {
    case 'COMPLETADA': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/20';
    case 'PENDIENTE': return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/20';
    case 'ANULADA': return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/20';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 ring-1 ring-slate-600/20';
  }
};

const getStatusStylesDark = (status: string) => {
  const s = status ? status.toUpperCase() : '';
  switch (s) {
    case 'COMPLETADA': return 'bg-emerald-900/40 text-emerald-400 border-emerald-700 ring-1 ring-emerald-500/20';
    case 'PENDIENTE': return 'bg-amber-900/40 text-amber-400 border-amber-700 ring-1 ring-amber-500/20';
    case 'ANULADA': return 'bg-rose-900/40 text-rose-400 border-rose-700 ring-1 ring-rose-500/20';
    default: return 'bg-gray-700 text-gray-400 border-gray-600 ring-1 ring-gray-500/20';
  }
};

export default function VentasHistorial() {
  const {
    isDark, colors, pageBg, heading, textTertiary,
    tableHeader, tableHeaderText, emptyState
  } = useThemeClasses();
  const navigate = useNavigate();

  const getStatusStyles = isDark ? getStatusStylesDark : getStatusStylesLight;

  // --- ESTADOS ---
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');

  // Estado para ModalTicket
  const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);
  const [mostrarTicket, setMostrarTicket] = useState(false);

  // --- CARGAR DATOS ---
  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setLoading(true);
        const data = await ventaService.fetchVentas();
        // Ordenar por fecha descendente (mas reciente primero)
        const dataOrdenada = data.sort((a: any, b: any) => {
          const fechaA = new Date(a.fecha || a.fechaCreacion).getTime();
          const fechaB = new Date(b.fecha || b.fechaCreacion).getTime();
          return fechaB - fechaA;
        });
        setVentas(dataOrdenada);
      } catch (error) {
        console.error('Error al cargar historial de ventas:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarVentas();
  }, []);

  // --- FILTROS Y CALCULOS ---
  const ventasFiltradas = useMemo(() => {
    return ventas.filter((venta) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        (venta.nombreCliente || '').toLowerCase().includes(term) ||
        (venta.nombreUsuario || '').toLowerCase().includes(term) ||
        String(venta.id || '').toLowerCase().includes(term);

      const matchEstado = filterEstado === 'all' || venta.estado === filterEstado;

      return matchSearch && matchEstado;
    });
  }, [searchTerm, filterEstado, ventas]);

  const totalVentas = ventas.length;
  const montoTotal = ventas.reduce((sum, v) => sum + (v.total || 0), 0);
  const completadas = ventas.filter((v) => v.estado === 'COMPLETADA').length;
  const pendientes = ventas.filter((v) => v.estado === 'PENDIENTE').length;

  const formatearFecha = (fecha: string) => {
    if (!fecha) return '-';
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    const horas = String(d.getHours()).padStart(2, '0');
    const minutos = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  };

  const onVerTicket = (venta: any) => {
    setVentaSeleccionada(venta);
    setMostrarTicket(true);
  };

  // --- SKELETON LOADING ---
  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-slate-50/50'} pb-20 font-sans`}>
        {/* Header skeleton */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} border-b`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                <div>
                  <div className={`h-6 w-48 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse mb-2`} />
                  <div className={`h-4 w-64 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                </div>
              </div>
              <div className={`h-10 w-32 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPI skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} rounded-xl p-6 shadow-sm border flex items-center gap-4`}>
                <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                <div className="flex-1">
                  <div className={`h-3 w-20 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse mb-2`} />
                  <div className={`h-7 w-16 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                </div>
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden`}>
            <div className={`p-5 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
              <div className={`h-10 w-full md:w-96 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-14 w-full rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-slate-50/50 text-slate-600'} pb-20 font-sans relative`}>

      {/* HEADER */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-500'} transition-colors`}
              >
                <IoMdArrowRoundBack className="h-6 w-6" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${heading}`}>Historial de Ventas</h1>
                <p className={`text-sm ${textTertiary}`}>Consulta y gestiona todas tus ventas realizadas</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/ventas/nueva')}
              className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-sm shadow-indigo-200"
            >
              <IoMdAdd className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Nueva Venta
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} rounded-xl p-6 shadow-sm border flex items-center gap-4`}>
            <div className={`p-3 ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} rounded-lg`}>
              <IoIosDocument className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-xs font-medium ${textTertiary} uppercase`}>Total de Ventas</p>
              <p className={`text-2xl font-bold ${heading}`}>{totalVentas}</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} rounded-xl p-6 shadow-sm border flex items-center gap-4`}>
            <div className={`p-3 ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} rounded-lg`}>
              <IoIosCash className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-xs font-medium ${textTertiary} uppercase`}>Monto Total</p>
              <p className={`text-2xl font-bold ${heading}`}>S/ {montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} rounded-xl p-6 shadow-sm border flex items-center gap-4`}>
            <div className={`p-3 ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'} rounded-lg`}>
              <IoIosCheckmarkCircle className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-xs font-medium ${textTertiary} uppercase`}>Completadas</p>
              <p className={`text-2xl font-bold ${heading}`}>{completadas}</p>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'} rounded-xl p-6 shadow-sm border flex items-center gap-4`}>
            <div className={`p-3 ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'} rounded-lg`}>
              <IoIosTime className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-xs font-medium ${textTertiary} uppercase`}>Pendientes</p>
              <p className={`text-2xl font-bold ${heading}`}>{pendientes}</p>
            </div>
          </div>
        </div>

        {/* TABLA PRINCIPAL */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border overflow-hidden`}>

          {/* Filtros */}
          <div className={`p-5 border-b ${isDark ? 'border-gray-700 bg-gray-800/80' : 'border-slate-100 bg-slate-50/50'} flex flex-col md:flex-row justify-between items-center gap-4`}>
            <div className="relative w-full md:w-96">
              <IoIosSearch className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Buscar por cliente, vendedor o N venta..."
                className={`w-full pl-10 pr-4 py-2.5 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' : 'bg-white border-slate-200 text-slate-700'} border rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className={`text-sm ${textTertiary} hidden sm:block`}>Estado:</span>
              <select
                className={`w-full md:w-auto border ${isDark ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-slate-200 bg-white text-slate-700'} rounded-lg px-3 py-2.5 text-sm focus:border-indigo-500 outline-none cursor-pointer`}
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="COMPLETADA">Completada</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="ANULADA">Anulada</option>
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className={`min-w-full divide-y ${isDark ? 'divide-gray-700' : 'divide-slate-200'}`}>
              <thead className={tableHeader}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}># Venta</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}>Fecha</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}>Cliente</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}>Vendedor</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}>Almacen</th>
                  <th className={`px-6 py-4 text-right text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}>Total</th>
                  <th className={`px-6 py-4 text-center text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}>Estado</th>
                  <th className={`px-6 py-4 text-center text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}>Envio</th>
                  <th className={`px-6 py-4 text-center text-xs font-semibold ${tableHeaderText} uppercase tracking-wider`}>Acciones</th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-slate-100'}`}>
                {ventasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={`px-6 py-12 text-center ${emptyState}`}>
                      No se encontraron ventas.
                    </td>
                  </tr>
                ) : (
                  ventasFiltradas.map((venta) => (
                    <tr key={venta.id} className={`${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50/80'} transition-colors duration-150 group`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-indigo-600">#{venta.id}</span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${textTertiary}`}>
                        {formatearFecha(venta.fecha || venta.fechaCreacion)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        {venta.nombreCliente || 'Sin cliente'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${textTertiary}`}>
                        {venta.nombreUsuario || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${textTertiary}`}>
                        {venta.nombreAlmacen || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                        S/ {(venta.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(venta.estado)}`}>
                          {venta.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {venta.estado === 'PENDIENTE' ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isDark ? 'bg-indigo-900/40 text-indigo-400 border-indigo-700' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                            <FaTruck className="w-3 h-3" />
                            Delivery
                          </span>
                        ) : (
                          <span className={`text-xs ${textTertiary}`}>Directa</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => onVerTicket(venta)}
                          className={`${isDark ? 'text-gray-500 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'} transition-colors p-2 rounded-full inline-flex items-center gap-1`}
                          title="Ver Ticket"
                        >
                          <FaReceipt className="w-4 h-4" />
                          <span className="text-xs font-medium">Ver Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block lg:hidden">
            {ventasFiltradas.length === 0 ? (
              <div className={`px-6 py-12 text-center ${emptyState}`}>
                No se encontraron ventas.
              </div>
            ) : (
              <div className="divide-y ${isDark ? 'divide-gray-700' : 'divide-slate-100'}">
                {ventasFiltradas.map((venta) => (
                  <div
                    key={venta.id}
                    className={`p-4 ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-indigo-600">Venta #{venta.id}</span>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(venta.estado)}`}>
                        {venta.estado}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between">
                        <span className={`text-xs ${textTertiary}`}>Fecha</span>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          {formatearFecha(venta.fecha || venta.fechaCreacion)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs ${textTertiary}`}>Cliente</span>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          {venta.nombreCliente || 'Sin cliente'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs ${textTertiary}`}>Vendedor</span>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          {venta.nombreUsuario || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs ${textTertiary}`}>Almacen</span>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          {venta.nombreAlmacen || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs ${textTertiary}`}>Total</span>
                        <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                          S/ {(venta.total || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs ${textTertiary}`}>Envio</span>
                        {venta.estado === 'PENDIENTE' ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
                            <FaTruck className="w-3 h-3" />
                            Delivery
                          </span>
                        ) : (
                          <span className={`text-xs ${textTertiary}`}>Directa</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onVerTicket(venta)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <FaReceipt className="w-4 h-4" />
                      Ver Ticket
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL TICKET */}
      <ModalTicket
        isOpen={mostrarTicket}
        onClose={() => setMostrarTicket(false)}
        venta={ventaSeleccionada}
      />
    </div>
  );
}
