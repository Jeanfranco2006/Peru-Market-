import { Link } from 'react-router-dom';
import {
    IoMdArrowRoundBack,
    IoMdAdd,
    IoIosPin,
    IoIosPeople,
    IoIosCube,
    IoIosStats,
    IoMdCreate,
    IoIosSave,
    IoIosWarning,
    IoIosCheckmarkCircle
} from 'react-icons/io';

import { useWarehouseList } from '../../hooks/inventario/useWarehouseList';
import { useWarehouseEdit } from '../../hooks/inventario/useWarehouseEdit';

export default function InventoryAlmacenes() {
    // 1. Hook de Lista y Datos
    const {
        warehouses,
        setWarehouses,
        loading,
        error,
        totalProductTypes,
        activeWarehouses,
        totalProductUnits,
        searchTerm,
        setSearchTerm,
        filteredWarehouses
    } = useWarehouseList();

    // 2. Hook de Edición (necesita acceso a warehouses y setWarehouses para actualizar la lista)
    const {
        showEditModal,
        selectedWarehouse,
        notification,
        handleOpenEditModal,
        handleCloseEditModal,
        handleFormChange,
        handleUpdateWarehouse
    } = useWarehouseEdit(warehouses, setWarehouses);

    if (loading) return <div className="p-6 text-center text-gray-500">Cargando almacenes...</div>;
    if (error) return <div className="p-6 text-center text-red-600 border border-red-300 bg-red-50 rounded-lg">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/inventario" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <IoMdArrowRoundBack className="w-5 h-5 text-gray-700" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Almacenes</h1>
                        <p className="text-gray-600">Administre las ubicaciones de almacenamiento</p>
                    </div>
                </div>
                <Link to="/inventario/almacenes/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98]">
                    <IoMdAdd className="w-5 h-5" />
                    Nuevo Almacén
                </Link>
            </div>

            {/* Notificación */}
            {notification && (
                <div className={`fixed top-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.type === 'success' ? <IoIosCheckmarkCircle className="w-6 h-6" /> : <IoIosWarning className="w-6 h-6" />}
                    <span>{notification.message}</span>
                </div>
            )}
            
            {/* Tarjetas de Resumen Dinámicas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{warehouses.length}</div>
                    <div className="text-gray-600 flex items-center gap-2">
                        <IoIosPin className="w-4 h-4" />
                        Total Almacenes
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{totalProductTypes}</div>
                    <div className="text-gray-600 flex items-center gap-2">
                        <IoIosCube className="w-4 h-4" />
                        Tipos de Productos
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{activeWarehouses}</div>
                    <div className="text-gray-600 flex items-center gap-2">
                        <IoIosPeople className="w-4 h-4" />
                        Almacenes Activos
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{totalProductUnits.toFixed(0)}</div>
                    <div className="text-gray-600 flex items-center gap-2">
                        <IoIosStats className="w-4 h-4" />
                        Stock Total
                    </div>
                </div>
            </div>
            
            {/* Barra de Búsqueda */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 col-span-1 md:col-span-4 mb-6">
                <input
                    placeholder="Buscar Almacén por nombre o código..."
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Lista de Almacenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWarehouses.map((warehouse) => {
                    const capacityPercentage = warehouse.capacityTotalUnits > 0 
                        ? Math.round((warehouse.capacityUsed / warehouse.capacityTotalUnits) * 100) 
                        : 0;
                    const progressBarColor = capacityPercentage > 80 ? 'bg-red-500' : capacityPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500';
                    
                    const capacityUsedM3 = warehouse.capacityTotalUnits > 0
                        ? (warehouse.capacityUsed / warehouse.capacityTotalUnits) * warehouse.capacidadM3
                        : 0;

                    return (
                        <div key={warehouse.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{warehouse.nombre}</h3>
                                    <p className="text-sm text-gray-600">Código: {warehouse.codigo}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${warehouse.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {warehouse.estado}
                                </span>
                            </div>
                            <div className="p-4">
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <IoIosPin className="w-4 h-4" />
                                        {warehouse.direccion}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <IoIosPeople className="w-4 h-4" />
                                        Responsable: {warehouse.responsable}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <IoIosCube className="w-4 h-4" />
                                        Productos: {warehouse.productsCount}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Capacidad Ocupada</span>
                                        <span>{capacityPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`h-2 rounded-full ${progressBarColor}`} style={{ width: `${capacityPercentage}%` }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Espacio Ocupado: {capacityUsedM3.toFixed(2)} / {warehouse.capacidadM3} m³</div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/inventario/stock/${warehouse.id}`}
                                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                                    >
                                        <IoIosStats className="w-4 h-4" />
                                        Ver Stock
                                    </Link>
                                    <button
                                        onClick={() => handleOpenEditModal(warehouse)}
                                        className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-gray-700 active:bg-gray-800 transition-all duration-200 transform active:scale-[0.98] text-sm"
                                    >
                                        <IoMdCreate className="w-4 h-4" />
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de Edición */}
            {showEditModal && selectedWarehouse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Editar Almacén</h3>
                            <button onClick={handleCloseEditModal} className="text-gray-500 hover:text-gray-800">✕</button>
                        </div>
                        <form onSubmit={handleUpdateWarehouse}>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={selectedWarehouse.nombre}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                                        <input
                                            type="text"
                                            name="codigo"
                                            value={selectedWarehouse.codigo}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={selectedWarehouse.direccion}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                        <input
                                            type="text"
                                            name="responsable"
                                            value={selectedWarehouse.responsable}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1"> Capacidad Total (m³)</label>
                                        <input
                                            type="number"
                                            name="capacidadM3"
                                            value={selectedWarehouse.capacidadM3}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <select
                                        name="estado"
                                        value={selectedWarehouse.estado}
                                        onChange={handleFormChange}
                                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${selectedWarehouse.estado === 'ACTIVO' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                                    >
                                        <option value="ACTIVO">Activo</option>
                                        <option value="INACTIVO">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                                <button type="button" onClick={handleCloseEditModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                    <IoIosSave className="w-5 h-5" />
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}