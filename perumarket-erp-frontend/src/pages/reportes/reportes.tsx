import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FiBox, FiShoppingCart, FiDollarSign, FiTrendingUp,
  FiAlertTriangle, FiUsers, FiPackage, FiTruck,
} from "react-icons/fi";
import { useThemeClasses } from '../../hooks/useThemeClasses';
import { reportesService } from '../../services/reportesService';
import type { ReporteVentas, ReporteCompras, ReporteInventario } from '../../services/reportesService';

type TabType = 'ventas' | 'compras' | 'inventario';

const COLORES = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

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

// --- Componentes auxiliares ---

function StatCard({ title, value, subtitle, icon, isDark, accent }: {
  title: string; value: string; subtitle?: string; icon: React.ReactNode; isDark: boolean; accent?: boolean;
}) {
  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      accent
        ? 'bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white border-transparent'
        : isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${accent ? 'text-white/70' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className={`text-xs mt-1 ${accent ? 'text-white/60' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${accent ? 'bg-white/15' : isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.value > 50 ? formatMoney(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// --- Tab: Ventas ---

function TabVentas({ data, isDark, card, heading, textTertiary, border }: {
  data: ReporteVentas; isDark: boolean; card: string; heading: string; textTertiary: string; border: string;
}) {
  const iconColor = isDark ? '#93c5fd' : '#3b82f6';
  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ingresos Totales" value={formatMoney(data.ingresoTotal)} subtitle={`${data.ventasCompletadas} completadas`} icon={<FiDollarSign size={20} color={iconColor} />} isDark={isDark} accent />
        <StatCard title="Ventas del Día" value={formatMoney(data.ingresoDelDia)} subtitle={`${data.ventasDelDia} ventas hoy`} icon={<FiTrendingUp size={20} color={iconColor} />} isDark={isDark} />
        <StatCard title="Ticket Promedio" value={formatMoney(data.ticketPromedio)} subtitle="Por venta completada" icon={<FiShoppingCart size={20} color={iconColor} />} isDark={isDark} />
        <StatCard title="Estado" value={`${data.ventasPendientes} pendientes`} subtitle={`${data.ventasAnuladas} anuladas`} icon={<FiAlertTriangle size={20} color={iconColor} />} isDark={isDark} />
      </div>

      {/* Gráfico mensual + vendedores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${card}`}>
          <h3 className={`font-semibold mb-4 ${heading}`}>Ingresos Mensuales</h3>
          {data.ventasPorMes.some(m => m.ingresos > 0) ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ventasPorMes} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="ingresos" name="Ingresos" fill="#3b82f6" radius={[5, 5, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={`h-[280px] flex items-center justify-center ${textTertiary}`}>Sin datos este año</div>
          )}
        </div>

        <div className={`p-6 rounded-2xl border ${card}`}>
          <h3 className={`font-semibold mb-4 ${heading}`}>Ventas por Vendedor</h3>
          {data.ventasPorVendedor.length > 0 ? (
            <div className="space-y-3">
              {data.ventasPorVendedor.slice(0, 6).map((v, i) => (
                <div key={i} className={`pb-2 border-b last:border-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm truncate ${heading}`}>{v.nombre}</span>
                    <span className={`text-xs font-medium ${textTertiary}`}>{v.porcentaje}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(v.porcentaje, 100)}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs ${textTertiary}`}>{v.ventas} ventas</span>
                    <span className={`text-xs font-semibold ${heading}`}>{formatMoney(v.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`py-8 text-center ${textTertiary} text-sm`}>Sin datos</div>
          )}
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className={`p-6 rounded-2xl border ${card}`}>
        <h3 className={`font-semibold mb-4 ${heading}`}>Detalle de Ventas (Últimas 50)</h3>
        {data.detalleVentas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>#</th>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Fecha</th>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Cliente</th>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Vendedor</th>
                  <th className={`text-right py-2 px-3 font-medium ${textTertiary}`}>Subtotal</th>
                  <th className={`text-right py-2 px-3 font-medium ${textTertiary}`}>IGV</th>
                  <th className={`text-right py-2 px-3 font-medium ${textTertiary}`}>Total</th>
                  <th className={`text-center py-2 px-3 font-medium ${textTertiary}`}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.detalleVentas.map(v => (
                  <tr key={v.id} className={`border-b ${isDark ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-50 hover:bg-gray-50'}`}>
                    <td className={`py-2 px-3 ${heading}`}>{v.id}</td>
                    <td className={`py-2 px-3 ${textTertiary}`}>{formatFecha(v.fecha)}</td>
                    <td className={`py-2 px-3 ${heading}`}>{v.cliente}</td>
                    <td className={`py-2 px-3 ${textTertiary}`}>{v.vendedor}</td>
                    <td className={`py-2 px-3 text-right ${textTertiary}`}>{formatMoney(v.subtotal)}</td>
                    <td className={`py-2 px-3 text-right ${textTertiary}`}>{formatMoney(v.igv)}</td>
                    <td className={`py-2 px-3 text-right font-semibold ${heading}`}>{formatMoney(v.total)}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${estadoClasses[v.estado] || ''}`}>{v.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`py-8 text-center ${textTertiary} text-sm`}>Sin ventas registradas</div>
        )}
      </div>
    </div>
  );
}

// --- Tab: Compras ---

function TabCompras({ data, isDark, card, heading, textTertiary, border }: {
  data: ReporteCompras; isDark: boolean; card: string; heading: string; textTertiary: string; border: string;
}) {
  const iconColor = isDark ? '#86efac' : '#10b981';
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Gasto Total" value={formatMoney(data.gastoTotal)} subtitle={`${data.comprasCompletadas} completadas`} icon={<FiTruck size={20} color={iconColor} />} isDark={isDark} accent />
        <StatCard title="IGV Total" value={formatMoney(data.igvTotal)} subtitle="En compras completadas" icon={<FiDollarSign size={20} color={iconColor} />} isDark={isDark} />
        <StatCard title="Compra Promedio" value={formatMoney(data.compraPromedio)} subtitle="Por compra completada" icon={<FiShoppingCart size={20} color={iconColor} />} isDark={isDark} />
        <StatCard title="Estado" value={`${data.comprasPendientes} pendientes`} subtitle={`${data.comprasAnuladas} anuladas`} icon={<FiAlertTriangle size={20} color={iconColor} />} isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${card}`}>
          <h3 className={`font-semibold mb-4 ${heading}`}>Gastos Mensuales</h3>
          {data.comprasPorMes.some(m => m.gastos > 0) ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.comprasPorMes} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="gastos" name="Gastos" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={`h-[280px] flex items-center justify-center ${textTertiary}`}>Sin datos este año</div>
          )}
        </div>

        <div className={`p-6 rounded-2xl border ${card}`}>
          <h3 className={`font-semibold mb-4 ${heading}`}>Compras por Proveedor</h3>
          {data.comprasPorProveedor.length > 0 ? (
            <div className="space-y-3">
              {data.comprasPorProveedor.slice(0, 6).map((p, i) => (
                <div key={i} className={`pb-2 border-b last:border-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm truncate ${heading}`}>{p.nombre}</span>
                    <span className={`text-xs font-medium ${textTertiary}`}>{p.porcentaje}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(p.porcentaje, 100)}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs ${textTertiary}`}>{p.compras} compras</span>
                    <span className={`text-xs font-semibold ${heading}`}>{formatMoney(p.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`py-8 text-center ${textTertiary} text-sm`}>Sin datos</div>
          )}
        </div>
      </div>

      {/* Tabla compras */}
      <div className={`p-6 rounded-2xl border ${card}`}>
        <h3 className={`font-semibold mb-4 ${heading}`}>Detalle de Compras (Últimas 50)</h3>
        {data.detalleCompras.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>#</th>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Fecha</th>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Proveedor</th>
                  <th className={`text-right py-2 px-3 font-medium ${textTertiary}`}>Subtotal</th>
                  <th className={`text-right py-2 px-3 font-medium ${textTertiary}`}>IGV</th>
                  <th className={`text-right py-2 px-3 font-medium ${textTertiary}`}>Total</th>
                  <th className={`text-center py-2 px-3 font-medium ${textTertiary}`}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.detalleCompras.map(c => (
                  <tr key={c.id} className={`border-b ${isDark ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-50 hover:bg-gray-50'}`}>
                    <td className={`py-2 px-3 ${heading}`}>{c.id}</td>
                    <td className={`py-2 px-3 ${textTertiary}`}>{formatFecha(c.fecha)}</td>
                    <td className={`py-2 px-3 ${heading}`}>{c.proveedor}</td>
                    <td className={`py-2 px-3 text-right ${textTertiary}`}>{formatMoney(c.subtotal)}</td>
                    <td className={`py-2 px-3 text-right ${textTertiary}`}>{formatMoney(c.igv)}</td>
                    <td className={`py-2 px-3 text-right font-semibold ${heading}`}>{formatMoney(c.total)}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${estadoClasses[c.estado] || ''}`}>{c.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`py-8 text-center ${textTertiary} text-sm`}>Sin compras registradas</div>
        )}
      </div>
    </div>
  );
}

// --- Tab: Inventario ---

function TabInventario({ data, isDark, card, heading, textTertiary, border }: {
  data: ReporteInventario; isDark: boolean; card: string; heading: string; textTertiary: string; border: string;
}) {
  const iconColor = isDark ? '#fbbf24' : '#f59e0b';
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Valor del Inventario" value={formatMoney(data.valorInventario)} subtitle={`${data.productosActivos} productos activos`} icon={<FiBox size={20} color={iconColor} />} isDark={isDark} accent />
        <StatCard title="Productos Activos" value={data.productosActivos.toString()} subtitle={`${data.productosInactivos} inactivos`} icon={<FiPackage size={20} color={iconColor} />} isDark={isDark} />
        <StatCard title="Stock Bajo" value={data.productosBajoStock.toString()} subtitle="Productos bajo mínimo" icon={<FiAlertTriangle size={20} color={iconColor} />} isDark={isDark} />
        <StatCard title="Total Productos" value={data.totalProductos.toString()} subtitle="Registrados en sistema" icon={<FiUsers size={20} color={iconColor} />} isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por categoría */}
        <div className={`p-6 rounded-2xl border ${card}`}>
          <h3 className={`font-semibold mb-4 ${heading}`}>Productos por Categoría</h3>
          {data.productosPorCategoria.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="w-[180px] h-[180px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.productosPorCategoria} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="cantidad" stroke="none">
                      {data.productosPorCategoria.map((_, i) => (
                        <Cell key={i} fill={COLORES[i % COLORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {data.productosPorCategoria.slice(0, 6).map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORES[i % COLORES.length] }} />
                      <span className={`text-sm ${textTertiary}`}>{cat.name}</span>
                    </div>
                    <span className={`text-sm font-semibold ${heading}`}>{cat.cantidad}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`py-8 text-center ${textTertiary} text-sm`}>Sin datos</div>
          )}
        </div>

        {/* Por almacén */}
        <div className={`p-6 rounded-2xl border ${card}`}>
          <h3 className={`font-semibold mb-4 ${heading}`}>Productos por Almacén</h3>
          {data.productosPorAlmacen.length > 0 ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.productosPorAlmacen} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                  <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#9ca3af' : '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cantidad" name="Productos" fill="#f59e0b" radius={[0, 5, 5, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={`py-8 text-center ${textTertiary} text-sm`}>Sin datos</div>
          )}
        </div>
      </div>

      {/* Stock bajo */}
      {data.productosStockBajo.length > 0 && (
        <div className={`p-6 rounded-2xl border ${card}`}>
          <h3 className={`font-semibold mb-4 ${heading}`}>
            <FiAlertTriangle className="inline mr-2 text-yellow-500" />
            Productos con Stock Bajo ({data.productosStockBajo.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Producto</th>
                  <th className={`text-center py-2 px-3 font-medium ${textTertiary}`}>Stock Actual</th>
                  <th className={`text-center py-2 px-3 font-medium ${textTertiary}`}>Stock Mínimo</th>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Almacén</th>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Categoría</th>
                </tr>
              </thead>
              <tbody>
                {data.productosStockBajo.map((p, i) => (
                  <tr key={i} className={`border-b ${isDark ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-50 hover:bg-gray-50'}`}>
                    <td className={`py-2 px-3 ${heading}`}>{p.nombre}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-yellow-500'}`}>{p.stock}</span>
                    </td>
                    <td className={`py-2 px-3 text-center ${textTertiary}`}>{p.minimo}</td>
                    <td className={`py-2 px-3 ${textTertiary}`}>{p.almacen}</td>
                    <td className={`py-2 px-3 ${textTertiary}`}>{p.categoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top valor */}
      <div className={`p-6 rounded-2xl border ${card}`}>
        <h3 className={`font-semibold mb-4 ${heading}`}>Top 10 Productos por Valor en Inventario</h3>
        {data.productosTopValor.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>#</th>
                  <th className={`text-left py-2 px-3 font-medium ${textTertiary}`}>Producto</th>
                  <th className={`text-right py-2 px-3 font-medium ${textTertiary}`}>Precio Venta</th>
                  <th className={`text-center py-2 px-3 font-medium ${textTertiary}`}>Stock</th>
                  <th className={`text-right py-2 px-3 font-medium ${textTertiary}`}>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {data.productosTopValor.map((p, i) => (
                  <tr key={i} className={`border-b ${isDark ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-50 hover:bg-gray-50'}`}>
                    <td className={`py-2 px-3 ${textTertiary}`}>{i + 1}</td>
                    <td className={`py-2 px-3 ${heading}`}>{p.nombre}</td>
                    <td className={`py-2 px-3 text-right ${textTertiary}`}>{formatMoney(p.precioVenta)}</td>
                    <td className={`py-2 px-3 text-center ${textTertiary}`}>{p.stock}</td>
                    <td className={`py-2 px-3 text-right font-semibold ${heading}`}>{formatMoney(p.valorTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`py-8 text-center ${textTertiary} text-sm`}>Sin productos</div>
        )}
      </div>
    </div>
  );
}

// --- Componente Principal ---

export default function Reportes() {
  const { isDark, colors, pageBg, card, heading, textSecondary, textTertiary, border } = useThemeClasses();
  const [tab, setTab] = useState<TabType>('ventas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ventas, setVentas] = useState<ReporteVentas | null>(null);
  const [compras, setCompras] = useState<ReporteCompras | null>(null);
  const [inventario, setInventario] = useState<ReporteInventario | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetcher = tab === 'ventas'
      ? reportesService.getReporteVentas().then(d => { if (!cancelled) setVentas(d); })
      : tab === 'compras'
        ? reportesService.getReporteCompras().then(d => { if (!cancelled) setCompras(d); })
        : reportesService.getReporteInventario().then(d => { if (!cancelled) setInventario(d); });

    fetcher
      .catch(err => {
        if (!cancelled) {
          console.error('Error cargando reporte:', err);
          setError('No se pudo cargar el reporte. Verifica que el backend esté activo.');
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [tab]);

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'ventas', label: 'Ventas', icon: <FiShoppingCart size={16} /> },
    { key: 'compras', label: 'Compras', icon: <FiTruck size={16} /> },
    { key: 'inventario', label: 'Inventario', icon: <FiBox size={16} /> },
  ];

  return (
    <div className={`min-h-screen ${pageBg} p-4 md:p-8 font-sans`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${heading}`}>Reportes</h1>
          <p className={`${textSecondary} mt-1`}>Análisis detallado de tu negocio</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-xl mb-6 w-fit border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'text-white shadow-sm'
                : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
            }`}
            style={tab === t.key ? { backgroundColor: colors[500] } : {}}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[var(--color-primary-500)] rounded-full animate-spin mx-auto mb-3" />
            <p className={textSecondary}>Cargando reporte...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-24">
          <div className={`p-8 rounded-2xl border ${card} text-center max-w-md`}>
            <FiAlertTriangle className="mx-auto mb-3 text-red-500" size={36} />
            <h2 className={`text-lg font-bold mb-2 ${heading}`}>Error de conexión</h2>
            <p className={`${textSecondary} mb-4`}>{error}</p>
            <button onClick={() => { setLoading(true); setError(null); setTab(tab); }} className="btn-primary px-6 py-2 rounded-lg font-medium">
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <>
          {tab === 'ventas' && ventas && <TabVentas data={ventas} isDark={isDark} card={card} heading={heading} textTertiary={textTertiary} border={border} />}
          {tab === 'compras' && compras && <TabCompras data={compras} isDark={isDark} card={card} heading={heading} textTertiary={textTertiary} border={border} />}
          {tab === 'inventario' && inventario && <TabInventario data={inventario} isDark={isDark} card={card} heading={heading} textTertiary={textTertiary} border={border} />}
        </>
      )}
    </div>
  );
}
