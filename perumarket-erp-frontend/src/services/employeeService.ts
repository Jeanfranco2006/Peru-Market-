import { type AxiosResponse, isAxiosError } from 'axios'; 
import type { Employee, Departament } from '../types/Employee'; 
import { api } from './api';

// --- UTILITIES ---

const normalizeEmployeePayload = (emp: Employee) => {
    return {
        ...emp,
        // Asegura enviar solo el ID del departamento o null si no tiene
        departamento: emp.departamento?.id ? { id: emp.departamento.id } : null,
    };
};

const getAxiosErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        // Soporte para { message: "..." } o string directo del backend
        const data = error.response?.data as any;
        return data?.message || (typeof data === 'string' ? data : error.message);
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
        const payload = normalizeEmployeePayload(emp);
        
        try {
            let response: AxiosResponse<Employee>;
            
            // Lógica simplificada: si tiene ID es edición (PUT), si no, es creación (POST)
            if (emp.empleadoId) {
                response = await api.put<Employee>(`/empleados/${emp.empleadoId}`, payload);
            } else {
                response = await api.post<Employee>('/empleados', payload);
            }
            
            return response.data;
        } catch (error) {
            throw new Error(`Error al guardar empleado: ${getAxiosErrorMessage(error)}`);
        }
    },

    deleteEmployee: async (empleadoId: number): Promise<void> => {
        try {
            await api.delete(`/empleados/${empleadoId}`);
        } catch (error) {
            throw new Error(`Error al eliminar empleado: ${getAxiosErrorMessage(error)}`);
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
            // CORRECCIÓN: Mejor lanzar el error para que la UI sepa que algo falló,
            // en lugar de fingir que hay 0 departamentos.
            throw new Error(getAxiosErrorMessage(error)); 
        }
    },

    saveDepartment: async (dep: Departament): Promise<Departament> => {
        try {
            let response: AxiosResponse<Departament>;

            // CORRECCIÓN: Agregada lógica para soportar EDICIÓN de departamentos
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