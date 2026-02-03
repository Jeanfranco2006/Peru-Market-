import { useState } from "react";
import ClienteForm from "../Clients/ClientFrom";
import { FiUserPlus, FiX } from "react-icons/fi";
import type { Cliente } from "../../types/clientes/Client";
import { useThemeClasses } from '../../hooks/useThemeClasses';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegistrar: (cli: Cliente) => void;
}

export default function ModalCliente({ isOpen, onClose, onRegistrar }: Props) {
  if (!isOpen) return null;

  const { isDark, colors, heading, modalOverlay, modalContent, border } = useThemeClasses();

  const [cliente, setCliente] = useState<Cliente>({
    tipo: "NATURAL",
    persona: {
      tipoDocumento: "DNI",
      numeroDocumento: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correo: "",
      telefono: "",
      direccion: "",
      fechaNacimiento: ""
    },
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  });

  const setField = (path: string, value: any) => {
    const parts = path.split(".");
    setCliente((prev) => {
      if (parts.length === 1) {
        const key = parts[0] as keyof Cliente;
        return { ...prev, [key]: value };
      }
      if (parts.length === 2 && parts[0] === "persona") {
        const prop = parts[1] as keyof Cliente["persona"];
        return { ...prev, persona: { ...prev.persona, [prop]: value } };
      }
      return prev;
    });
  };

  const handleSave = () => {
    onRegistrar(cliente);
    onClose();
  };

  return (
    <div className={modalOverlay}>
      <div className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border ${modalContent}`}>
        <div className={`p-5 border-b flex items-center justify-between ${border}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: isDark ? `${colors[900]}40` : colors[50], color: colors[500] }}>
              <FiUserPlus size={20} />
            </div>
            <h2 className={`text-lg font-bold ${heading}`}>Registrar Cliente</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <FiX size={18} />
          </button>
        </div>

        <ClienteForm
          state={cliente}
          setField={setField}
          onCancel={onClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
