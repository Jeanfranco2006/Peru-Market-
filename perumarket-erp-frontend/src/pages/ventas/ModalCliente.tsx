import { useState } from "react";
import ClienteForm from "../Clients/ClientFrom";
import { FaUserPlus } from "react-icons/fa";
import type { Cliente } from "../../types/Client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegistrar: (cli: Cliente) => void;
}

export default function ModalCliente({ isOpen, onClose, onRegistrar }: Props) {
  if (!isOpen) return null;

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
      // caso simple: tipo, fechaCreacion, fechaActualizacion
      if (parts.length === 1) {
        const key = parts[0] as keyof Cliente;
        return {
          ...prev,
          [key]: value
        };
      }

      // caso anidado: persona.algo
      if (parts.length === 2 && parts[0] === "persona") {
        const prop = parts[1] as keyof Cliente["persona"];
        return {
          ...prev,
          persona: {
            ...prev.persona,
            [prop]: value
          }
        };
      }

      return prev;
    });
  };

  const handleSave = () => {
    onRegistrar(cliente);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="p-4 border-b flex items-center gap-2">
          <FaUserPlus className="text-blue-600" />
          <h2 className="text-lg font-bold">Registrar Cliente</h2>
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
