// hooks/useEmployeeManagement.ts
import { useState, useEffect, useCallback } from 'react';
import type { Employee, Departament } from '../types/Employee';
import { EmployeeService, DepartmentService } from '../services/employeeService';

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departamentos, setDepartamentos] = useState<Departament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    texto: '',
    dni: '',
    estado: '',
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [emps, deps] = await Promise.all([
        EmployeeService.getAllEmployees(),
        DepartmentService.getAllDepartments()
      ]);
      setEmployees(emps);
      setDepartamentos(deps);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar empleados
  const filteredEmployees = employees.filter(emp => {
    const { texto, dni, estado } = filters;
    const nombreCompleto = `${emp.persona.nombres} ${emp.persona.apellidoPaterno} ${emp.persona.apellidoMaterno || ''}`.toLowerCase();
    
    if (texto && !nombreCompleto.includes(texto.toLowerCase())) return false;
    if (dni && !emp.persona.numeroDocumento.includes(dni)) return false;
    if (estado && emp.estado !== estado) return false;
    
    return true;
  });

  // Estadísticas
  const stats = {
    total: employees.length,
    activos: employees.filter(e => e.estado === 'ACTIVO').length,
    filtered: filteredEmployees.length,
  };

  // Handler para guardar empleado
  const handleSaveEmployee = async (emp: Employee): Promise<boolean> => {
    setLoading(true);
    try {
      const savedEmployee = await EmployeeService.saveEmployee(emp);
      
      // Actualizar estado local
      setEmployees(prev => {
        if (savedEmployee.empleadoId) {
          return prev.map(e => 
            e.empleadoId === savedEmployee.empleadoId ? savedEmployee : e
          );
        } else {
          return [...prev, savedEmployee];
        }
      });
      
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar empleado';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handler para eliminar empleado
  const handleDeleteEmployee = async (empleadoId: number): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await EmployeeService.deleteEmployee(empleadoId);
      if (success) {
        setEmployees(prev => prev.filter(emp => emp.empleadoId !== empleadoId));
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar empleado';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handler para guardar departamento
  const handleSaveDepartment = async (dep: Departament): Promise<boolean> => {
    setLoading(true);
    try {
      const savedDepartment = await DepartmentService.saveDepartment(dep);
      
      setDepartamentos(prev => {
        if (savedDepartment.id) {
          return prev.map(d => 
            d.id === savedDepartment.id ? savedDepartment : d
          );
        } else {
          return [...prev, savedDepartment];
        }
      });
      
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar departamento';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ texto: '', dni: '', estado: '' });
  };

  return {
    employees,
    departamentos,
    loading,
    error,
    filters,
    stats,
    filteredEmployees,
    handleFilterChange,
    clearFilters,
    handleSaveEmployee,
    handleDeleteEmployee,
    handleSaveDepartment,
  };
};