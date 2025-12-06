import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '../../types/inventario/inventory';
import { inventoryService } from '../../services/inventario/inventory';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal de Código de Barras
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  // --- Carga de Datos ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Lógica de Negocio (Borrado) ---
  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`PELIGRO: ¿Estás seguro de eliminar "${nombre}" DE FORMA PERMANENTE?\n\nSe borrará:\n- El producto\n- Su stock actual\n- Todo su historial de movimientos`)) {
        return;
    }

    try {
        await inventoryService.deleteProduct(id);
        // Actualización optimista de la UI
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Producto eliminado completamente del sistema.');
    } catch (err: any) {
        console.error('Error:', err);
        alert(`Error: ${err.message}`);
    }
  };

  // --- Lógica de Filtrado y Estadísticas ---
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.categoriaNombre)));
    return ['all', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigoBarrasPrincipal?.includes(searchTerm);

      const matchesCategory = filterCategory === 'all' || product.categoriaNombre === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, filterCategory, products]);

  // Stats
  const stats = useMemo(() => ({
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.stockActual * p.precioVenta, 0),
    lowStockCount: products.filter(p => p.stockActual > 0 && p.stockActual <= p.stockMinimo).length,
    outOfStockCount: products.filter(p => p.stockActual <= 0).length
  }), [products]);

  // --- Manejo del Modal ---
  const openBarcodeModal = (product: Product) => {
    setSelectedProduct(product);
    setShowBarcodeModal(true);
  };

  const closeBarcodeModal = () => {
    setShowBarcodeModal(false);
    setSelectedProduct(null);
  };

  return {
    products,
    loading,
    error,
    filteredProducts,
    stats,
    categories,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    handleDelete,
    // Modal controls
    showBarcodeModal,
    selectedProduct,
    openBarcodeModal,
    closeBarcodeModal
  };
};