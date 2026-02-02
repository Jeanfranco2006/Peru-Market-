import { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
} from "react-icons/fi";

import { useThemeClasses } from '../../hooks/useThemeClasses';

const sampleChart = [
  { month: "Jan", a: 5, b: 3 },
  { month: "Feb", a: 8, b: 5 },
  { month: "Mar", a: 12, b: 10 },
  { month: "Apr", a: 18, b: 15 },
  { month: "May", a: 25, b: 20 },
  { month: "Jun", a: 28, b: 22 },
  { month: "Jul", a: 30, b: 25 },
  { month: "Aug", a: 27, b: 23 },
  { month: "Sep", a: 20, b: 16 },
  { month: "Oct", a: 14, b: 11 },
  { month: "Nov", a: 9, b: 7 },
  { month: "Dec", a: 6, b: 4 },
];

const cards = [
  { title: "Productos Registrados", value: "1,029", icon: <FiBox size={28} /> },
  { title: "Ventas", value: "S/ 0.00", icon: <FiShoppingCart size={28} /> },
  { title: "Gastos", value: "S/ 0.00", icon: <FiDollarSign size={28} /> },
  { title: "Total de Ventas", value: "S/ 0.00", icon: <FiTrendingUp size={28} /> },
  { title: "Total de Ganancias", value: "S/ 0.00", icon: <FiPieChart size={28} /> },
  { title: "Total Ganancias Netas", value: "S/ 0.00", icon: <FiBarChart2 size={28} /> },
  { title: "Ganancia Bruta", value: "S/ 0.00", icon: <FiTrendingUp size={28} /> },
  { title: "Ventas del dia", value: "S/ 0.00", icon: <FiCalendar size={28} /> },
];

const proveedores = [
  { nombre: "Fiorela Lizbeth Mamani", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Maria Perez Gonzalez", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Carlos Ramirez Torres", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Ana Lopez Martinez", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Juan Gomez Sanchez", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Laura Fernandez Castro", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
];

export default function Reportes() {
  const [open, setOpen] = useState(false);
  const { isDark, textTertiary } = useThemeClasses();

  return (
    <div>
      {/* CARDS */}
      <div className="flex items-start gap-4">
        <div className="grid grid-cols-4 gap-4 w-full">
          {cards.map((c, i) => (
            <div
              className={`min-w-[170px] ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow rounded-xl p-4 border`}
              key={i}
            >
              <div className={`text-2xl mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{c.icon}</div>
              <div className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{c.title}</div>
              <div className={`mt-2 ${textTertiary}`}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* BOTON GENERAR REPORTE */}
        <div className="relative">
          <button
            onClick={() => setOpen((s) => !s)}
            className="bg-blue-600 text-white px-3 py-2 rounded-md shadow h-10"
          >
            <span className="mr-2">&#9662;</span> Generar Reporte
          </button>

          <div
            className={`absolute right-0 mt-2 w-40 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-md shadow-md border transition-transform ${
              open
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
            style={{ transitionDuration: "180ms" }}
          >
            <button className={`w-full text-left px-4 py-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
              Compras
            </button>
            <button className={`w-full text-left px-4 py-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
              Inventario
            </button>
            <button className={`w-full text-left px-4 py-2 ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
              Pedidos
            </button>
          </div>
        </div>
      </div>

      {/* GRAFICO + TABLA */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow p-6 border`}>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sampleChart}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#fff',
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                    color: isDark ? '#e5e7eb' : '#111827'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="a"
                  stroke="#6B46C1"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="b"
                  stroke="#F97373"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLA */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow p-4 border`}>
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Ventas por Proveedor</h3>
          <div className="text-sm">
            <table className="w-full text-left">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Vendedor</th>
                  <th className={`py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>#Ventas</th>
                  <th className={`py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total(S/)</th>
                  <th className={`py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>%</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((p, i) => (
                  <tr key={i} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`py-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{p.nombre}</td>
                    <td className={isDark ? 'text-gray-400' : 'text-gray-600'}>{p.ventas}</td>
                    <td className={isDark ? 'text-gray-400' : 'text-gray-600'}>{p.total}</td>
                    <td className={isDark ? 'text-gray-400' : 'text-gray-600'}>{p.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
