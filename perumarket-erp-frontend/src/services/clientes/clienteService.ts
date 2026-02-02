import { type AxiosResponse, isAxiosError } from 'axios';
import type { Cliente, TipoCliente } from '../../types/clientes/Client';
import { api } from '../api';

// --- UTILITIES ---
const getAxiosErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data as any;
    
    // Manejo específico para errores de validación del backend
    if (error.response?.status === 400) {
      return data?.message || data?.error || 'Error de validación en los datos enviados.';
    }
    
    if (error.response?.status === 409) {
      // Mensaje formal para conflicto de eliminación o duplicidad
      return data?.message || 'Operación no permitida por conflicto de datos (integridad referencial).';
    }
    
    return data?.message || (typeof data === 'string' ? data : error.message);
  }
  return error instanceof Error ? error.message : 'Error desconocido de conexión.';
};

// Verificar si un DNI ya existe
export const checkDniExists = async (numeroDocumento: string, excludeId?: number): Promise<{ exists: boolean; message: string }> => {
  try {
    const params: any = { dni: numeroDocumento };
    if (excludeId) {
      params.excludeId = excludeId;
    }
    
    const response = await api.get('/clientes/check-dni', { params });
    // Aseguramos que la respuesta tenga el formato esperado
    return {
      exists: response.data?.exists || false,
      message: response.data?.message || ''
    };
  } catch (error) {
    console.error('Error checking DNI:', error);
    return { exists: false, message: 'No se pudo verificar el documento.' };
  }
};

// --- SERVICES ---
export const ClienteService = {
  // Obtener todos los clientes
  getAllClientes: async (): Promise<Cliente[]> => {
    try {
      const response = await api.get<Cliente[]>('/clientes');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching clients:', error);
      throw new Error(getAxiosErrorMessage(error));
    }
  },

  // Guardar cliente (crear o editar)
  saveCliente: async (cliente: Cliente): Promise<Cliente> => {
    try {
      let response: AxiosResponse<Cliente>;
      
      if (cliente.id) {
        response = await api.put<Cliente>(`/clientes/${cliente.id}`, cliente);
      } else {
        response = await api.post<Cliente>('/clientes', cliente);
      }
      return response.data;
      
    } catch (error) {
      console.error('❌ Error saving client:', error);
      throw new Error(getAxiosErrorMessage(error));
    }
  },

  // Eliminar cliente


  deleteCliente: async (id: number): Promise<void> => {
    // 1. Configuramos Axios para que NO explote con el 409
    const response = await api.delete(`/clientes/${id}`, {
        validateStatus: (status) => {
            // Aceptamos 2xx Y TAMBIÉN 409 como "respuestas válidas"
            return (status >= 200 && status < 300) || status === 409;
        }
    });

    // 2. Nosotros decidimos que el 409 es una excepción controlada
    if (response.status === 409) {
        throw { 
            status: 409, 
            response: { status: 409 }, 
            message: "Conflicto: El cliente tiene ventas asociadas." 
        };
    }

    console.log(`✅ Cliente ${id} eliminado físicamente`);
  },

  // Desactivar cliente (Borrado Lógico)
  desactivarCliente: async (id: number): Promise<void> => {
      try {
          // Obtenemos el cliente actual, cambiamos estado y guardamos
          const { data: cliente } = await api.get<Cliente>(`/clientes/${id}`);
          cliente.estado = 'INACTIVO';
          await api.put(`/clientes/${id}`, cliente);
          console.log(`✅ Cliente ${id} desactivado exitosamente`);
      } catch (error) {
          throw new Error("No se pudo desactivar el cliente: " + getAxiosErrorMessage(error));
      }
  }
};