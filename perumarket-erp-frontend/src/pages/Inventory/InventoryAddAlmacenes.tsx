import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    IoMdArrowRoundBack,
    IoIosPin,
    IoIosPeople,
    IoIosSave,
    IoIosCheckmarkCircle,
    IoIosWarning
} from 'react-icons/io';

// Interfaz para los datos que se enviarán (coincide con AlmacenRequest del backend)
interface AlmacenFormData {
    nombre: string;
    codigo: string;
    direccion: string;
    capacidadM3: number;
    responsable: string;
}

const API_URL = 'http://localhost:8080/api/almacenes'; 

export default function InventoryAddAlmacenes() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AlmacenFormData>({
        nombre: '', // Mapea a 'name' en el formulario original, pero enviamos 'nombre'
        codigo: '', // Mapea a 'code'
        direccion: '', // Mapea a 'address'
        capacidadM3: 0, // Mapea a 'capacityTotal'
        responsable: '' // Mapea a 'responsible'
    });
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // Utilizamos los nombres del DTO de request aquí para el estado: nombre, codigo, direccion, capacidadM3, responsable
            [name]: name === 'capacidadM3' ? parseFloat(value) || 0 : value,
        }));
        // Limpiar el error de validación cuando el usuario escribe
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setValidationErrors({});
        setShowNotification(false);

        try {
            const requestData = {
                nombre: formData.nombre,
                codigo: formData.codigo,
                direccion: formData.direccion,
                capacidadM3: formData.capacidadM3,
                responsable: formData.responsable,
                // No enviamos 'estado', se establece en ACTIVO por defecto en el backend
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorBody = await response.json();

                if (response.status === 400 && errorBody.errors) {
                    // Manejo de errores de validación de campos individuales (Bad Request)
                    setValidationErrors(errorBody.errors);
                    setNotificationMessage("Error de validación. Revise los campos marcados.");
                } else {
                    // Manejo de errores de negocio (409 Conflict o 404/500 genéricos)
                    setNotificationMessage(errorBody.message || `Error al guardar: Código de estado ${response.status}`);
                }
                
                setNotificationType('error');
                setShowNotification(true);
                return; // Detener la ejecución en caso de error
            }

            // Éxito (HTTP 201 Created)
            setNotificationMessage('¡Almacén guardado correctamente!');
            setNotificationType('success');
            setShowNotification(true);
            
            // Redirigir al listado
            setTimeout(() => {
                navigate('/inventario/almacenes');
            }, 1500);

        } catch (error) {
            console.error('Error de red:', error);
            setNotificationMessage("Error de conexión con el servidor.");
            setNotificationType('error');
            setShowNotification(true);

            setTimeout(() => {
                setShowNotification(false);
            }, 4000);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };
    
    // Función para obtener el nombre del campo en el DTO a partir del nombre en el input (si es diferente)
    // Esto es necesario para mapear los errores de validación del backend a los inputs del formulario
    const getFieldName = (inputName: string): keyof AlmacenFormData => {
        switch (inputName) {
            case 'name': return 'nombre';
            case 'code': return 'codigo';
            case 'address': return 'direccion';
            case 'capacityTotal': return 'capacidadM3';
            case 'responsible': return 'responsable';
            default: return inputName as keyof AlmacenFormData;
        }
    };
    
    // Función de ayuda para renderizar el mensaje de error
    const renderError = (fieldName: keyof AlmacenFormData) => (
        validationErrors[fieldName] ? (
            <p className="text-red-500 text-xs mt-1">{validationErrors[fieldName]}</p>
        ) : null
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Notificación Dinámica */}
            {showNotification && (
                <div className={`fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in ${notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notificationType === 'success' ? <IoIosCheckmarkCircle className="w-5 h-5" /> : <IoIosWarning className="w-5 h-5" />}
                    <span>{notificationMessage}</span>
                </div>
            )}

            {/* Modal de Cancelación (sin cambios) */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-yellow-100 p-2 rounded-full">
                                    <IoIosWarning className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Cancelar Creación</h3>
                                    <p className="text-sm text-gray-600">¿Estás seguro de que quieres cancelar? Se perderán todos los datos no guardados.</p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Continuar Editando
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <IoIosWarning className="w-4 h-4" />
                                    Sí, Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/inventario/almacenes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors transform active:scale-[0.95]">
                        <IoMdArrowRoundBack className="w-5 h-5 text-gray-700" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Almacén</h1>
                        <p className="text-gray-600">Registre la información de la nueva ubicación de almacenamiento.</p>
                    </div>
                </div>
            </div>

            <form id="almacen-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ... Panel lateral (sin cambios) ... */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <IoIosPin className="w-5 h-5 text-red-500" />
                            Detalles del Almacén
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Asegúrese de ingresar un <strong>Código</strong> único y definir claramente la <strong>Capacidad Total</strong> para una gestión de inventario eficiente.
                        </p>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-semibold text-gray-800">Estado Inicial:</p>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                ACTIVO
                            </span>
                            <p className="text-xs text-gray-500 mt-2">El almacén será creado en estado Activo por defecto.</p>
                        </div>
                    </div>
                </div>

                {/* Formulario principal (MODIFICADO para usar formData y manejar errores) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Información General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Almacén *</label>
                                <input
                                    type="text"
                                    name="nombre" 
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Almacén Principal A-01"
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {renderError('nombre')}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código Único *</label>
                                <input
                                    type="text"
                                    name="codigo"
                                    required
                                    value={formData.codigo}
                                    onChange={handleChange}
                                    placeholder="Ej: ALM-001"
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.codigo ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {renderError('codigo')}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                            <input
                                type="text"
                                name="direccion"
                                required
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Av. Los Tulipanes 123, Urb. Primavera"
                                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.direccion ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                            />
                            {renderError('direccion')}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <IoIosPeople className="w-5 h-5" />
                            Capacidad y Responsable
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                <input
                                    type="text"
                                    name="responsable"
                                    value={formData.responsable}
                                    onChange={handleChange}
                                    placeholder="Nombre del encargado"
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.responsable ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {renderError('responsable')}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Total (m³) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="capacidadM3"
                                    required
                                    value={formData.capacidadM3}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${validationErrors.capacidadM3 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                />
                                {renderError('capacidadM3')}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowCancelModal(true)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 transform active:scale-[0.98]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] font-medium"
                        >
                            <IoIosSave className="w-5 h-5" />
                            Guardar Almacén
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}