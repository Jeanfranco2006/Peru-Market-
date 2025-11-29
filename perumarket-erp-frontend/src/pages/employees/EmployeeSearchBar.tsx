import { FaSearch, FaIdCard, FaFilter } from "react-icons/fa";

interface Props {
  filters: {
    texto: string;
    estado: string;
    dni: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function EmployeeSearchBar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      
      {/* Buscar por texto - Campo principal */}
      <div className="flex-1 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Buscar empleados por nombre..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 bg-white hover:border-gray-400"
          value={filters.texto}
          onChange={(e) => onChange("texto", e.target.value)}
        />
        {filters.texto && (
          <button
            onClick={() => onChange("texto", "")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filtros adicionales en línea */}
      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* Filtro DNI */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaIdCard className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="N° Documento"
            className="w-full sm:w-40 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 bg-white hover:border-gray-400"
            value={filters.dni}
            onChange={(e) => onChange("dni", e.target.value)}
            maxLength={8}
          />
          {filters.dni && (
            <button
              onClick={() => onChange("dni", "")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filtro Estado */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <select
            className="w-full sm:w-40 pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 appearance-none cursor-pointer"
            value={filters.estado}
            onChange={(e) => onChange("estado", e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

      </div>

      {/* Indicadores de filtros activos (opcional) */}
      {(filters.texto || filters.dni || filters.estado) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 sm:pt-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-gray-200">
          <span className="font-medium">Filtros activos:</span>
          <div className="flex flex-wrap gap-2">
            {filters.texto && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Nombre: {filters.texto}
                <button
                  onClick={() => onChange("texto", "")}
                  className="hover:text-blue-900 transition-colors"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.dni && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                DNI: {filters.dni}
                <button
                  onClick={() => onChange("dni", "")}
                  className="hover:text-green-900 transition-colors"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.estado && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                Estado: {filters.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                <button
                  onClick={() => onChange("estado", "")}
                  className="hover:text-purple-900 transition-colors"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}