import { FiSearch, FiDownload, FiPlus } from "react-icons/fi";
import { useThemeClasses } from "../../hooks/useThemeClasses";

// Componente de búsqueda y filtros
export const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  filterOptions,
  onFilterChange,
  onAddNew,
  addButtonText
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterOptions?: React.ReactNode;
  onFilterChange?: (value: string) => void;
  onAddNew: () => void;
  addButtonText: string
}) => {
  const { isDark } = useThemeClasses();

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex-1 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all ${
              isDark ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
            }`}
          />
        </div>
        {filterOptions && (
          <select
            onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
            className={`w-full sm:w-48 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary-500)]/20 focus:border-[var(--color-primary-500)] transition-all ${
              isDark ? 'bg-gray-800 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            {filterOptions}
          </select>
        )}
      </div>
      <div className="flex gap-3">
        <button className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
          isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}>
          <FiDownload size={16} />
          <span className="hidden sm:block">Exportar</span>
        </button>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-6 py-3 btn-primary rounded-lg font-medium"
        >
          <FiPlus size={16} />
          {addButtonText}
        </button>
      </div>
    </div>
  );
};
