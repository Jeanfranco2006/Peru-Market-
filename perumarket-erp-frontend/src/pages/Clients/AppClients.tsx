import { useEffect, useState } from "react";
import ClienteCard from "./ClientCards";
import ClienteForm from "./ClientFrom";
import ClientsSearchBar from "./ClientSearchBar";
import ClienteDeleteModal from "./ClientDeleteModal";
import type { Cliente } from "../../types/Client";

export default function AppClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  

  // -------------------------
  // CARGA INICIAL
  // -------------------------
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/clientes");
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // FILTROS
  // -------------------------
  const [filters, setFilters] = useState({ texto: "", dni: "", tipo: "" });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

const filteredClientes = clientes.filter((c) => {
  const fullName =
    `${c.persona.nombres} ${c.persona.apellidoPaterno} ${c.persona.apellidoMaterno}`.toLowerCase();

  const dni = c.persona.numeroDocumento.toLowerCase();

  return (
    fullName.includes(filters.texto.toLowerCase()) &&
    dni.includes(filters.dni.toLowerCase()) &&
    // 🔥 Nuevo filtro por tipo
    (filters.tipo === "" || c.tipo === filters.tipo)
  );
});


  // -------------------------
  // FORMULARIO
  // -------------------------
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formCliente, setFormCliente] = useState<Cliente | null>(null);

  const openForm = (cli?: Cliente) => {
    if (cli) {
      setFormCliente({ ...cli });
    } else {
      setFormCliente({
        clienteid: undefined,
        tipo: "",
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        persona: {
          id: undefined,
          tipoDocumento: "DNI",
          numeroDocumento: "",
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          correo: "",
          telefono: "",
          direccion: "",
          fechaNacimiento: "",
        },
      });
    }

    setIsFormVisible(true);
  };

  const setFormField = (path: string, value: any) => {
    const keys = path.split(".");
    setFormCliente((prev) => {
      if (!prev) return prev;

      const updated: any = { ...prev };
      let ref = updated;

      keys.forEach((k, i) => {
        if (i === keys.length - 1) {
          ref[k] = value;
        } else {
          ref[k] = { ...ref[k] };
          ref = ref[k];
        }
      });

      return updated;
    });
  };

  // -------------------------
  // GUARDAR CLIENTE
  // -------------------------
  const handleSaveCliente = async (cli: Cliente) => {
    try {
      const url = cli.clienteid
        ? `http://localhost:8080/api/clientes/${cli.clienteid}`
        : "http://localhost:8080/api/clientes";

      const method = cli.clienteid ? "PUT" : "POST";

      const clienteToSend = {
        ...cli,
        persona: {
          ...cli.persona,
        },
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteToSend),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      await loadClientes();
      setIsFormVisible(false);
      setFormCliente(null);
    } catch (err) {
      console.error("Error guardando cliente:", err);
      alert("Error al guardar cliente");
    }
  };

  // -------------------------
  // ELIMINAR CLIENTE
  // -------------------------
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);

  const handleDeleteCliente = async () => {
    if (!deletingCliente?.clienteid) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/clientes/${deletingCliente.clienteid}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      await loadClientes();
      setDeletingCliente(null);
    } catch (err) {
      console.error("Error eliminando cliente:", err);
      alert("Error al eliminar cliente");
    }
  };

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex h-64 justify-center items-center">
        <div className="text-lg">Cargando clientes...</div>
      </div>
    );
  }

  // -------------------------
  // RENDER PRINCIPAL
  // -------------------------
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Clientes</h1>

      {/* BARRA DE BÚSQUEDA Y BOTÓN */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ClientsSearchBar filters={filters} onChange={handleFilterChange} />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => openForm()}
        >
          Registrar Cliente
        </button>
      </div>

      {/* CONTADOR */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredClientes.length} de {clientes.length} clientes
      </div>

      {/* LISTA */}
      {filteredClientes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay clientes que coincidan
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClientes.map((cli) => (
            <ClienteCard
              key={cli.clienteid}
              data={cli}
              onEdit={() => openForm(cli)}
              onDelete={() => setDeletingCliente(cli)}
            />
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {isFormVisible && formCliente && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg">
            <ClienteForm
              state={formCliente}
              setField={setFormField}
              onCancel={() => setIsFormVisible(false)}
              onSave={handleSaveCliente}
            />
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      <ClienteDeleteModal
        visible={!!deletingCliente}
        message={`¿Deseas eliminar a ${deletingCliente?.persona.nombres} ${deletingCliente?.persona.apellidoPaterno}?`}
        onCancel={() => setDeletingCliente(null)}
        onConfirm={handleDeleteCliente}
      />
    </div>
  );
}
