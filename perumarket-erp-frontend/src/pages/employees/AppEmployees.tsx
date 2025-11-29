import { useEffect, useState, useCallback } from "react";

// Importar componentes
import SearchBar from "./EmployeeSearchBar";
import EmployeeCard from "./EmployeeCards";
import EmployeeForm from "./EmployeeForm";
import DeleteModal from "./EmployeeDeleteModal";
import DepartmentForm from "./DepartmentForm";
import type { Departament, Employee } from "../../types/Employee";

export default function AppEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departamentos, setDepartamentos] = useState<Departament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDepFormVisible, setIsDepFormVisible] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [formEmployee, setFormEmployee] = useState<Employee | null>(null);

  // Filtros
  const [filters, setFilters] = useState({
    texto: "",
    dni: "",
    estado: "",
  });

  // Cargar datos iniciales
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/empleados');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      setError("No se pudieron cargar los empleados. Verifique la conexión.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDepartamentos = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/departamentos');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDepartamentos(data);
    } catch (error) {
      console.error('Error cargando departamentos:', error);
      setDepartamentos([]);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
    loadDepartamentos();
  }, [loadEmployees, loadDepartamentos]);

  // Manejo de filtros
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  const clearFilters = () => {
    setFilters({
      texto: "",
      dni: "",
      estado: "",
    });
  };

  // Manejo de formulario de empleado
  const openForm = (emp?: Employee) => {
    if (emp) {
      setFormEmployee({ ...emp });
    } else {
      setFormEmployee({
        empleadoId: undefined,
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
        departamento: null,
        puesto: "",
        sueldo: 0,
        fechaContratacion: new Date().toISOString().substring(0, 10),
        estado: "ACTIVO",
        foto: "",
        cv: "",
      });
    }
    setIsFormVisible(true);
  };

  const handleSaveEmployee = async (emp: Employee) => {
    try {
      const employeeToSend = {
        ...emp,
        departamento: emp.departamento?.id ? {
          id: emp.departamento.id,
          nombre: emp.departamento.nombre,
          descripcion: emp.departamento.descripcion
        } : null
      };

      const url = emp.empleadoId 
        ? `http://localhost:8080/api/empleados/${emp.empleadoId}`
        : 'http://localhost:8080/api/empleados';
      
      const method = emp.empleadoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeToSend),
      });

      if (response.ok) {
        await loadEmployees();
        setIsFormVisible(false);
        setFormEmployee(null);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Error del servidor');
      }
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert(`Error al guardar empleado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Manejo de formulario de departamento
  const openDepartmentForm = () => {
    setFormEmployee(null);
    setIsDepFormVisible(true);
  };

  const handleSaveDepartment = async (dep: Departament) => {
    try {
      const response = await fetch('http://localhost:8080/api/departamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dep),
      });

      if (response.ok) {
        await loadDepartamentos();
        setIsDepFormVisible(false);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Error del servidor');
      }
    } catch (error) {
      console.error('Error guardando departamento:', error);
      alert(`Error al guardar departamento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Manejo de eliminación
  const handleDeleteEmployee = async () => {
    if (!deletingEmployee?.empleadoId) return;

    try {
      const response = await fetch(`http://localhost:8080/api/empleados/${deletingEmployee.empleadoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadEmployees();
        setDeletingEmployee(null);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Error del servidor');
      }
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      alert(`Error al eliminar empleado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Filtrado de empleados
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.persona.nombres} ${emp.persona.apellidoPaterno} ${emp.persona.apellidoMaterno}`.toLowerCase();
    
    const matchesText = !filters.texto || fullName.includes(filters.texto.toLowerCase());
    const matchesDni = !filters.dni || emp.persona.numeroDocumento.includes(filters.dni);
    const matchesEstado = !filters.estado || emp.estado === filters.estado;

    return matchesText && matchesDni && matchesEstado;
  });

  // Estadísticas
  const stats = {
    total: employees.length,
    activos: employees.filter(emp => emp.estado === 'ACTIVO').length,
    inactivos: employees.filter(emp => emp.estado === 'INACTIVO').length,
    filtered: filteredEmployees.length
  };

  // Loading state mejorado
  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          
          {/* Filters skeleton */}
          <div className="animate-pulse h-12 bg-gray-200 rounded-lg"></div>
          
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
            <p className="text-gray-600 mt-1">Administra y organiza la información de tus colaboradores</p>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="flex gap-4 text-sm">
            <div className="bg-white px-3 py-2 rounded-lg border shadow-sm">
              <div className="text-gray-600">Total</div>
              <div className="font-semibold text-lg">{stats.total}</div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border shadow-sm">
              <div className="text-gray-600">Activos</div>
              <div className="font-semibold text-lg text-green-600">{stats.activos}</div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border shadow-sm">
              <div className="text-gray-600">Filtrados</div>
              <div className="font-semibold text-lg text-blue-600">{stats.filtered}</div>
            </div>
          </div>
        </div>

        {/* Panel de filtros y acciones */}
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            
            {/* Barra de búsqueda */}
            <div className="flex-1">
              <SearchBar 
                filters={filters} 
                onChange={handleFilterChange} 
              />
            </div>

            {/* Controles de filtro */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!filters.texto && !filters.dni && !filters.estado}
                >
                  Limpiar
                </button>
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => openForm()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:block">Nuevo Empleado</span>
                </button>

                <button
                  onClick={openDepartmentForm}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="hidden sm:block">Nuevo Departamento</span>
                </button>
              </div>
            </div>
          </div>

          {/* Información de resultados */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-600">
            <div>
              Mostrando <span className="font-semibold text-gray-900">{stats.filtered}</span> de{" "}
              <span className="font-semibold text-gray-900">{stats.total}</span> empleados
            </div>
            
            {stats.filtered !== stats.total && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Mostrar todos
              </button>
            )}
          </div>
        </div>

        {/* Estado de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-800 font-medium">Error al cargar datos</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de empleados */}
        {filteredEmployees.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {employees.length === 0 ? 'No hay empleados registrados' : 'No se encontraron resultados'}
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {employees.length === 0 
                ? 'Comienza registrando el primer empleado en tu sistema.'
                : 'Intenta ajustar los filtros de búsqueda para ver más resultados.'
              }
            </p>
            {employees.length === 0 && (
              <button
                onClick={() => openForm()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Registrar Primer Empleado
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <EmployeeCard
                key={emp.empleadoId}
                data={emp}
                onEdit={() => openForm(emp)}
                onDelete={() => setDeletingEmployee(emp)}
              />
            ))}
          </div>
        )}

        {/* Modal de Empleado */}
        {isFormVisible && formEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <EmployeeForm
                state={formEmployee}
                departamentos={departamentos}
                onCancel={() => setIsFormVisible(false)}
                onSave={handleSaveEmployee}
                setField={(field, value) => {
                  if (field.startsWith("persona.")) {
                    const key = field.replace("persona.", "");
                    setFormEmployee((prev) => ({
                      ...prev!,
                      persona: { ...prev!.persona, [key]: value },
                    }));
                  } else {
                    setFormEmployee((prev) => ({ ...prev!, [field]: value }));
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Modal de Departamento */}
        {isDepFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <DepartmentForm
                state={{
                  id: undefined,
                  nombre: "",
                  descripcion: "",
                }}
                setField={(f, v) => {}}
                onCancel={() => setIsDepFormVisible(false)}
                onSave={handleSaveDepartment}
              />
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        <DeleteModal
          visible={!!deletingEmployee}
          message={`¿Estás seguro de que deseas eliminar a ${deletingEmployee?.persona.nombres} ${deletingEmployee?.persona.apellidoPaterno}?`}
          subMessage="Esta acción no se puede deshacer."
          onCancel={() => setDeletingEmployee(null)}
          onConfirm={handleDeleteEmployee}
        />
      </div>
    </div>
  );
}