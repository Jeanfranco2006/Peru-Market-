import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    IoIosCube, IoIosStats, IoIosPulse, IoIosSearch,
    IoMdHome, IoMdAdd, IoMdCheckmarkCircle, IoIosCart, IoMdClipboard,
    IoIosPin, IoIosBuild, IoIosPeople, IoMdCreate, IoMdRefresh, IoMdTrash,
    IoIosArchive, IoIosBarcode, IoIosImage, IoMdWarning, IoMdClose,
    IoMdAlert // IMPORTANTE: Añadido para el modal
} from 'react-icons/io';

// Importamos el hook de lógica
import { useInventory } from '../../hooks/inventario/useInventory';

// --- COMPONENTES UI AUXILIARES (SE MANTIENEN IGUAL) ---

// 1. Estado del Stock (Helper para lógica visual)
const getStockStatusConfig = (stock: number, minStock: number) => {
    if (stock <= 0) return { label: 'Sin Stock', color: 'bg-red-50 text-red-700 border-red-100', icon: <IoMdWarning /> };
    if (stock <= minStock) return { label: 'Stock Bajo', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <IoIosPulse /> };
    return { label: 'Disponible', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <IoMdCheckmarkCircle /> };
};

// 2. Visualizador de Código de Barras
const BarcodeDisplay = ({ barcode, sku, name }: { barcode: string, sku: string, name: string }) => {
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
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Imprimir Código - ${name}</title>
                            <style>
                                body { margin: 0; padding: 20px; font-family: sans-serif; text-align: center; }
                                .barcode-container { margin: 20px auto; max-width: 400px; padding: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="barcode-container">
                                <img src="${barcodeImageUrl}" style="max-width: 100%;" />
                                <div style="margin-top: 10px;"><strong>${name}</strong><br/>SKU: ${sku}</div>
                            </div>
                            <script>window.print();</script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-inner w-full flex justify-center min-h-[100px] items-center">
                    {barcodeImageUrl ? (
                        <img src={barcodeImageUrl} alt="Barcode" className="max-w-full h-auto mix-blend-multiply" />
                    ) : (
                        <div className="flex gap-1 opacity-20">{Array.from({ length: 13 }).map((_, i) => <div key={i} className={`h-12 w-1 ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'} border-l border-black`} />)}</div>
                    )}
                </div>
                <div className="text-center">
                    <p className="font-mono text-lg tracking-widest text-slate-800 font-bold">{barcode}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">SKU: {sku}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full pt-2">
                    <button className="flex items-center justify-center py-2 px-4 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors" onClick={() => { navigator.clipboard.writeText(barcode); alert('Copiado'); }}>
                        Copiar
                    </button>
                    <button className="flex items-center justify-center py-2 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium text-sm transition-colors shadow-sm" onClick={printBarcode}>
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
};

// 3. Imagen del Producto (OPTIMIZADA)
const ProductImage = ({ imagen, nombre, className = "" }: { imagen: string, nombre: string, className?: string }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!imagen || imageError) {
        return (
            <div className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
                <IoIosImage className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Sin imagen</span>
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
            className={`transition-transform duration-500 group-hover:scale-105 ${className}`}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
        />
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function Inventory() {
    const {
        loading,
        error,
        filteredProducts,
        stats,
        categories,
        searchTerm,
        setSearchTerm,
        filterCategory,
        setFilterCategory,
        // Nuevas funciones destructuradas del hook para el Modal
        initiateDelete,
        confirmDelete,
        cancelDelete,
        productToDelete,
        isDeleting,
        // Funciones del Modal Barcode
        showBarcodeModal,
        selectedProduct,
        openBarcodeModal,
        closeBarcodeModal
    } = useInventory();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center animate-pulse">
                <IoIosCube className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Cargando inventario...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-8 max-w-2xl mx-auto mt-10">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4 text-red-700">
                <IoMdWarning className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold">Error de conexión</h3>
                    <p className="text-sm mt-1 opacity-90">{error}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 relative">
            
            {/* --- MODAL DE ELIMINAR (PERSONALIZADO) --- */}
            {productToDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={!isDeleting ? cancelDelete : undefined}
                    ></div>

                    {/* Contenedor del Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Cabecera Roja */}
                        <div className="bg-red-50 border-b border-red-100 p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <IoMdWarning className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">¿Eliminar producto?</h3>
                            <p className="text-sm text-slate-500 mt-2">
                                Estás a punto de eliminar <span className="font-bold text-slate-800">"{productToDelete.nombre}"</span>.
                            </p>
                        </div>

                        {/* Cuerpo de Advertencia */}
                        <div className="p-6 space-y-4">
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3">
                                <IoMdAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-semibold mb-1">Acción irreversible</p>
                                    <ul className="list-disc list-inside space-y-1 opacity-90 text-xs">
                                        <li>Se eliminará el producto del inventario.</li>
                                        <li>Se perderá el stock actual.</li>
                                        <li>Se borrará el historial de movimientos.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button 
                                onClick={cancelDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-sm shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <IoMdTrash className="w-5 h-5" />
                                        Sí, eliminar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                {/* Header Principal */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Inventario General</h1>
                        <p className="text-slate-500 mt-1">Gestiona tus productos, existencias y movimientos.</p>
                    </div>
                    <div className="flex gap-3">
                         <Link to="/inventario/almacenes" className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all shadow-sm">
                            <IoMdHome className="w-4 h-4 mr-2 text-slate-500" />
                            Almacenes
                        </Link>
                        <Link to="/inventario/nuevo" className="inline-flex items-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-all shadow-md shadow-indigo-200">
                            <IoMdAdd className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </Link>
                    </div>
                </div>

                {/* Modal de Código de Barras */}
                {showBarcodeModal && selectedProduct && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden scale-100">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-semibold text-slate-800">Código de Producto</h3>
                                <button onClick={closeBarcodeModal} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                                    <IoMdClose className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <h4 className="text-center font-bold text-slate-900 mb-4">{selectedProduct.nombre}</h4>
                                <BarcodeDisplay barcode={selectedProduct.codigoBarrasPrincipal} sku={selectedProduct.sku} name={selectedProduct.nombre} />
                            </div>
                        </div>
                    </div>
                )}

                {/* 1. SECCIÓN DE ESTADÍSTICAS (KPIs) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard 
                        title="Total Productos" 
                        value={stats.totalProducts} 
                        icon={<IoIosCube className="w-6 h-6" />} 
                        color="text-indigo-600 bg-indigo-50 border-indigo-100" 
                    />
                    <StatCard 
                        title="Valor Inventario" 
                        value={`S/ ${stats.totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} 
                        icon={<IoIosStats className="w-6 h-6" />} 
                        color="text-emerald-600 bg-emerald-50 border-emerald-100" 
                    />
                    <StatCard 
                        title="Stock Bajo" 
                        value={stats.lowStockCount} 
                        icon={<IoIosPulse className="w-6 h-6" />} 
                        color="text-amber-600 bg-amber-50 border-amber-100" 
                    />
                    <StatCard 
                        title="Sin Stock" 
                        value={stats.outOfStockCount} 
                        icon={<IoMdWarning className="w-6 h-6" />} 
                        color="text-red-600 bg-red-50 border-red-100" 
                    />
                </div>

                {/* BARRA DE FILTROS */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-8 sticky top-4 z-30 mx-auto w-full">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative">
                            <IoIosSearch className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                            <input
                                placeholder="Buscar por nombre, SKU o código..."
                                className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="h-px md:h-auto md:w-px bg-slate-200 mx-2"></div>
                        <div className="md:w-64">
                            <select
                                className="w-full px-3 py-2.5 bg-transparent rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
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
                </div>

                {/* 2. GRILLA DE PRODUCTOS */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <IoIosCube className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No se encontraron productos</h3>
                        <p className="text-slate-500 text-sm">Intenta ajustar los filtros o tu búsqueda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => {
                            const margin = (product.precioVenta - product.precioCompra) / product.precioCompra;
                            const marginPercentage = isNaN(margin) || !isFinite(margin) ? 0 : margin * 100;
                            const statusConfig = getStockStatusConfig(product.stockActual, product.stockMinimo);

                            return (
                                <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden">
                                    
                                    {/* HEADER: Imagen y Status */}
                                    <div className="relative h-56 bg-slate-100 overflow-hidden border-b border-slate-100">
                                        <div className="absolute top-3 left-3 z-10">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm border border-slate-100">
                                                {product.categoriaNombre}
                                            </span>
                                        </div>
                                        <div className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${statusConfig.color}`}>
                                            {statusConfig.icon} {statusConfig.label}
                                        </div>
                                        
                                        {/* Imagen Componente */}
                                        <div className="w-full h-full flex items-center justify-center p-6 group-hover:p-4 transition-all duration-500">
                                            <ProductImage 
                                                imagen={product.imagen} 
                                                nombre={product.nombre} 
                                                className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" 
                                            />
                                        </div>
                                    </div>

                                    {/* BODY: Información Principal */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1" title={product.nombre}>
                                                    {product.nombre}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-2 h-10 leading-relaxed">
                                                {product.descripcion || <span className="italic opacity-50">Sin descripción disponible</span>}
                                            </p>
                                        </div>

                                        {/* Precio y SKU */}
                                        <div className="flex items-end justify-between mb-5 pb-5 border-b border-slate-100">
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium uppercase mb-0.5">Precio Venta</p>
                                                <span className="text-2xl font-extrabold text-slate-900">S/ {product.precioVenta.toFixed(2)}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-mono text-slate-400 mb-1">SKU: {product.sku}</p>
                                                <div 
                                                    className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2 py-1 cursor-pointer hover:bg-slate-100 transition-colors group/code"
                                                    onClick={() => openBarcodeModal(product)}
                                                >
                                                    <IoIosBarcode className="w-3.5 h-3.5 text-slate-400 group-hover/code:text-indigo-500" />
                                                    <span className="text-xs font-mono text-slate-600 group-hover/code:text-indigo-600">{product.codigoBarrasPrincipal}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Grid de Stock */}
                                        <div className="grid grid-cols-3 gap-px bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mb-5 text-center">
                                            <div className="bg-white p-2.5">
                                                <div className="text-xs text-slate-400 font-medium mb-1">Mín</div>
                                                <div className="font-bold text-slate-700">{product.stockMinimo}</div>
                                            </div>
                                            <div className="bg-white p-2.5 relative">
                                                <div className="text-xs text-indigo-500 font-bold mb-1">Actual</div>
                                                <div className="font-bold text-xl text-indigo-700">{product.stockActual}</div>
                                            </div>
                                            <div className="bg-white p-2.5">
                                                <div className="text-xs text-slate-400 font-medium mb-1">Máx</div>
                                                <div className="font-bold text-slate-700">{product.stockMaximo}</div>
                                            </div>
                                        </div>

                                        {/* Detalles Expandibles (Lista Compacta) */}
                                        <div className="space-y-2.5 text-sm mb-5">
                                            <DetailRow icon={<IoIosPin />} label="Ubicación" value={product.ubicacionPrincipal} />
                                            <DetailRow icon={<IoIosBuild />} label="Almacén" value={product.almacenNombre} highlight />
                                            <DetailRow icon={<IoIosPeople />} label="Proveedor" value={product.proveedorRazonSocial} />
                                            
                                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-slate-200 text-xs">
                                                <span className="text-slate-500">Costo: <span className="font-medium text-slate-700">S/{product.precioCompra.toFixed(2)}</span></span>
                                                <span className={`font-bold ${marginPercentage > 30 ? 'text-emerald-600' : marginPercentage > 15 ? 'text-amber-600' : 'text-slate-500'}`}>
                                                    Margen: {marginPercentage.toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer de Estadísticas (Iconos) */}
                                        <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 mb-4 bg-slate-50/50 rounded-lg">
                                            <MetricItem icon={<IoIosCart />} value={product.purchases} label="Compras" color="text-purple-600" />
                                            <MetricItem icon={<IoMdClipboard />} value={product.sales} label="Ventas" color="text-indigo-600" />
                                            <MetricItem icon={<IoIosArchive />} value={product.orders} label="Pedidos" color="text-teal-600" />
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex gap-2 mt-auto">
                                            <Link to={`/inventario/movimientos/${product.id}`} className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 rounded-lg text-sm font-medium transition-all shadow-sm">
                                                <IoMdRefresh className="w-4 h-4 mr-1.5" />
                                                Movs.
                                            </Link>
                                            <Link to={`/inventario/editar/${product.id}`} className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-900 text-white hover:bg-indigo-600 rounded-lg text-sm font-medium transition-all shadow-sm">
                                                <IoMdCreate className="w-4 h-4 mr-1.5" />
                                                Editar
                                            </Link>
                                            {/* BOTON DE ELIMINAR ACTUALIZADO */}
                                            <button 
                                                onClick={() => initiateDelete(product.id, product.nombre)} 
                                                className="inline-flex items-center justify-center px-3 py-2 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all"
                                                title="Eliminar producto"
                                            >
                                                <IoMdTrash className="w-4 h-4" />
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

// --- SUBCOMPONENTES DE DISEÑO ---

const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            {icon}
        </div>
    </div>
);

const DetailRow = ({ icon, label, value, highlight }: any) => (
    <div className="flex items-center justify-between group/row">
        <div className="flex items-center gap-2 text-slate-400 group-hover/row:text-slate-600 transition-colors">
            {icon}
            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <span className={`text-right font-medium truncate max-w-[140px] ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>
            {value}
        </span>
    </div>
);

const MetricItem = ({ icon, value, label, color }: any) => (
    <div className="text-center border-r border-slate-200 last:border-0 px-1">
        <div className={`inline-flex mb-1 ${color}`}>{icon}</div>
        <div className="font-bold text-slate-800 text-sm">{value}</div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</div>
    </div>
);