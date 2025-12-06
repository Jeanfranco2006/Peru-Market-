import { Link } from 'react-router-dom';
import {
    IoMdArrowRoundBack,
    IoIosPin,
    IoIosPeople,
    IoIosSave,
    IoIosCheckmarkCircle,
    IoIosWarning
} from 'react-icons/io';

import { useAlmacenForm } from '../../hooks/inventario/useAlmacenForm';
import type { AlmacenFormData } from '../../types/inventario/almacen';

export default function InventoryAddAlmacenes() {
    // Usamos el hook para obtener toda la lógica y estado
    const {
        formData,
        handleChange,
        handleSubmit,
        notification,
        validationErrors,
        showCancelModal,
        setShowCancelModal,
        navigate
    } = useAlmacenForm();

    const handleCancel = () => {
        navigate(-1); // Volver atrás
    };

    // Helper para mostrar errores (UI pura)
    const renderError = (fieldName: keyof AlmacenFormData) => (
        validationErrors[fieldName] ? (
            <p className="text-red-500 text-xs mt-1">{validationErrors[fieldName]}</p>
        ) : null
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            
            {/* Notificación */}
            {notification.show && (
                <div className={`fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.type === 'success' ? <IoIosCheckmarkCircle className="w-5 h-5" /> : <IoIosWarning className="w-5 h-5" />}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Modal Cancelar */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-yellow-100 p-2 rounded-full"><IoIosWarning className="w-6 h-6 text-yellow-600" /></div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Cancelar Creación</h3>
                                <p className="text-sm text-gray-600">¿Estás seguro? Se perderán los datos.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Continuar Editando</button>
                            <button onClick={handleCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">Sí, Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link to="/inventario/almacenes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <IoMdArrowRoundBack className="w-5 h-5 text-gray-700" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Almacén</h1>
                    <p className="text-gray-600">Registre la información de la nueva ubicación.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Panel Informativo */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <IoIosPin className="w-5 h-5 text-red-500" /> Detalles
                        </h3>
                        <p className="text-gray-600 text-sm">Ingrese un código único para identificar el almacén.</p>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-semibold text-gray-800">Estado Inicial:</p>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">ACTIVO</span>
                        </div>
                    </div>
                </div>

                {/* Formulario de Campos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Información General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 ${validationErrors.nombre ? 'border-red-500' : 'border-gray-300'}`} />
                                {renderError('nombre')}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                                <input type="text" name="codigo" required value={formData.codigo} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 ${validationErrors.codigo ? 'border-red-500' : 'border-gray-300'}`} />
                                {renderError('codigo')}
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                            <input type="text" name="direccion" required value={formData.direccion} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 ${validationErrors.direccion ? 'border-red-500' : 'border-gray-300'}`} />
                            {renderError('direccion')}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><IoIosPeople className="w-5 h-5" /> Capacidad</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                <input type="text" name="responsable" value={formData.responsable} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Total (m³) *</label>
                                <input type="number" step="0.01" name="capacidadM3" required value={formData.capacidadM3} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 ${validationErrors.capacidadM3 ? 'border-red-500' : 'border-gray-300'}`} />
                                {renderError('capacidadM3')}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCancelModal(true)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><IoIosSave /> Guardar Almacén</button>
                    </div>
                </div>
            </form>
        </div>
    );
}