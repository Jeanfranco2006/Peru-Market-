import { type AxiosResponse, isAxiosError } from 'axios'; 
import type { Employee, Departament } from '../types/Employee'; 
import { api } from './api';

// --- UTILITIES ---

/**
 * Normaliza los datos antes de enviarlos al backend.
 * Soluciona el problema de "departamento null" o datos de persona perdidos.
 */
const normalizeEmployeePayload = (emp: Employee) => {
    // 1. Asegurar que departamento se envíe correctamente según lo que espera Java/C#/Node
    // Si el select del formulario guardó solo el ID, o si es un objeto completo:
    let departamentoPayload = null;
    
    if (emp.departamento) {
        // Si es un objeto con ID (caso normal)
        if (typeof emp.departamento === 'object' && 'id' in emp.departamento) {
             departamentoPayload = { id: emp.departamento.id };
        } 
        // Si por error del formulario llegó solo el número ID
        else if (typeof emp.departamento === 'number') {
             departamentoPayload = { id: emp.departamento };
        }
    }

    return {
        ...emp,
        // 2. Aseguramos que persona vaya completa
        persona: {
            ...emp.persona,
            // A veces el backend necesita el ID de persona explícito en updates
            // Si no lo tienes en el form, el spread operator (...) lo mantiene si ya existía
        },
        // 3. Sobrescribimos departamento con el formato correcto { id: X }
        departamento: departamentoPayload, 
    };
};

const getAxiosErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data as any;
        // Intenta capturar mensajes de error de SpringBoot, .NET o Node estándar
        return data?.message || data?.error || (typeof data === 'string' ? data : error.message);
    }
    return error instanceof Error ? error.message : 'Error desconocido.';
};

// --- SERVICES ---

export const EmployeeService = {
    getAllEmployees: async (): Promise<Employee[]> => {
        try {
            const response = await api.get<Employee[]>('/empleados');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching employees:', error);
            throw new Error(getAxiosErrorMessage(error));
        }
    },

    saveEmployee: async (emp: Employee): Promise<Employee> => {
        // APLICAMOS LA NORMALIZACIÓN AQUÍ
        const payload = normalizeEmployeePayload(emp);
        
        console.log("📡 Enviando Payload:", payload); // DEBUG: Mira esto en la consola del navegador

        try {
            let response: AxiosResponse<Employee>;
            
            // Lógica de Crear vs Editar
            if (emp.empleadoId) {
                // PUT: Editar
                response = await api.put<Employee>(`/empleados/${emp.empleadoId}`, payload);
            } else {
                // POST: Crear
                response = await api.post<Employee>('/empleados', payload);
            }
            
            return response.data;
        } catch (error) {
            console.error("❌ Error saving employee:", error);
            throw new Error(getAxiosErrorMessage(error));
        }
    },

    deleteEmployee: async (empleadoId: number): Promise<boolean> => {
        try {
            console.log(`🗑️ Intentando eliminar empleado ID: ${empleadoId}`);
            
            // Agregamos await para esperar que termine
            await api.delete(`/empleados/${empleadoId}`);
            
            return true; // Retornamos true si tuvo éxito
        } catch (error) {
            console.error("❌ Error deleting employee:", error);
            throw new Error(getAxiosErrorMessage(error));
        }
    },
};

export const DepartmentService = {
    getAllDepartments: async (): Promise<Departament[]> => {
        try {
            const response = await api.get<Departament[]>('/departamentos');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching departments:', error);
            throw new Error(getAxiosErrorMessage(error)); 
        }
    },

    saveDepartment: async (dep: Departament): Promise<Departament> => {
        try {
            let response: AxiosResponse<Departament>;
            if (dep.id) {
                response = await api.put<Departament>(`/departamentos/${dep.id}`, dep);
            } else {
                response = await api.post<Departament>('/departamentos', dep);
            }
            return response.data;
        } catch (error) {
            throw new Error(`Error al guardar departamento: ${getAxiosErrorMessage(error)}`);
        }
    },
};