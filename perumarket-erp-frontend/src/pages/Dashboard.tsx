import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats } from '../services/dashboardService';

// --- Iconos SVG ---
const Icons = {
  Dollar: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Cart: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  ),
  Box: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Users: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Warning: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  TrendUp: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
};

const COLORES_PIE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function formatMoney(value: number): string {
  return 'S/ ' + value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatFecha(fecha: string): string {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

const estadoClasses: Record<string, string> = {
  COMPLETADA: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PENDIENTE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  ANULADA: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

// --- Componentes UI ---

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isDarkCard?: boolean;
  isDark?: boolean;
  colors?: Record<number, string>;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isDarkCard = false, isDark = false, colors, subtitle }) => (
  <div className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
    isDarkCard
      ? 'text-white'
      : isDark
        ? 'bg-gray-800 text-gray-100 border border-gray-700'
        : 'bg-white text-gray-800 border border-gray-100'
  }`}
    style={isDarkCard ? { background: `linear-gradient(135deg, ${colors?.[500] || '#1e293b'}, ${colors?.[600] || '#0f172a'})` } : {}}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className={`text-sm font-medium mb-1 ${isDarkCard ? 'text-white/70' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </p>
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        {subtitle && (
          <p className={`text-xs ${isDarkCard ? 'text-white/60' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${
        isDarkCard
          ? 'bg-white/10 backdrop-blur-sm'
          : isDark
            ? 'bg-gray-700/50'
            : 'bg-[var(--color-primary-50)]'
      }`}>
        {icon}
      </div>
    </div>
  </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.value > 100 ? formatMoney(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Componente Principal ---

export default function DashboardUser() {
  const { isDark, colors, pageBg, card, heading, textSecondary, textTertiary, border } = useThemeClasses();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    dashboardService.getDashboardData()
      .then(data => {
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Error cargando dashboard:', err);
          setError('No se pudo cargar los datos del dashboard. Verifica que el backend esté activo.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-12 h-12 border-4 border-gray-300 border-t-[var(--color-primary-500)] rounded-full animate-spin mx-auto mb-4`}></div>
          <p className={textSecondary}>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${pageBg} flex items-center justify-center`}>
        <div className={`p-8 rounded-2xl border ${card} text-center max-w-md`}>
          <Icons.Warning className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className={`text-lg font-bold mb-2 ${heading}`}>Error de conexión</h2>
          <p className={`${textSecondary} mb-4`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-2 rounded-lg font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statsCards = [
    {
      title: "Ingresos por Ventas",
      value: formatMoney(stats.ingresoVentas),
      icon: <Icons.Dollar className="w-5 h-5 text-white" />,
      isDarkCard: true,
      subtitle: `${stats.totalVentas} ventas completadas`,
    },
    {
      title: "Gastos en Compras",
      value: formatMoney(stats.gastoCompras),
      icon: <Icons.Cart className="w-5 h-5" style={{ color: colors[500] }} />,
      subtitle: `${stats.totalCompras} compras realizadas`,
    },
    {
      title: "Productos Activos",
      value: stats.productosActivos.toString(),
      icon: <Icons.Box className="w-5 h-5" style={{ color: colors[500] }} />,
      subtitle: stats.productosBajoStock > 0 ? `${stats.productosBajoStock} con stock bajo` : 'Stock estable',
    },
    {
      title: "Clientes Activos",
      value: stats.clientesActivos.toString(),
      icon: <Icons.Users className="w-5 h-5" style={{ color: colors[500] }} />,
      subtitle: 'Clientes registrados',
    },
  ];

  const hayDatosVentasMes = stats.ventasPorMes.some(m => m.ventas > 0 || m.compras > 0);
  const hayDatosVentasDia = stats.ventasPorDia.some(d => d.ventas > 0 || d.ingresos > 0);
  const hayTopProductos = stats.topProductos.length > 0;
  const hayCategorias = stats.distribucionCategorias.length > 0;

  return (
    <div className={`min-h-screen ${pageBg} p-4 md:p-8 font-sans`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${heading}`}>Dashboard</h1>
          <p className={`${textSecondary} mt-1`}>Resumen general de Peru Market</p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            dashboardService.getDashboardData()
              .then(setStats)
              .catch(() => setError('Error al recargar'))
              .finally(() => setLoading(false));
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Actualizar datos
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isDarkCard={stat.isDarkCard}
            isDark={isDark}
            colors={colors as unknown as Record<number, string>}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Alerta stock bajo */}
      {stats.productosBajoStock > 0 && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
          isDark ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <Icons.Warning className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
            <span className="font-semibold">{stats.productosBajoStock} producto(s)</span> tienen stock por debajo del mínimo.
            Revisa el inventario para reabastecer.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Columna Izquierda - Gráficos */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">

          {/* Gráfico Ventas vs Compras por Mes */}
          <div className={`p-6 rounded-3xl shadow-sm border ${card}`}>
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${heading}`}>Ventas vs Compras</h2>
              <p className={`${textTertiary} text-sm mt-1`}>Comparativa mensual del año actual</p>
            </div>
            {hayDatosVentasMes ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.ventasPorMes} barGap={8} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="ventas" name="Ventas" fill={colors[500]} radius={[6, 6, 0, 0]} barSize={16} />
                    <Bar dataKey="compras" name="Compras" fill={isDark ? '#6b7280' : '#1e293b'} radius={[6, 6, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className={`flex items-center gap-2 text-sm ${textTertiary}`}>
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[500] }}></span>
                    Ventas
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${textTertiary}`}>
                    <span className={`w-3 h-3 rounded-sm ${isDark ? 'bg-gray-500' : 'bg-slate-800'}`}></span>
                    Compras
                  </div>
                </div>
              </div>
            ) : (
              <div className={`h-[300px] flex items-center justify-center ${textTertiary}`}>
                <p>No hay datos de ventas ni compras este año</p>
              </div>
            )}
          </div>

          {/* Gráfico de ventas por día + Top productos */}
          <div className={`rounded-3xl shadow-sm border overflow-hidden ${card}`}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Tendencia semanal */}
              <div className={`p-6 border-b md:border-b-0 md:border-r ${border}`}>
                <h3 className={`font-semibold ${heading} mb-4`}>Ventas de la semana</h3>
                {hayDatosVentasDia ? (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.ventasPorDia}>
                        <defs>
                          <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors[500]} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={colors[500]} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke={colors[500]} fill="url(#colorIngresos)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className={`h-[200px] flex items-center justify-center ${textTertiary}`}>
                    <p className="text-sm">Sin ventas esta semana</p>
                  </div>
                )}
              </div>

              {/* Top productos vendidos */}
              <div className="p-6">
                <h3 className={`font-semibold ${heading} mb-4`}>Top Productos</h3>
                {hayTopProductos ? (
                  <div className="space-y-3">
                    {stats.topProductos.map((prod, i) => (
                      <div key={i} className={`flex items-center justify-between py-2 border-b last:border-b-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                            style={{ backgroundColor: COLORES_PIE[i] || colors[500] }}>
                            {i + 1}
                          </span>
                          <span className={`text-sm truncate ${textTertiary}`}>{prod.name}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className={`text-sm font-semibold ${heading}`}>{formatMoney(prod.ingresos)}</span>
                          <p className={`text-xs ${textTertiary}`}>{prod.cantidad} uds</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`h-[200px] flex items-center justify-center ${textTertiary}`}>
                    <p className="text-sm">Sin datos de productos vendidos</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha */}
        <div className="space-y-6">

          {/* Distribución por categorías */}
          <div className={`p-6 rounded-3xl shadow-sm border ${card}`}>
            <div className="text-center mb-4">
              <h2 className={`text-xl font-bold ${heading}`}>Productos por Categoría</h2>
              <p className={`${textTertiary} text-sm`}>{stats.productosActivos} productos activos</p>
            </div>

            {hayCategorias ? (
              <>
                <div className="relative flex items-center justify-center mb-4">
                  <div className="relative w-full max-w-[200px] aspect-square">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.distribucionCategorias}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          dataKey="value"
                          stroke="none"
                        >
                          {stats.distribucionCategorias.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORES_PIE[index % COLORES_PIE.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-2">
                  {stats.distribucionCategorias.map((cat, i) => (
                    <div key={i} className={`flex items-center justify-between py-1`}>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORES_PIE[i % COLORES_PIE.length] }}></span>
                        <span className={`text-sm ${textTertiary}`}>{cat.name}</span>
                      </div>
                      <span className={`text-sm font-semibold ${heading}`}>{cat.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={`py-8 text-center ${textTertiary}`}>
                <p className="text-sm">Sin productos registrados</p>
              </div>
            )}
          </div>

          {/* Ventas recientes */}
          <div className={`p-6 rounded-3xl shadow-sm border ${card}`}>
            <h2 className={`text-lg font-bold ${heading} mb-4`}>Ventas Recientes</h2>
            {stats.ventasRecientes.length > 0 ? (
              <div className="space-y-3">
                {stats.ventasRecientes.map((venta) => (
                  <div key={venta.id} className={`flex items-center justify-between py-2 border-b last:border-b-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${heading}`}>{venta.cliente}</p>
                      <p className={`text-xs ${textTertiary}`}>{formatFecha(venta.fecha)}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className={`text-sm font-semibold ${heading}`}>{formatMoney(venta.total)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${estadoClasses[venta.estado] || ''}`}>
                        {venta.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`py-8 text-center ${textTertiary}`}>
                <p className="text-sm">Sin ventas registradas</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
