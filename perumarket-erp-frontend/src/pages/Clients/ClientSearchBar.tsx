import { FaSearch } from "react-icons/fa";

interface Props {
  filters: {
    texto: string;
    dni: string;
    tipo: string;   // 👈 AGREGADO
  };
  onChange: (field: string, value: string) => void;
}

export default function ClientsSearchBar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded shadow mb-4">

      {/* Buscar por texto */}
      <div className="flex items-center gap-2 border px-3 py-2 rounded w-64">
        <FaSearch className="text-gray-600" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="outline-none w-full"
          value={filters.texto}
          onChange={(e) => onChange("texto", e.target.value)}
        />
      </div>

      {/* Buscar por DNI */}
      <input
        type="text"
        placeholder="Buscar por DNI"
        className="border px-3 py-2 rounded w-40"
        value={filters.dni}
        onChange={(e) => onChange("dni", e.target.value)}
      />

      {/* Filtro por tipo */}
      <select
        className="border px-3 py-2 rounded w-40"
        value={filters.tipo}
        onChange={(e) => onChange("tipo", e.target.value)}
      >
        <option value="">Todos</option>
        <option value="NATURAL">NATURAL</option>
        <option value="JURIDICA">JURIDICA</option>
      </select>

    </div>
  );
}
