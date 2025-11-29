import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBuilding,
  FaBox,
  FaSearch,
  FaUsers,
} from "react-icons/fa";

// Interfaz para coincidir con el DTO del backend
interface ProveedorData {
  id?: number; 
  ruc: string;
  razon_social: string; // Coincide con @JsonProperty del DTO
  contacto: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: "ACTIVO" | "INACTIVO";
}

// URL completa: http://localhost:8080 (puerto) + /api (context-path) + /proveedores (controller mapping)
const API_BASE_URL = "http://localhost:8080/api/proveedores"; 

export default function Proveedores() {
  // --- Estados Principales ---
  const [proveedores, setProveedores] = useState<ProveedorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProveedorData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const initialFormData: ProveedorData = {
    ruc: "",
    razon_social: "",
    contacto: "",
    telefono: "",
    correo: "",
    direccion: "",
    estado: "ACTIVO",
  };
  const [formData, setFormData] = useState<ProveedorData>(initialFormData);


  // --- Función de Carga de Datos ---
  const fetchProveedores = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `${API_BASE_URL}/buscar?q=${query}`
        : API_BASE_URL;
        
      const response = await axios.get<ProveedorData[]>(url);
      setProveedores(response.data);
    } catch (err) {
      console.error("Error al cargar proveedores:", err);
      // Muestra el mensaje que se configuró para el error
      setError("No se pudieron cargar los proveedores. (Verifique que el Backend esté corriendo)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // --- Handlers de Interfaz y CRUD ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleEdit = (proveedor: ProveedorData) => {
    setIsEditing(true);
    setFormData(proveedor);
    setShowModal(true);
  };

  const handleDeleteClick = (proveedor: ProveedorData) => {
    setDeleteTarget(proveedor);
    setShowDeleteModal(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProveedores(searchTerm);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;

    try {
      await axios.delete(`${API_BASE_URL}/${deleteTarget.id}`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      alert("Proveedor eliminado correctamente");
      fetchProveedores(searchTerm); 
    } catch (err) {
      console.error("Error al eliminar proveedor:", err);
      alert("Error al eliminar el proveedor. Puede que esté asociado a otros registros (ej: productos).");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && formData.id) {
        // Petición PUT
        await axios.put(`${API_BASE_URL}/${formData.id}`, formData);
        alert("Proveedor editado correctamente");
      } else {
        // Petición POST
        await axios.post(API_BASE_URL, formData);
        alert("Proveedor creado correctamente");
      }

      setShowModal(false);
      setIsEditing(false);
      fetchProveedores(searchTerm); 

    } catch (err: any) {
      console.error("Error al guardar proveedor:", err.response || err);
      const errorMessage = err.response?.data || "Error al guardar el proveedor. Verifique RUC duplicado o datos.";
      alert(errorMessage);
    }
  };
  
  // --- Renderizado ---

  if (loading && proveedores.length === 0 && !error) {
    return (
      <div className="w-full p-6 bg-gray-100 min-h-screen">
        <p className="text-center text-xl mt-10">Cargando proveedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FaUsers className="text-[#7E1F20]" />
          <span>PROVEEDORES</span>
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error de Conexión: </strong>
            <span className="block sm:inline">{error}</span>
            <p className="mt-2 text-sm">Asegúrese de que el backend de Spring Boot esté **ejecutándose** en `http://localhost:8080/api` y que el **CORS** esté configurado correctamente.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <FaUsers className="text-[#7E1F20]" />
        <span>PROVEEDORES</span>
      </h1>

      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-[#F2E8D5] p-3 rounded-lg">
              <FaBuilding className="text-[#7E1F20] text-xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Total de proveedores</h3>
              <p className="text-2xl font-bold">{proveedores.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-[#F2E8D5] p-3 rounded-lg">
              <FaBox className="text-[#7E1F20] text-xl" />
            </div>
            <div>
              <h3 className="text-gray-600 text-sm">Total de productos (Simulado)</h3>
              <p className="text-2xl font-bold">156</p> 
            </div>
          </div>
        </div>
      </div>

      {/* Card de búsqueda */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
          <span className="bg-[#F2E8D5] p-3 rounded-lg">
            <FaSearch className="text-[#7E1F20] text-xl" />
          </span>
          Búsqueda de Proveedor
        </h3>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por RUC o Razón Social"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7E1F20] focus:border-transparent"
          />

          <button
            type="submit"
            className="bg-[#7E1F20] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#65171A] flex items-center justify-center gap-2"
          >
            <FaSearch />
            Buscar
          </button>
        </form>
      </div>

      {/* Botón Nuevo */}
      <div className="flex justify-start mb-3">
        <button
          onClick={handleCreateClick}
          className="bg-[#7E1F20] text-white px-4 py-2 rounded-lg shadow hover:bg-[#65171A] transition flex items-center gap-2 text-sm font-semibold"
        >
          <FaPlus className="text-xs" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-lg rounded-xl border-t-4 border-[#7E1F20] overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#7E1F20] text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">RUC</th>
              <th className="p-3">Razón Social</th>
              <th className="p-3">Contacto</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Dirección</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Opciones</th>
            </tr>
          </thead>

          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{proveedor.id}</td>
                <td className="p-3">{proveedor.ruc}</td>
                <td className="p-3">{proveedor.razon_social}</td>
                <td className="p-3">{proveedor.contacto}</td>
                <td className="p-3">{proveedor.telefono}</td>
                <td className="p-3">{proveedor.correo}</td>
                <td className="p-3">{proveedor.direccion}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      proveedor.estado === "ACTIVO"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {proveedor.estado}
                  </span>
                </td>

                {/* Botones */}
                <td className="p-3">
                  <div className="flex gap-3">
                    <button
                      className="text-[#7E1F20] hover:text-[#65171A]"
                      onClick={() => handleEdit(proveedor)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(proveedor)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {proveedores.length === 0 && !loading && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  No se encontraron proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? "Editar Proveedor" : "Crear Nuevo Proveedor"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Campos */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUC *
                  </label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social *
                  </label>
                  <input
                    type="text"
                    name="razon_social"
                    value={formData.razon_social}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacto
                  </label>
                  <input
                    type="text"
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#7E1F20] text-white rounded-lg hover:bg-[#65171A]"
                >
                  {isEditing ? "Guardar Cambios" : "Guardar Proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Eliminar Proveedor
            </h2>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro que deseas eliminar al proveedor:
              <br />
              <span className="font-semibold text-gray-900">
                {deleteTarget?.razon_social}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#7E1F20] text-white rounded-lg hover:bg-[#65171A]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}