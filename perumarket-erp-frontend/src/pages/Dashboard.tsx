import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { useThemeClasses } from '../hooks/useThemeClasses';

// --- 1. Interfaces y Tipos ---
interface ChartData {
  name: string;
  year2019: number;
  year2020: number;
}

interface WaveData {
  name: string;
  val1: number;
  val2: number;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isDarkCard?: boolean;
  isDark?: boolean;
  colors?: Record<number, string>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// --- 2. Datos de Ejemplo Mejorados ---
const barChartData: ChartData[] = [
  { name: 'ENE', year2019: 20, year2020: 38 },
  { name: 'FEB', year2019: 28, year2020: 45 },
  { name: 'MAR', year2019: 18, year2020: 32 },
  { name: 'ABR', year2019: 25, year2020: 15 },
  { name: 'MAY', year2019: 35, year2020: 30 },
  { name: 'JUN', year2019: 25, year2020: 48 },
  { name: 'JUL', year2019: 38, year2020: 20 },
  { name: 'AGO', year2019: 28, year2020: 24 },
  { name: 'SEP', year2019: 32, year2020: 20 },
];

const waveChartData: WaveData[] = [
  { name: 'Lun', val1: 10, val2: 30 },
  { name: 'Mar', val1: 25, val2: 40 },
  { name: 'Mié', val1: 15, val2: 35 },
  { name: 'Jue', val1: 35, val2: 20 },
  { name: 'Vie', val1: 20, val2: 50 },
  { name: 'Sáb', val1: 45, val2: 35 },
  { name: 'Dom', val1: 30, val2: 40 },
];

// --- 3. Componentes de Iconos SVG Mejorados ---
const Icons = {
  Menu: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Dollar: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Share: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Like: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
    </svg>
  ),
  Star: ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  TrendUp: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  TrendDown: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  )
};

// --- 4. Componentes UI Mejorados ---

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isDarkCard = false, isDark = false, colors, trend }) => (
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
        <h3 className="text-2xl font-bold mb-2">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend.isPositive ? <Icons.TrendUp /> : <Icons.TrendDown />}
            <span>{trend.value}%</span>
          </div>
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

const CalendarWidget: React.FC<{ isDark: boolean; colors: Record<number, string> }> = ({ isDark, colors }) => {
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Septiembre 2024</h3>
      </div>
      <div className={`grid grid-cols-7 gap-1 text-center text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        {days.map(day => (
          <div key={day} className="font-medium">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
          <div
            key={day}
            className={`p-2 rounded-lg transition-all ${
              day === currentDay
                ? 'text-white shadow-lg'
                : day === 12
                ? isDark ? 'bg-gray-600 text-white' : 'bg-slate-800 text-white'
                : isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
            style={day === currentDay ? { background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})` } : {}}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey === 'year2019' ? '2019' : '2020'}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- 5. Componente Principal Mejorado ---

export default function DashboardUser() {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const { isDark, colors, pageBg, card, heading, textSecondary, textTertiary, border } = useThemeClasses();

  const statsData = [
    {
      title: "Ganancias",
      value: "$ 2,628",
      icon: <Icons.Dollar className="w-5 h-5 text-white" />,
      isDarkCard: true,
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: "Compartidos",
      value: "2,434",
      icon: <Icons.Share className="w-5 h-5" style={{ color: colors[500] }} />,
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: "Me Gusta",
      value: "1,259",
      icon: <Icons.Like className="w-5 h-5" style={{ color: colors[500] }} />,
      trend: { value: 3.1, isPositive: true }
    },
    {
      title: "Rating",
      value: "4.8/5",
      icon: <Icons.Star className="w-5 h-5" style={{ color: colors[500] }} />,
      trend: { value: 0.5, isPositive: false }
    }
  ];

  return (
    <div className={`min-h-screen ${pageBg} p-4 md:p-8 font-sans`}>

      {/* Header Mejorado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${heading}`}>Dashboard de Usuario</h1>
          <p className={`${textSecondary} mt-1`}>Resumen de tu actividad y métricas</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex rounded-lg p-1 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {(['month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  timeRange === range
                    ? 'text-white shadow-sm'
                    : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                }`}
                style={timeRange === range ? { backgroundColor: colors[500] } : {}}
              >
                {range === 'month' ? 'Mes' : range === 'quarter' ? 'Trimestre' : 'Año'}
              </button>
            ))}
          </div>
          <button className={`p-2 rounded-xl transition-all duration-200 border border-transparent ${isDark ? 'hover:bg-gray-800 hover:border-gray-700' : 'hover:bg-white hover:border-gray-200'}`}>
            <Icons.Menu className={isDark ? 'w-6 h-6 text-gray-400' : 'w-6 h-6'} />
          </button>
        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isDarkCard={stat.isDarkCard}
            isDark={isDark}
            colors={colors as unknown as Record<number, string>}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Columna Izquierda - Gráficos Principales */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">

          {/* Gráfico de Barras Mejorado */}
          <div className={`p-6 rounded-3xl shadow-sm border ${card}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className={`text-xl font-bold ${heading}`}>Resultados Anuales</h2>
                <p className={`${textTertiary} text-sm mt-1`}>Comparativa 2019 vs 2020</p>
              </div>
              <button className="btn-primary text-sm font-semibold px-6 py-2 rounded-full shadow-lg transition-all transform hover:scale-105">
                Ver Detalles
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} barGap={8} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: isDark ? '#9ca3af' : '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="year2020"
                    fill={isDark ? colors[400] : '#1e293b'}
                    radius={[6, 6, 0, 0]}
                    barSize={16}
                    name="2020"
                  />
                  <Bar
                    dataKey="year2019"
                    fill={colors[500]}
                    radius={[6, 6, 0, 0]}
                    barSize={16}
                    name="2019"
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className={`flex items-center gap-2 text-sm ${textTertiary}`}>
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[500] }}></span>
                  2019
                </div>
                <div className={`flex items-center gap-2 text-sm ${textTertiary}`}>
                  <span className={`w-3 h-3 rounded-sm ${isDark ? 'bg-gray-400' : 'bg-slate-800'}`}></span>
                  2020
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Áreas y Calendario */}
          <div className={`rounded-3xl shadow-sm border overflow-hidden ${card}`}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gráfico de Áreas */}
              <div className={`p-6 border-b md:border-b-0 md:border-r ${border}`}>
                <h3 className={`font-semibold ${heading} mb-4`}>Tendencia Semanal</h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[500] }}></span>
                    <span className={`text-sm ${textTertiary}`}>Ventas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${isDark ? 'bg-gray-400' : 'bg-slate-800'}`}></span>
                    <span className={`text-sm ${textTertiary}`}>Ingresos</span>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveChartData}>
                      <defs>
                        <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors[500]} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={colors[500]} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isDark ? '#9ca3af' : '#1e293b'} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={isDark ? '#9ca3af' : '#1e293b'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="val1"
                        stroke={colors[500]}
                        fill="url(#colorVal1)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="val2"
                        stroke={isDark ? '#9ca3af' : '#1e293b'}
                        fill="url(#colorVal2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Calendario */}
              <div className="p-4">
                <CalendarWidget isDark={isDark} colors={colors as unknown as Record<number, string>} />
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha - Gráfico Circular y Métricas */}
        <div className={`p-6 rounded-3xl shadow-sm border flex flex-col h-full ${card}`}>
          <div className="text-center mb-6">
            <h2 className={`text-xl font-bold ${heading}`}>Progreso General</h2>
            <p className={`${textTertiary} text-sm`}>Estado de tus objetivos</p>
          </div>

          <div className="relative flex-1 flex items-center justify-center mb-6">
            <div className="relative w-full max-w-[220px] aspect-square">
              {/* Texto Central */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-3xl font-bold ${heading}`}>45%</span>
                <span className={`text-sm mt-1 ${textTertiary}`}>Completado</span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completado', value: 45, color: colors[500] },
                      { name: 'Pendiente', value: 55, color: isDark ? '#374151' : '#f3f4f6' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {[
                      { color: colors[500] },
                      { color: isDark ? '#374151' : '#f3f4f6' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lista de Métricas */}
          <div className="space-y-3 mb-6">
            {[
              { label: 'Tareas Completadas', value: '24/45', color: colors[600] },
              { label: 'Proyectos Activos', value: '8', color: colors[500] },
              { label: 'Metas Alcanzadas', value: '12/20', color: '#10b981' },
              { label: 'Tiempo Promedio', value: '3.2h', color: '#8b5cf6' }
            ].map((item, index) => (
              <div key={index} className={`flex items-center justify-between py-2 border-b last:border-b-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className={`text-sm ${textTertiary}`}>{item.label}</span>
                </div>
                <span className={`text-sm font-semibold ${heading}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <button className="w-full btn-primary font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105">
            Ver Reporte Completo
          </button>
        </div>

      </div>
    </div>
  );
}
