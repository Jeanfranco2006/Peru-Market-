import { useEmployeeManagement } from "../../hooks/useEmployeeManagement";
import { useModalManagement } from "../../hooks/useModalManagement";
import type { Departament, Employee } from "../../types/Employee";

// Iconos
import { LuUsers, LuFilter, LuPlus, LuLayoutList, LuCheck, LuX } from "react-icons/lu";
import { HiOutlineOfficeBuilding, HiOutlineUserAdd } from "react-icons/hi";
import { FiAlertCircle } from "react-icons/fi";

// Componentes
import EmployeeSearchBar from "./EmployeeSearchBar";
import EmployeeCard from "./EmployeeCards";
import EmployeeForm from "./EmployeeForm";
import DeleteModal from "./EmployeeDeleteModal";
import DepartmentForm from "./DepartmentForm";

export default function AppEmployees() {
  const {
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
  } = useEmployeeManagement();

  const {
    isFormVisible,
    isDepFormVisible,
    deletingEmployee,
    formEmployee,
    openForm,
    closeForm,
    openDepartmentForm,
    closeDepartmentForm,
    setDeletingEmployee,
    setFormEmployeeField,
  } = useModalManagement();

  // --- Lógica de Guardado ---
  const handleSaveEmployeeAndClose = async (emp: Employee): Promise<void> => {
    const success = await handleSaveEmployee(emp);
    if (success) closeForm();
  };

  const handleSaveDepartmentAndClose = async (dep: Departament): Promise<void> => {
    const success = await handleSaveDepartment(dep);
    if (success) closeDepartmentForm();
  };

  const handleDeleteEmployeeAndClose = async (): Promise<void> => {
    if (!deletingEmployee?.empleadoId) return;
    const success = await handleDeleteEmployee(deletingEmployee.empleadoId);
    if (success) setDeletingEmployee(null);
  };

  const handleConfirmDelete = (): void => {
    handleDeleteEmployeeAndClose();
  };

  // --- Skeleton Loading ---
  if (loading && stats.total === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 sm:p-10 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-12 bg-slate-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>)}
          </div>
          <div className="h-16 bg-slate-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-slate-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  // --- Render Principal ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <span className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-200">
                <LuLayoutList className="w-6 h-6" />
              </span>
              Directorio de Empleados
            </h1>
            <p className="text-slate-500 mt-3 text-sm max-w-2xl leading-relaxed">
              Administre su capital humano, organice departamentos y supervise el estado de la plantilla desde un panel centralizado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <ActionButton 
              onClick={openDepartmentForm} 
              icon={<HiOutlineOfficeBuilding className="w-5 h-5 mr-2 text-slate-500" />}
              label="Nuevo Departamento"
              variant="secondary"
            />
            <ActionButton 
              onClick={() => openForm()} 
              icon={<HiOutlineUserAdd className="w-5 h-5 mr-2" />}
              label="Nuevo Empleado"
              variant="primary"
            />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard title="Total Empleados" value={stats.total} icon="users" />
          <StatCard title="Activos" value={stats.activos} color="emerald" icon="check" />
          <StatCard title="Filtrados" value={stats.filtered} color="indigo" icon="filter" />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          <div className="p-5">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
              <div className="flex-1 w-full">
                <EmployeeSearchBar filters={filters} onChange={handleFilterChange} />
              </div>
              <div className="flex flex-col items-end gap-2 min-w-max pt-1">
                <div className="text-sm text-slate-500 font-medium">
                  Resultados: <span className="text-indigo-600 font-bold">{stats.filtered}</span>
                </div>
                <button
                  onClick={clearFilters}
                  disabled={!filters.texto && !filters.dni && !filters.estado}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                    !filters.texto && !filters.dni && !filters.estado
                      ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                      : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer'
                  }`}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Errores */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-100 flex items-start gap-3 animate-fade-in">
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error de conexión</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Grid de Resultados */}
        {filteredEmployees.length === 0 ? (
          <EmptyState
            isInitial={stats.total === 0}
            onAction={() => openForm()}
            onClear={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
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

        {/* --- MODALES OPTIMIZADOS --- */}

        {/* Modal Empleado */}
        {isFormVisible && formEmployee && (
          <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Contenedor Flex para centrado perfecto */}
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
              
              {/* Backdrop con blur */}
              <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={closeForm}
              ></div>

              {/* Panel del Modal */}
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:w-full sm:max-w-4xl max-h-[90vh] flex flex-col">
                 {/* Botón flotante de cerrar para móviles/tablets */}
                 <button 
                  onClick={closeForm}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors sm:hidden"
                 >
                   <LuX className="w-5 h-5" />
                 </button>

                 <EmployeeForm
                   state={formEmployee}
                   departamentos={departamentos}
                   onCancel={closeForm}
                   onSave={handleSaveEmployeeAndClose}
                   setField={setFormEmployeeField}
                 />
              </div>
            </div>
          </div>
        )}

        {/* Modal Departamento (Simplificado visualmente) */}
        {isDepFormVisible && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
             <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeDepartmentForm}></div>
              <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <DepartmentForm
                  state={{ id: undefined, nombre: "", descripcion: "" }}
                  setField={() => {}}
                  onCancel={closeDepartmentForm}
                  onSave={handleSaveDepartmentAndClose}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Eliminación */}
        <DeleteModal
          visible={!!deletingEmployee}
          message="Dar de baja empleado"
          subMessage={`¿Está seguro que desea eliminar a ${deletingEmployee?.persona.nombres}? Esta acción no se puede deshacer.`}
          onCancel={() => setDeletingEmployee(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}

// --- Componentes UI Auxiliares ---

const ActionButton = ({ onClick, icon, label, variant }: any) => {
  const baseClass = "inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 focus:ring-indigo-500",
    secondary: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500"
  };
  
  return (
    <button onClick={onClick} className={`${baseClass} ${variant === 'primary' ? variants.primary : variants.secondary}`}>
      {icon} {label}
    </button>
  );
};

const StatCard = ({ title, value, color = "slate", icon }: any) => {
  const colors: any = {
    slate: { bg: "bg-slate-100", text: "text-slate-600", val: "text-slate-900" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", val: "text-emerald-700" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", val: "text-indigo-700" },
  };
  
  const Icon = icon === 'users' ? LuUsers : icon === 'check' ? LuCheck : LuFilter;
  const theme = colors[color] || colors.slate;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-100 transition-colors">
      <div className={`p-3 rounded-lg ${theme.bg} ${theme.text}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`text-2xl font-bold ${theme.val}`}>{value}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ isInitial, onAction, onClear }: any) => (
  <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
    <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
      {isInitial ? <LuPlus className="h-8 w-8 text-slate-400" /> : <LuFilter className="h-8 w-8 text-slate-400" />}
    </div>
    <h3 className="mt-2 text-lg font-semibold text-slate-900">{isInitial ? 'Base de datos vacía' : 'Sin coincidencias'}</h3>
    <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto mb-6">
      {isInitial ? 'Comience agregando su primer colaborador al sistema.' : 'No se encontraron empleados con los filtros actuales.'}
    </p>
    {isInitial ? (
      <ActionButton onClick={onAction} icon={<LuPlus className="w-5 h-5 mr-2" />} label="Registrar Empleado" variant="primary" />
    ) : (
      <button onClick={onClear} className="text-indigo-600 font-medium hover:text-indigo-800 text-sm">Limpiar filtros</button>
    )}
  </div>
);