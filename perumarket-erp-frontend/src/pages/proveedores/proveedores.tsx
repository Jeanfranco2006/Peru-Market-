import React, { useState, useEffect } from "react";
import {
  FaEdit, FaTrash, FaPlus, FaBuilding, FaBox, FaSearch, FaUsers,
} from "react-icons/fa";

import type { ProveedorData } from "../../types/proveedor/proveedor";
import { proveedorService } from "../../services/Proveedores/proveedorservide";

export default function Proveedores() {
  // --- Estados ---
  const [proveedores, setProveedores] = useState<ProveedorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados UI
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProveedorData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const initialFormData: ProveedorData = {
    ruc: "", razon_social: "", contacto: "", telefono: "",
    correo: "", direccion: "", estado: "ACTIVO",
  };
  const [formData, setFormData] = useState<ProveedorData>(initialFormData);

  // --- Carga de Datos (Usando el Service) ---
  const fetchProveedores = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      // Llamada limpia al servicio
      const data = await proveedorService.getAll(query);
      setProveedores(data);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar los proveedores. Verifique el Backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // --- Handlers (Lógica UI + Service) ---

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProveedores(searchTerm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await proveedorService.update(formData.id, formData);
        alert("Proveedor editado correctamente");
      } else {
        await proveedorService.create(formData);
        alert("Proveedor creado correctamente");
      }
      setShowModal(false);
      setIsEditing(false);
      fetchProveedores(searchTerm);
    } catch (err: any) {
      console.error("Error al guardar:", err);
      alert(err.response?.data || "Error al guardar el proveedor.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      await proveedorService.delete(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      alert("Proveedor eliminado correctamente");
      fetchProveedores(searchTerm);
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar. Puede estar asociado a productos.");
    }
  };

  // --- Funciones auxiliares de UI ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // --- Renderizado (Vista) ---

  if (loading && proveedores.length === 0 && !error) {
    return <div className="p-10 text-center">Cargando proveedores...</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 m-6 rounded border border-red-400">
        <strong>Error: </strong> {error}
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <FaUsers className="text-[#7E1F20]" />
        <span>PROVEEDORES</span>
      </h1>

      {/* Stats Cards */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex items-center gap-3">
          <div className="bg-[#F2E8D5] p-3 rounded-lg">
            <FaBuilding className="text-[#7E1F20] text-xl" />
          </div>
          <div>
            <h3 className="text-gray-600 text-sm">Total de proveedores</h3>
            <p className="text-2xl font-bold">{proveedores.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex items-center gap-3">
          <div className="bg-[#F2E8D5] p-3 rounded-lg">
            <FaBox className="text-[#7E1F20] text-xl" />
          </div>
          <div>
            <h3 className="text-gray-600 text-sm">Total de productos (Simulado)</h3>
            <p className="text-2xl font-bold">156</p>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar por RUC o Razón Social"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-[#7E1F20]"
          />
          <button type="submit" className="bg-[#7E1F20] text-white px-6 py-3 rounded-lg hover:bg-[#65171A]">
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Botón Nuevo */}
      <div className="mb-3">
        <button onClick={handleCreateClick} className="bg-[#7E1F20] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-[#65171A]">
          <FaPlus /> Nuevo Proveedor
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
            {proveedores.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.ruc}</td>
                <td className="p-3">{p.razon_social}</td>
                <td className="p-3">{p.contacto}</td>
                <td className="p-3">{p.telefono}</td>
                <td className="p-3">{p.correo}</td>
                <td className="p-3">{p.direccion}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => handleEdit(p)} className="text-[#7E1F20] hover:text-[#65171A]"><FaEdit /></button>
                  <button onClick={() => handleDeleteClick(p)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modales (Sin cambios visuales, solo usan el state limpio) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar" : "Crear"} Proveedor</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inputs */}
              <input name="ruc" value={formData.ruc} onChange={handleInputChange} placeholder="RUC" className="p-3 border rounded" required />
              <input name="razon_social" value={formData.razon_social} onChange={handleInputChange} placeholder="Razón Social" className="p-3 border rounded" required />
              <input name="contacto" value={formData.contacto} onChange={handleInputChange} placeholder="Contacto" className="p-3 border rounded" />
              <input name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono" className="p-3 border rounded" />
              <input name="correo" value={formData.correo} onChange={handleInputChange} placeholder="Correo" className="p-3 border rounded md:col-span-2" type="email" />
              <input name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección" className="p-3 border rounded md:col-span-2" />
              <select name="estado" value={formData.estado} onChange={handleInputChange} className="p-3 border rounded">
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#7E1F20] text-white rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Eliminar Proveedor</h2>
            <p>¿Seguro que deseas eliminar a <b>{deleteTarget?.razon_social}</b>?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-[#7E1F20] text-white rounded">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}