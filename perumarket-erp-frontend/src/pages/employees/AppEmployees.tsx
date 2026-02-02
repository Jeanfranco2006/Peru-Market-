import { useEmployeeManagement } from "../../hooks/useEmployeeManagement";
import { useModalManagement } from "../../hooks/useModalManagement";
import { useThemeClasses } from "../../hooks/useThemeClasses";
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
import { useState } from "react";

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
    formDepartment,
    closeDeleteModal,
    openForm,
    closeForm,
    openDepartmentForm,
    closeDepartmentForm,
    setDeletingEmployee,
    setFormEmployeeField,
    setFormDepartmentField,
  } = useModalManagement();

  const theme = useThemeClasses();

  // --- Logica de Guardado ---
  const handleSaveEmployeeAndClose = async (emp: Employee): Promise<void> => {
    const success = await handleSaveEmployee(emp);
    if (success) {
      closeForm();
    }
  };

  const handleSaveDepartmentAndClose = async (dep: Departament): Promise<void> => {
    const success = await handleSaveDepartment(dep);
    if (success) {
      closeDepartmentForm();
    }
  };

  const handleDeleteEmployeeAndClose = async (): Promise<void> => {
    if (!deletingEmployee?.empleadoId) return;
    const success = await handleDeleteEmployee(deletingEmployee.empleadoId);
    if (success) {
      setDeletingEmployee(null);
    }
  };

  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deletingEmployee?.empleadoId) return;

    setDeleting(true);
    try {
      const success = await handleDeleteEmployee(deletingEmployee.empleadoId);
      if (success) {
        setDeletingEmployee(null);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setDeleting(false);
    }
  };

  // --- Skeleton Loading ---
  if (loading && stats.total === 0) {
    return (
      <div className={`min-h-screen ${theme.pageBg} p-6 sm:p-10 animate-pulse`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className={`h-12 ${theme.isDark ? 'bg-gray-700' : 'bg-slate-200'} rounded w-1/3 mb-8`}></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-28 ${theme.isDark ? 'bg-gray-700' : 'bg-slate-200'} rounded-xl`}></div>
            ))}
          </div>
          <div className={`h-16 ${theme.isDark ? 'bg-gray-700' : 'bg-slate-200'} rounded-xl`}></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-72 ${theme.isDark ? 'bg-gray-700' : 'bg-slate-200'} rounded-xl`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Render Principal ---
  return (
    <div className={`min-h-screen ${theme.pageBg} ${theme.heading} font-sans pb-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Encabezado */}
        <div className={`flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b ${theme.border}`}>
          <div>
            <h1 className={`text-3xl font-extrabold tracking-tight ${theme.heading} flex items-center gap-3`}>
              <span className={`p-2 rounded-lg text-white shadow-md ${theme.gradientPrimary}`}>
                <LuLayoutList className="w-6 h-6" />
              </span>
              Directorio de Empleados
            </h1>
            <p className={`${theme.textTertiary} mt-3 text-sm max-w-2xl leading-relaxed`}>
              Administre su capital humano, organice departamentos y supervise el estado de la plantilla desde un panel centralizado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <ActionButton
              onClick={() => openDepartmentForm()}
              icon={<HiOutlineOfficeBuilding className={`w-5 h-5 mr-2 ${theme.textTertiary}`} />}
              label="Nuevo Departamento"
              variant="secondary"
              theme={theme}
            />
            <ActionButton
              onClick={() => openForm()}
              icon={<HiOutlineUserAdd className="w-5 h-5 mr-2" />}
              label="Nuevo Empleado"
              variant="primary"
              theme={theme}
            />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Empleados"
            value={stats.total}
            icon="users"
            theme={theme}
          />
          <StatCard
            title="Activos"
            value={stats.activos}
            color="emerald"
            icon="check"
            theme={theme}
          />
          <StatCard
            title="Filtrados"
            value={stats.filtered}
            color="indigo"
            icon="filter"
            theme={theme}
          />
        </div>

        {/* Filtros */}
        <div className={`${theme.card} rounded-xl shadow-sm border p-1`}>
          <div className="p-5">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
              <div className="flex-1 w-full">
                <EmployeeSearchBar
                  filters={filters}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="flex flex-col items-end gap-2 min-w-max pt-1">
                <div className={`text-sm ${theme.textTertiary} font-medium`}>
                  Resultados: <span className="font-bold" style={{ color: 'var(--color-primary-500)' }}>{stats.filtered}</span>
                </div>
                <button
                  onClick={clearFilters}
                  disabled={!filters.texto && !filters.dni && !filters.estado}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                    !filters.texto && !filters.dni && !filters.estado
                      ? theme.isDark ? 'text-gray-600 bg-gray-800 cursor-not-allowed' : 'text-slate-300 bg-slate-50 cursor-not-allowed'
                      : theme.isDark ? 'text-[var(--color-primary-400)] bg-gray-700 hover:bg-gray-600 cursor-pointer' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer'
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
          <div className={`rounded-lg p-4 border flex items-start gap-3 animate-fade-in ${
            theme.isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'
          }`}>
            <FiAlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className={`text-sm font-semibold ${theme.isDark ? 'text-red-400' : 'text-red-800'}`}>Error</h3>
              <p className={`mt-1 text-sm ${theme.isDark ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
            </div>
          </div>
        )}

        {/* Grid de Resultados */}
        {filteredEmployees.length === 0 ? (
          <EmptyState
            isInitial={stats.total === 0}
            onAction={() => openForm()}
            onClear={clearFilters}
            theme={theme}
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

        {/* --- MODALES --- */}

        {/* Modal Empleado */}
        {isFormVisible && formEmployee && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
              <div
                className={`fixed inset-0 ${theme.isDark ? 'bg-black/60' : 'bg-slate-900/40'} backdrop-blur-sm transition-opacity`}
                onClick={closeForm}
              ></div>

              <div className={`relative transform overflow-hidden rounded-2xl ${theme.modalContent} border text-left shadow-2xl transition-all sm:w-full sm:max-w-4xl max-h-[90vh] flex flex-col`}>
                <button
                  onClick={closeForm}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors sm:hidden ${
                    theme.isDark ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-400 hover:text-gray-200' : 'bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                  }`}
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

        {/* Modal Departamento */}
        {isDepFormVisible && formDepartment && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div
                className={`fixed inset-0 ${theme.isDark ? 'bg-black/60' : 'bg-slate-900/40'} backdrop-blur-sm`}
                onClick={closeDepartmentForm}
              ></div>

              <div className={`relative w-full max-w-lg transform overflow-hidden rounded-2xl ${theme.modalContent} border p-0 text-left shadow-xl transition-all`}>
                <button
                  onClick={closeDepartmentForm}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors sm:hidden ${
                    theme.isDark ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-400 hover:text-gray-200' : 'bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <LuX className="w-5 h-5" />
                </button>

                <DepartmentForm
                  state={formDepartment}
                  setField={setFormDepartmentField}
                  onCancel={closeDepartmentForm}
                  onSave={handleSaveDepartmentAndClose}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Eliminacion */}
        {deletingEmployee && (
          <DeleteModal
      visible={!!deletingEmployee}
      message="Dar de baja empleado"
      subMessage={`¿Está seguro que desea eliminar permanentemente a ${deletingEmployee.persona.nombres} ${deletingEmployee.persona.apellidoPaterno}? Esta acción no se puede deshacer.`}
      onCancel={() => setDeletingEmployee(null)}
      onConfirm={handleConfirmDelete}
      loading={deleting}
    />
        )}
      </div>
    </div>
  );
}

// --- Componentes UI Auxiliares ---

const ActionButton = ({ onClick, icon, label, variant, theme }: any) => {
  const baseClass = "inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

  const primaryClass = `${theme.btnPrimary} text-white shadow-sm`;
  const secondaryClass = theme.btnSecondary;

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${variant === 'primary' ? primaryClass : secondaryClass}`}
    >
      {icon} {label}
    </button>
  );
};

const StatCard = ({ title, value, color = "slate", icon, theme }: any) => {
  const lightColors: any = {
    slate: { bg: "bg-slate-100", text: "text-slate-600", val: "text-slate-900" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", val: "text-emerald-700" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", val: "text-indigo-700" },
  };
  const darkColors: any = {
    slate: { bg: "bg-gray-700", text: "text-gray-400", val: "text-gray-100" },
    emerald: { bg: "bg-emerald-900/30", text: "text-emerald-400", val: "text-emerald-300" },
    indigo: { bg: "bg-indigo-900/30", text: "text-indigo-400", val: "text-indigo-300" },
  };

  const Icon = icon === 'users' ? LuUsers : icon === 'check' ? LuCheck : LuFilter;
  const palette = theme.isDark ? darkColors[color] || darkColors.slate : lightColors[color] || lightColors.slate;

  return (
    <div className={`${theme.card} rounded-xl p-5 border shadow-sm flex items-center gap-4 transition-colors`}>
      <div className={`p-3 rounded-lg ${palette.bg} ${palette.text}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className={`text-sm font-medium ${theme.textTertiary}`}>{title}</p>
        <p className={`text-2xl font-bold ${palette.val}`}>{value}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ isInitial, onAction, onClear, theme }: any) => (
  <div className={`text-center py-24 ${theme.card} rounded-2xl border border-dashed`}>
    <div className={`mx-auto h-16 w-16 ${theme.subtleBg} rounded-full flex items-center justify-center mb-4`}>
      {isInitial ? <LuPlus className={`h-8 w-8 ${theme.emptyState}`} /> : <LuFilter className={`h-8 w-8 ${theme.emptyState}`} />}
    </div>
    <h3 className={`mt-2 text-lg font-semibold ${theme.heading}`}>
      {isInitial ? 'Base de datos vacia' : 'Sin coincidencias'}
    </h3>
    <p className={`mt-1 text-sm ${theme.textTertiary} max-w-sm mx-auto mb-6`}>
      {isInitial ? 'Comience agregando su primer colaborador al sistema.' : 'No se encontraron empleados con los filtros actuales.'}
    </p>
    {isInitial ? (
      <ActionButton
        onClick={onAction}
        icon={<LuPlus className="w-5 h-5 mr-2" />}
        label="Registrar Empleado"
        variant="primary"
        theme={theme}
      />
    ) : (
      <button
        onClick={onClear}
        className="font-medium hover:opacity-80 text-sm"
        style={{ color: 'var(--color-primary-500)' }}
      >
        Limpiar filtros
      </button>
    )}
  </div>
);
