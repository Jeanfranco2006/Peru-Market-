import {
  FaRegUser,
  FaEnvelope,
  FaPhone,
  FaCalendarDays,
  FaIdCard,
  FaUserCheck,
  FaSignature,
} from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";

import type { FormEvent, JSX } from "react";
import type { Cliente } from "../../types/Client";

interface Props {
  state: Cliente;
  setField: (path: string, value: any) => void;
  onCancel: () => void;
  onSave: (cli: Cliente) => void;
}

// ------------------------------------------------------
// CAMPOS REUTILIZABLES
// ------------------------------------------------------

interface InputFieldProps {
  label: string;
  icon: JSX.Element;
  value: string;
  type?: string;
  onChange: (val: string) => void;
}

const InputField = ({ label, icon, value, type = "text", onChange }: InputFieldProps) => (
  <div>
    <label className="text-sm font-medium flex items-center gap-1 text-black">
      {icon} {label}
    </label>
    <input
      type={type}
      className="border rounded px-3 py-2 w-full text-black"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  icon: JSX.Element;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const SelectField = ({ label, icon, value, options, onChange }: SelectFieldProps) => (
  <div>
    <label className="text-sm font-medium flex items-center gap-1 text-black">
      {icon} {label}
    </label>
    <select
      className="border rounded px-3 py-2 w-full text-black"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Seleccionar...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// ------------------------------------------------------
// FORMULARIO PRINCIPAL
// ------------------------------------------------------

export default function ClienteForm({ state, setField, onCancel, onSave }: Props) {
  const tiposCliente = ["NATURAL", "JURIDICA",];
  const tiposDocumento = ["DNI", "Pasaporte", "CE"];

  function submit(e: FormEvent) {
    e.preventDefault();

    if (!state.persona.nombres.trim())
      return alert("El nombre es obligatorio");

    if (!state.persona.numeroDocumento.trim())
      return alert("El número de documento es obligatorio");

    onSave(state);
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-4 p-4 bg-white rounded shadow-md max-h-[85vh] overflow-y-auto"
    >
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
        <FaUserCheck className="text-black" /> Registrar / Editar Cliente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* -------- COLUMNA IZQUIERDA -------- */}
        <div className="space-y-3">
          <SelectField
            label="Tipo Cliente"
            icon={<FaSignature />}
            value={state.tipo || ""}
            options={tiposCliente}
            onChange={(val) => setField("tipo", val)}
          />

          <SelectField
            label="Tipo Documento"
            icon={<FaIdCard />}
            value={state.persona.tipoDocumento}
            options={tiposDocumento}
            onChange={(val) => setField("persona.tipoDocumento", val)}
          />

          <InputField
            label="Nombres"
            icon={<FaRegUser />}
            value={state.persona.nombres}
            onChange={(val) => setField("persona.nombres", val)}
          />

          <InputField
            label="Correo"
            icon={<FaEnvelope />}
            type="email"
            value={state.persona.correo}
            onChange={(val) => setField("persona.correo", val)}
          />

          <InputField
            label="Dirección"
            icon={<FaMapMarkerAlt />}
            value={state.persona.direccion}
            onChange={(val) => setField("persona.direccion", val)}
          />

          <InputField
            label="Fecha de Nacimiento"
            icon={<FaCalendarDays />}
            type="date"
            value={state.persona.fechaNacimiento || ""}
            onChange={(val) => setField("persona.fechaNacimiento", val)}
          />
        </div>

        {/* -------- COLUMNA DERECHA -------- */}
        <div className="space-y-3">
          <InputField
            label="N° Documento"
            icon={<FaIdCard />}
            value={state.persona.numeroDocumento}
            onChange={(val) => setField("persona.numeroDocumento", val)}
          />

          <InputField
            label="Apellido Paterno"
            icon={<FaRegUser />}
            value={state.persona.apellidoPaterno}
            onChange={(val) => setField("persona.apellidoPaterno", val)}
          />

          <InputField
            label="Apellido Materno"
            icon={<FaRegUser />}
            value={state.persona.apellidoMaterno}
            onChange={(val) => setField("persona.apellidoMaterno", val)}
          />

          <InputField
            label="Teléfono"
            icon={<FaPhone />}
            value={state.persona.telefono}
            onChange={(val) => setField("persona.telefono", val)}
          />
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* BOTONES INFERIORES */}
      {/* ---------------------------------- */}
      <div className="flex justify-end gap-3 mt-4 sticky bottom-0 bg-white py-3 border-t">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-black"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
