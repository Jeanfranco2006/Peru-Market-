import { Link } from 'react-router-dom';
import {
  IoMdArrowRoundBack,
  IoIosPin,
  IoIosCube,
  IoIosStats,
  IoIosSearch
} from 'react-icons/io'; 

import { useStockByWarehouse } from '../../hooks/inventario/useStockByWarehouse';
import type { StockStatusResult } from '../../types/inventario/stock';

// Función auxiliar de UI (Pura)
const getStatusClasses = (stock: number, minStock: number): StockStatusResult => {
  if (stock === 0) return { text: 'Sin Stock', color: 'bg-red-100 text-red-800' };
  if (stock <= minStock) return { text: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800' };
  return { text: 'Disponible', color: 'bg-green-100 text-green-800' };
};

export default function InventoryStockPorAlmacen() {
  const {
    allWarehouses,
    selectedWarehouse,
    filteredProducts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleWarehouseChange,
    stats
  } = useStockByWarehouse();

  if (loading) return <div className="p-6 text-center text-gray-500">Cargando datos del inventario...</div>;
  if (error) return <div className="p-6 text-center text-red-600 border border-red-300 bg-red-50 rounded-lg">Error: {error}</div>;
  if (!selectedWarehouse) return <div className="p-6 text-center text-gray-500">No se encontró el almacén seleccionado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/inventario/almacenes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors transform active:scale-[0.95]">
            <IoMdArrowRoundBack className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock por Almacén</h1>
            <p className="text-gray-600">
              Visualización detallada de inventario 
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{filteredProducts.length}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosCube className="w-5 h-5 text-purple-500" />
            <span>Productos Almacenados</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.totalStock}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosStats className="w-5 h-5 text-indigo-600" />
            <span>Unidades Totales</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">S/{stats.totalValue.toFixed(2)}</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosStats className="w-5 h-5 text-blue-600" />
            <span>Valor Total de Stock</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Ubicación principal</div>
          <div className="flex items-center gap-2 mt-1">
            <IoIosPin className="w-5 h-5 text-red-500" />
            <p className="text-xs text-gray-500 mt-1">{selectedWarehouse?.direccion || 'Sin dirección registrada'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex items-center gap-3">
            <label className="block text-sm font-medium text-gray-700">Filtrar por Almacén:</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedWarehouse?.id}
              onChange={handleWarehouseChange}
            >
              {allWarehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.nombre} ({w.codigo})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 max-w-sm relative">
            <IoIosSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              placeholder="Buscar Producto, SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const status = getStatusClasses(product.stockActual, product.stockMinimo);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.nombre}
                      <div className="text-xs text-gray-500">{product.categoria}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                      {product.stockActual} {product.unidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{product.stockMinimo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-lg">
                  No se encontraron productos en el almacén "{selectedWarehouse?.nombre || 'N/A'}" con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}