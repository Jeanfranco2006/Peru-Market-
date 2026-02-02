import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    IoIosCube, IoIosStats, IoIosPulse, IoIosSearch, IoIosAdd,
    IoMdHome, IoMdCheckmarkCircle,
    IoIosPin, IoIosBuild, IoIosPeople, IoMdRefresh, IoMdTrash, IoMdBarcode,
    IoIosBarcode, IoIosImage, IoMdWarning, IoMdClose,
    IoMdAlert
} from 'react-icons/io';

import { useInventory } from '../../hooks/inventario/useInventory';
import { useThemeClasses } from '../../hooks/useThemeClasses';

// --- HELPERS ---

const getStockStatusConfig = (stock: number, minStock: number, isDark: boolean) => {
    if (stock <= 0) return {
        label: 'Sin Stock',
        color: isDark ? 'bg-red-900/40 text-red-400 border-red-700/50' : 'bg-red-50 text-red-600 border-red-200',
        dotColor: 'bg-red-500',
        barColor: 'bg-red-500',
        icon: <IoMdWarning className="w-3 h-3" />
    };
    if (stock <= minStock) return {
        label: 'Stock Bajo',
        color: isDark ? 'bg-amber-900/40 text-amber-400 border-amber-700/50' : 'bg-amber-50 text-amber-600 border-amber-200',
        dotColor: 'bg-amber-500',
        barColor: 'bg-amber-500',
        icon: <IoIosPulse className="w-3 h-3" />
    };
    return {
        label: 'Disponible',
        color: isDark ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/50' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
        dotColor: 'bg-emerald-500',
        barColor: 'bg-emerald-500',
        icon: <IoMdCheckmarkCircle className="w-3 h-3" />
    };
};

// --- Barcode Display ---
const BarcodeDisplay = ({ barcode, sku, name, isDark }: { barcode: string, sku: string, name: string, isDark: boolean }) => {
    const [barcodeImageUrl, setBarcodeImageUrl] = useState<string>('');

    useEffect(() => {
        if (barcode && barcode.length >= 12) {
            setBarcodeImageUrl(`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(barcode)}&code=EAN13&translate-esc=on&dpi=96`);
        } else {
            setBarcodeImageUrl('');
        }
    }, [barcode]);

    const printBarcode = () => {
        if (barcodeImageUrl) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`<html><head><title>Imprimir Código - ${name}</title><style>body{margin:0;padding:20px;font-family:sans-serif;text-align:center;}.barcode-container{margin:20px auto;max-width:400px;padding:20px;}</style></head><body><div class="barcode-container"><img src="${barcodeImageUrl}" style="max-width:100%;" /><div style="margin-top:10px;"><strong>${name}</strong><br/>SKU: ${sku}</div></div><script>window.print();</script></body></html>`);
                printWindow.document.close();
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 border rounded-xl w-full flex justify-center min-h-[100px] items-center ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                {barcodeImageUrl ? (
                    <img src={barcodeImageUrl} alt="Barcode" className={`max-w-full h-auto ${isDark ? '' : 'mix-blend-multiply'}`} />
                ) : (
                    <div className="flex gap-1 opacity-20">{Array.from({ length: 13 }).map((_, i) => <div key={i} className={`h-12 w-1 ${i % 2 === 0 ? (isDark ? 'bg-white' : 'bg-black') : 'bg-transparent'} border-l ${isDark ? 'border-white' : 'border-black'}`} />)}</div>
                )}
            </div>
            <div className="text-center">
                <p className={`font-mono text-lg tracking-widest font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{barcode}</p>
                <p className={`text-xs uppercase tracking-wide mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>SKU: {sku}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full pt-2">
                <button className={`flex items-center justify-center py-2.5 px-4 rounded-xl border font-medium text-sm transition-all ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`} onClick={() => { navigator.clipboard.writeText(barcode); }}>
                    Copiar
                </button>
                <button className={`flex items-center justify-center py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${isDark ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-900 text-white hover:bg-gray-800'}`} onClick={printBarcode}>
                    Imprimir
                </button>
            </div>
        </div>
    );
};

// --- Barcode Modal ---
const BarcodeModal = ({ product, onClose, onBarcodeGenerated, isDark, heading, colors }: {
    product: any; onClose: () => void; onBarcodeGenerated: (p: any) => void;
    isDark: boolean; heading: string; colors: any;
}) => {
    const [generating, setGenerating] = useState(false);
    const hasBarcode = product.codigoBarrasPrincipal && product.codigoBarrasPrincipal.length >= 12;

    const handleGenerate = async () => {
        setGenerating(true);
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const codigo = timestamp + random;
        try {
            const { api } = await import('../../services/api');
            const res = await api.patch(`/productos/${product.id}/barcode`, { codigoBarras: codigo });
            onBarcodeGenerated(res.data);
        } catch (err) {
            console.error('Error generando código:', err);
            alert('Error al generar el código de barras');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className={`rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Código de Producto</h3>
                    <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <IoMdClose className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <h4 className={`text-center font-bold mb-1 ${heading}`}>{product.nombre}</h4>
                    <p className={`text-center text-xs mb-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>SKU: {product.sku}</p>
                    {hasBarcode ? (
                        <BarcodeDisplay barcode={product.codigoBarrasPrincipal} sku={product.sku} name={product.nombre} isDark={isDark} />
                    ) : (
                        <div className="text-center py-8">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <IoMdBarcode className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sin código de barras</p>
                            <p className={`text-xs mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Genera un código EAN-13 para este producto</p>
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="inline-flex items-center px-6 py-2.5 rounded-xl text-white font-medium text-sm transition-all shadow-md disabled:opacity-50"
                                style={{ backgroundColor: colors[600] }}
                            >
                                <IoMdBarcode className="w-4 h-4 mr-2" />
                                {generating ? 'Generando...' : 'Generar Código de Barras'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Product Image ---
const ProductImage = ({ imagen, nombre, className = "", isDark }: { imagen: string, nombre: string, className?: string, isDark: boolean }) => {
    const [imageError, setImageError] = useState(false);

    if (!imagen || imageError) {
        return (
            <div className={`flex flex-col items-center justify-center ${isDark ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-100 text-gray-400'} ${className}`}>
                <IoIosImage className="w-8 h-8 mb-1 opacity-40" />
                <span className="text-[9px] uppercase font-bold tracking-wider opacity-50">Sin imagen</span>
            </div>
        );
    }

    const getImageUrl = (imagePath: string) => {
        if (imagePath.startsWith('data:')) return imagePath;
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/api/')) return `http://localhost:8080${imagePath}`;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `http://localhost:8080/api${cleanPath}`;
    };

    return (
        <img
            src={getImageUrl(imagen)}
            alt={nombre}
            className={`transition-transform duration-500 group-hover:scale-110 ${className}`}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
        />
    );
};

// === COMPONENTE PRINCIPAL ===
export default function Inventory() {
    const {
        loading, error, filteredProducts, stats, categories,
        searchTerm, setSearchTerm, filterCategory, setFilterCategory,
        initiateDelete, confirmDelete, cancelDelete, productToDelete, isDeleting,
        showBarcodeModal, selectedProduct, openBarcodeModal, closeBarcodeModal
    } = useInventory();

    const { isDark, colors, pageBg, heading, textTertiary } = useThemeClasses();

    if (loading) return (
        <div className={`min-h-screen ${pageBg} pb-20`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* Skeleton header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className={`h-8 w-48 rounded-lg animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        <div className={`h-4 w-72 rounded mt-2 animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    </div>
                    <div className="flex gap-2">
                        <div className={`h-10 w-28 rounded-xl animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        <div className={`h-10 w-36 rounded-xl animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    </div>
                </div>
                {/* Skeleton KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className={`h-3 w-20 rounded animate-pulse mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                    <div className={`h-7 w-16 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                </div>
                                <div className={`w-10 h-10 rounded-xl animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Skeleton search bar */}
                <div className={`rounded-2xl border p-2 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`h-10 w-full rounded-xl animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                </div>
                {/* Skeleton product cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className={`h-44 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                            <div className="p-4 space-y-3">
                                <div className={`h-4 w-3/4 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                <div className={`h-3 w-1/2 rounded animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                                <div className={`h-6 w-24 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                <div className={`h-2 w-full rounded-full animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                                <div className="flex gap-2 pt-2">
                                    <div className={`h-8 flex-1 rounded-xl animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                    <div className={`h-8 flex-1 rounded-xl animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className={`p-8 max-w-2xl mx-auto mt-10 ${pageBg}`}>
            <div className={`border rounded-2xl p-6 flex items-start gap-4 ${isDark ? 'bg-red-900/20 border-red-800/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                <IoMdWarning className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold">Error de conexión</h3>
                    <p className="text-sm mt-1 opacity-90">{error}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen pb-20 ${pageBg}`}>

            {/* DELETE MODAL */}
            {productToDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!isDeleting ? cancelDelete : undefined} />
                    <div className={`relative rounded-2xl shadow-2xl max-w-md w-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`border-b p-6 flex flex-col items-center text-center ${isDark ? 'bg-red-900/10 border-gray-700' : 'bg-red-50/50 border-red-100'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                <IoMdWarning className={`w-7 h-7 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                            </div>
                            <h3 className={`text-lg font-bold ${heading}`}>¿Eliminar producto?</h3>
                            <p className={`text-sm mt-2 ${textTertiary}`}>
                                Estás a punto de eliminar <span className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>"{productToDelete.nombre}"</span>.
                            </p>
                        </div>
                        <div className="p-5">
                            <div className={`border rounded-xl p-4 flex gap-3 ${isDark ? 'bg-amber-900/10 border-amber-800/40' : 'bg-amber-50 border-amber-100'}`}>
                                <IoMdAlert className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                                <div className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                                    <p className="font-semibold mb-1">Acción irreversible</p>
                                    <ul className="list-disc list-inside space-y-0.5 opacity-90 text-xs">
                                        <li>Se eliminará el producto del inventario</li>
                                        <li>Se perderá el stock actual</li>
                                        <li>Se borrará el historial de movimientos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={`p-5 border-t flex gap-3 ${isDark ? 'bg-gray-900/30 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                            <button onClick={cancelDelete} disabled={isDeleting}
                                className={`flex-1 px-4 py-2.5 border font-medium rounded-xl transition-all disabled:opacity-50 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                                Cancelar
                            </button>
                            <button onClick={confirmDelete} disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                {isDeleting ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Eliminando...</>
                                ) : (
                                    <><IoMdTrash className="w-4 h-4" /> Sí, eliminar</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${heading}`}>Inventario</h1>
                        <p className={`mt-1 text-sm ${textTertiary}`}>Gestiona productos, existencias y movimientos</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/inventario/almacenes" className={`inline-flex items-center px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${isDark ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
                            <IoMdHome className="w-4 h-4 mr-2 opacity-60" />
                            Almacenes
                        </Link>
                        <Link to="/inventario/nuevo"
                            className="inline-flex items-center px-4 py-2.5 rounded-xl font-medium text-sm text-white transition-all shadow-sm"
                            style={{ backgroundColor: colors[600] }}>
                            <IoIosAdd className="w-4 h-4 mr-1.5" />
                            Configurar Precios
                        </Link>
                    </div>
                </div>

                {/* BARCODE MODAL */}
                {showBarcodeModal && selectedProduct && (
                    <BarcodeModal
                        product={selectedProduct}
                        onClose={closeBarcodeModal}
                        onBarcodeGenerated={() => { closeBarcodeModal(); window.location.reload(); }}
                        isDark={isDark} heading={heading} colors={colors}
                    />
                )}

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <KPICard
                        title="Total Productos" value={stats.totalProducts} suffix=""
                        icon={<IoIosCube className="w-5 h-5" />}
                        accent={{ bg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50', text: 'text-indigo-500', border: isDark ? 'border-indigo-500/20' : 'border-indigo-100' }}
                        isDark={isDark}
                    />
                    <KPICard
                        title="Valor Total" value={`S/ ${stats.totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} suffix=""
                        icon={<IoIosStats className="w-5 h-5" />}
                        accent={{ bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', text: 'text-emerald-500', border: isDark ? 'border-emerald-500/20' : 'border-emerald-100' }}
                        isDark={isDark}
                    />
                    <KPICard
                        title="Stock Bajo" value={stats.lowStockCount} suffix=""
                        icon={<IoIosPulse className="w-5 h-5" />}
                        accent={{ bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', text: 'text-amber-500', border: isDark ? 'border-amber-500/20' : 'border-amber-100' }}
                        isDark={isDark}
                    />
                    <KPICard
                        title="Sin Stock" value={stats.outOfStockCount} suffix=""
                        icon={<IoMdWarning className="w-5 h-5" />}
                        accent={{ bg: isDark ? 'bg-red-500/10' : 'bg-red-50', text: 'text-red-500', border: isDark ? 'border-red-500/20' : 'border-red-100' }}
                        isDark={isDark}
                    />
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className={`rounded-2xl border p-2 mb-6 sticky top-4 z-30 backdrop-blur-xl ${isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200 shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 relative">
                            <IoIosSearch className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                                placeholder="Buscar por nombre, SKU o código..."
                                className={`w-full pl-10 pr-4 py-2.5 bg-transparent rounded-xl text-sm focus:outline-none ${isDark ? 'text-gray-200 placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={`hidden sm:block w-px my-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        <select
                            className={`sm:w-56 px-3 py-2.5 bg-transparent rounded-xl text-sm focus:outline-none cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.filter(c => c !== 'all').map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* PRODUCT COUNT */}
                <div className={`flex items-center justify-between mb-4`}>
                    <p className={`text-xs font-medium ${textTertiary}`}>
                        Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                        {(searchTerm || filterCategory !== 'all') && ` (filtrado)`}
                    </p>
                </div>

                {/* PRODUCT GRID */}
                {filteredProducts.length === 0 ? (
                    <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <IoIosCube className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                        <h3 className={`text-lg font-semibold mb-1 ${heading}`}>No se encontraron productos</h3>
                        <p className={`text-sm ${textTertiary}`}>Intenta ajustar los filtros o tu búsqueda</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => {
                            const margin = product.precioCompra > 0 ? ((product.precioVenta - product.precioCompra) / product.precioCompra) * 100 : 0;
                            const statusConfig = getStockStatusConfig(product.stockActual, product.stockMinimo, isDark);
                            const stockPercent = product.stockMaximo > 0 ? Math.min((product.stockActual / product.stockMaximo) * 100, 100) : 0;

                            return (
                                <div key={product.id} className={`group rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-black/20' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50'}`}>

                                    {/* IMAGE */}
                                    <div className={`relative h-44 overflow-hidden ${isDark ? 'bg-gray-700/40' : 'bg-gray-50'}`}>
                                        <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5">
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border backdrop-blur-sm ${isDark ? 'bg-gray-800/90 text-gray-300 border-gray-600' : 'bg-white/90 text-gray-600 border-gray-200'}`}>
                                                {product.categoriaNombre}
                                            </span>
                                        </div>
                                        <div className={`absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${statusConfig.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                                            {statusConfig.label}
                                        </div>

                                        <div className="w-full h-full flex items-center justify-center p-4">
                                            <ProductImage
                                                imagen={product.imagen}
                                                nombre={product.nombre}
                                                className={`w-full h-full object-contain ${isDark ? '' : 'mix-blend-multiply'}`}
                                                isDark={isDark}
                                            />
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        {/* Name & SKU */}
                                        <h3 className={`font-bold text-sm leading-tight line-clamp-1 mb-0.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`} title={product.nombre}>
                                            {product.nombre}
                                        </h3>
                                        <p className={`text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            SKU: {product.sku}
                                        </p>

                                        {/* Price */}
                                        <div className={`flex items-baseline justify-between mb-3 pb-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <div>
                                                <span className={`text-xl font-extrabold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                                                    S/ {product.precioVenta.toFixed(2)}
                                                </span>
                                                <span className={`text-xs ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    Costo: S/{product.precioCompra.toFixed(2)}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${margin > 30 ? (isDark ? 'text-emerald-400 bg-emerald-900/30' : 'text-emerald-600 bg-emerald-50') : margin > 15 ? (isDark ? 'text-amber-400 bg-amber-900/30' : 'text-amber-600 bg-amber-50') : (isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100')}`}>
                                                {margin.toFixed(0)}%
                                            </span>
                                        </div>

                                        {/* Stock Bar */}
                                        <div className="mb-3">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stock {product.unidadMedida && product.unidadMedida !== 'UNIDAD' ? `(${product.unidadMedida})` : ''}</span>
                                                <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {product.stockActual} <span className={`font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/ {product.stockMaximo}</span>
                                                </span>
                                            </div>
                                            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${statusConfig.barColor}`}
                                                    style={{ width: `${stockPercent}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Mín: {product.stockMinimo}</span>
                                                <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Máx: {product.stockMaximo}</span>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className={`space-y-1.5 text-xs mb-4 py-2.5 px-3 rounded-xl ${isDark ? 'bg-gray-900/40' : 'bg-gray-50'}`}>
                                            <div className="flex items-center justify-between">
                                                <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}><IoIosBuild className="w-3 h-3" /> Almacén</span>
                                                <span className={`font-medium truncate max-w-[120px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{product.almacenNombre}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}><IoIosPeople className="w-3 h-3" /> Proveedor</span>
                                                <span className={`font-medium truncate max-w-[120px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{product.proveedorRazonSocial}</span>
                                            </div>
                                            {product.ubicacionPrincipal && (
                                                <div className="flex items-center justify-between">
                                                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}><IoIosPin className="w-3 h-3" /> Ubicación</span>
                                                    <span className={`font-medium truncate max-w-[120px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{product.ubicacionPrincipal}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Barcode quickview */}
                                        {product.codigoBarrasPrincipal && (
                                            <button
                                                onClick={() => openBarcodeModal(product)}
                                                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-mono transition-all mb-3 ${isDark ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                                            >
                                                <IoIosBarcode className="w-4 h-4 shrink-0" />
                                                <span className="truncate">{product.codigoBarrasPrincipal}</span>
                                            </button>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-auto">
                                            <Link to={`/inventario/movimientos/${product.id}`}
                                                className={`flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-medium transition-all border ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
                                                <IoMdRefresh className="w-3.5 h-3.5 mr-1.5" />
                                                Movimientos
                                            </Link>
                                            <button onClick={() => openBarcodeModal(product)}
                                                className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-medium text-white transition-all shadow-sm"
                                                style={{ backgroundColor: colors[600] }}>
                                                <IoMdBarcode className="w-3.5 h-3.5 mr-1.5" />
                                                Código
                                            </button>
                                            <button
                                                onClick={() => initiateDelete(product.id, product.nombre)}
                                                className={`inline-flex items-center justify-center px-2.5 py-2 rounded-xl transition-all border ${isDark ? 'border-gray-600 text-gray-500 hover:text-red-400 hover:bg-red-900/20 hover:border-red-800' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200'}`}
                                                title="Eliminar">
                                                <IoMdTrash className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- KPI Card ---
const KPICard = ({ title, value, icon, accent, isDark }: {
    title: string; value: string | number; suffix: string;
    icon: React.ReactNode;
    accent: { bg: string; text: string; border: string };
    isDark: boolean;
}) => (
    <div className={`p-4 rounded-2xl border transition-all hover:shadow-md ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}>
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
                <h3 className={`text-xl sm:text-2xl font-bold tracking-tight truncate ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{value}</h3>
            </div>
            <div className={`p-2.5 rounded-xl border ${accent.bg} ${accent.border}`}>
                <span className={accent.text}>{icon}</span>
            </div>
        </div>
    </div>
);
