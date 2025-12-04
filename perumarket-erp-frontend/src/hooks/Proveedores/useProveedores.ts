import { useState, useEffect, useCallback } from 'react';
import type { ProveedorData } from '../../types/proveedor/proveedorType';
import { ProveedorService } from '../../services/Proveedores/proveedorService';

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<ProveedorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProveedores = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const data = await ProveedorService.getAll(query);
      setProveedores(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos del servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  const addProveedor = async (data: ProveedorData) => {
    try {
      await ProveedorService.create(data);
      await fetchProveedores();
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Error al crear proveedor' };
    }
  };

  const editProveedor = async (id: number, data: ProveedorData) => {
    try {
      await ProveedorService.update(id, data);
      await fetchProveedores();
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Error al editar proveedor' };
    }
  };

  const removeProveedor = async (id: number) => {
    try {
      await ProveedorService.delete(id);
      await fetchProveedores();
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Error al eliminar proveedor' };
    }
  };

  return {
    proveedores,
    loading,
    error,
    fetchProveedores,
    addProveedor,
    editProveedor,
    removeProveedor
  };
};