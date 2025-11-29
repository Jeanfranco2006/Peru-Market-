import type { Cliente } from "../../types/Client";
import { formatDate } from "../../utils/format";
import { FiCreditCard, FiMail, FiPhone, FiCalendar } from "react-icons/fi";

interface Props {
  data: Cliente;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ClienteCard({ data, onEdit, onDelete }: Props) {
  const iniciales = `${
    data.persona?.nombres?.charAt(0)?.toUpperCase() || ""
  }${data.persona?.apellidoPaterno?.charAt(0)?.toUpperCase() || ""}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-semibold">
          {iniciales}
        </div>

        <div>
          <h2 className="font-bold text-lg">
            {data.persona.nombres} {data.persona.apellidoPaterno}{" "}
            {data.persona.apellidoMaterno}
          </h2>
          <p className="text-gray-500 text-sm">Tipo: {data.tipo}</p>
        </div>
      </div>

      {/* INFO */}
      <div className="mt-3 text-sm text-gray-700 space-y-2">
        <p className="flex items-center gap-2">
          <FiCreditCard className="text-blue-600" />
          N° Documento: {data.persona.numeroDocumento}
        </p>

        <p className="flex items-center gap-2">
          <FiMail className="text-blue-600" />
          {data.persona.correo || "Sin correo"}
        </p>

        <p className="flex items-center gap-2">
          <FiPhone className="text-blue-600" />
          {data.persona.telefono || "Sin teléfono"}
        </p>

        <p className="flex items-center gap-2">
          <FiCalendar className="text-blue-600" />
          Registro: {formatDate(data.fechaCreacion)}
        </p>
      </div>

      {/* ACCIONES */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Editar
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
