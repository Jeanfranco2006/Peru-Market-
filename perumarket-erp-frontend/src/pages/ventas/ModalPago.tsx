import React from 'react';
import { FaTrash, FaCreditCard, FaMoneyBillWave, FaReceipt, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import type { Cliente } from '../../types/Client';


interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
}


interface DetallePago {
  id_metodo_pago: number;
  monto: number;
  referencia: string;
  numero_tarjeta?: string;
  fecha_vencimiento?: string;
  cvv?: string;
  numero_transferencia?: string;
  banco?: string;
  numero_operacion?: string;
}

interface ModalPagoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (detallesPago: DetallePago[]) => void;
  cliente: Cliente | null; // ya está usando tu tipo Cliente
  total: number;
  metodosPago: MetodoPago[];
}


const ModalPago: React.FC<ModalPagoProps> = ({ 
  isOpen, 
  onClose, 
  onConfirmar, 
  cliente, 
  total, 
  metodosPago 
}) => {
  const [pagoActual, setPagoActual] = React.useState<DetallePago>({
    id_metodo_pago: metodosPago[0]?.id || 0,
    monto: total,
    referencia: ''
  });

  const [detallesPago, setDetallesPago] = React.useState<DetallePago[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setPagoActual({
        id_metodo_pago: metodosPago[0]?.id || 0,
        monto: total,
        referencia: ''
      });
      setDetallesPago([]);
    }
  }, [isOpen, total, metodosPago]);

  // Métodos de pago con iconos
  const metodosConIconos = [
    { id: 1, nombre: 'Efectivo', icono: FaMoneyBillWave, color: 'text-green-600' },
    { id: 2, nombre: 'Tarjeta Débito', icono: FaCreditCard, color: 'text-blue-600' },
    { id: 3, nombre: 'Tarjeta Crédito', icono: FaCreditCard, color: 'text-purple-600' },
    { id: 4, nombre: 'Transferencia', icono: FaUniversity, color: 'text-indigo-600' },
    { id: 5, nombre: 'Yape', icono: FaMobileAlt, color: 'text-purple-500' },
    { id: 6, nombre: 'Plin', icono: FaMobileAlt, color: 'text-blue-500' }
  ];

  const getMetodoPagoNombre = (id: number) => {
    return metodosPago.find(mp => mp.id === id)?.nombre || 'Desconocido';
  };

  const getIconoMetodo = (id: number) => {
    const metodo = metodosConIconos.find(mp => mp.id === id);
    return metodo ? { Icono: metodo.icono, color: metodo.color } : { Icono: FaCreditCard, color: 'text-gray-600' };
  };

  // Campos específicos para cada método de pago
  const getCamposMetodoPago = (metodoId: number) => {
    switch (metodoId) {
      case 1: // Efectivo
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia (Opcional)
              </label>
              <input
                type="text"
                value={pagoActual.referencia || ''}
                onChange={(e) => setPagoActual({...pagoActual, referencia: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Ej: Pago en efectivo"
              />
            </div>
          </div>
        );

      case 2: // Tarjeta Débito
      case 3: // Tarjeta Crédito
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Tarjeta *
              </label>
              <input
                type="text"
                value={pagoActual.numero_tarjeta || ''}
                onChange={(e) => setPagoActual({...pagoActual, numero_tarjeta: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Vencimiento *
                </label>
                <input
                  type="text"
                  value={pagoActual.fecha_vencimiento || ''}
                  onChange={(e) => setPagoActual({...pagoActual, fecha_vencimiento: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="MM/AA"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="text"
                  value={pagoActual.cvv || ''}
                  onChange={(e) => setPagoActual({...pagoActual, cvv: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        );

      case 4: // Transferencia
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Transferencia *
              </label>
              <input
                type="text"
                value={pagoActual.numero_transferencia || ''}
                onChange={(e) => setPagoActual({...pagoActual, numero_transferencia: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Número de operación bancaria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco *
              </label>
              <select
                value={pagoActual.banco || ''}
                onChange={(e) => setPagoActual({...pagoActual, banco: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Seleccionar banco</option>
                <option value="BCP">BCP</option>
                <option value="Interbank">Interbank</option>
                <option value="BBVA">BBVA</option>
                <option value="Scotiabank">Scotiabank</option>
                <option value="Banco de la Nación">Banco de la Nación</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
        );

      case 5: // Yape
      case 6: // Plin
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Operación *
              </label>
              <input
                type="text"
                value={pagoActual.numero_operacion || ''}
                onChange={(e) => setPagoActual({...pagoActual, numero_operacion: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Número de operación Yape/Plin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono asociado *
              </label>
              <input
                type="text"
                value={pagoActual.referencia || ''}
                onChange={(e) => setPagoActual({...pagoActual, referencia: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Número de teléfono"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Validar campos según el método de pago
  const validarCamposPago = () => {
    const metodoId = pagoActual.id_metodo_pago;

    // Validar campos obligatorios según el método
    switch (metodoId) {
      case 2: // Tarjeta Débito
      case 3: // Tarjeta Crédito
        if (!pagoActual.numero_tarjeta || !pagoActual.fecha_vencimiento || !pagoActual.cvv) {
          alert('Por favor completa todos los campos de la tarjeta');
          return false;
        }
        break;

      case 4: // Transferencia
        if (!pagoActual.numero_transferencia || !pagoActual.banco) {
          alert('Por favor completa los datos de la transferencia');
          return false;
        }
        break;

      case 5: // Yape
      case 6: // Plin
        if (!pagoActual.numero_operacion || !pagoActual.referencia) {
          alert('Por favor completa los datos del pago móvil');
          return false;
        }
        break;
    }

    return true;
  };

  const agregarPago = () => {
    if (pagoActual.id_metodo_pago === 0) {
      alert('Selecciona un método de pago');
      return;
    }

    if (!validarCamposPago()) {
      return;
    }

    setDetallesPago([...detallesPago, { ...pagoActual }]);
    
    // Reiniciar el formulario de pago actual
    setPagoActual({
      id_metodo_pago: metodosPago[0]?.id || 0,
      monto: total,
      referencia: ''
    });
  };

  const eliminarPago = (index: number) => {
    const nuevosPagos = detallesPago.filter((_, i) => i !== index);
    setDetallesPago(nuevosPagos);
  };

  const getTotalPagado = () => {
    return detallesPago.reduce((sum, pago) => sum + pago.monto, 0);
  };

  const handleConfirmar = () => {
    if (detallesPago.length === 0) {
      alert('Agrega al menos un método de pago');
      return;
    }

    const totalPagado = getTotalPagado();
    
    if (totalPagado < total) {
      alert(`El total pagado (S/ ${totalPagado.toFixed(2)}) es menor al total de la venta (S/ ${total.toFixed(2)})`);
      return;
    }

    onConfirmar(detallesPago);
  };

  const totalPagado = getTotalPagado();
  const cambio = totalPagado - total;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaCreditCard className="mr-2" />
            Medios de Pago
          </h3>
          
          {/* Resumen de la venta */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Resumen de Venta</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Cliente:</span>
                <p className="font-medium">{cliente?.persona.nombres} {cliente?.persona.nombres}</p>
              </div>
              <div>
                <span className="text-gray-600">Total a Pagar:</span>
                <p className="font-bold text-blue-600">S/ {total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Formulario para agregar pago */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">Agregar Pago</h4>
            
            {/* Selección de método de pago */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {metodosConIconos.map((metodo) => {
                  const { Icono, color } = getIconoMetodo(metodo.id);
                  return (
                    <button
                      key={metodo.id}
                      onClick={() => setPagoActual({
                        ...pagoActual,
                        id_metodo_pago: metodo.id,
                        monto: total
                      })}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        pagoActual.id_metodo_pago === metodo.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icono className={`mx-auto mb-1 ${color}`} size={20} />
                      <span className="text-xs font-medium">{metodo.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monto (estático) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto a Pagar
              </label>
              <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 text-sm font-semibold">
                S/ {pagoActual.monto.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">El monto es fijo y corresponde al total de la venta</p>
            </div>

            {/* Campos específicos del método de pago */}
            <div className="mb-3">
              {getCamposMetodoPago(pagoActual.id_metodo_pago)}
            </div>

            <button
              onClick={agregarPago}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors mt-2 text-sm font-medium"
            >
              Agregar Pago
            </button>
          </div>

          {/* Lista de pagos agregados */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">Pagos Registrados</h4>
            {detallesPago.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No hay pagos registrados</p>
            ) : (
              <div className="space-y-2">
                {detallesPago.map((pago, index) => {
                  const { Icono, color } = getIconoMetodo(pago.id_metodo_pago);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center flex-1">
                        <Icono className={`mr-3 ${color}`} size={18} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {getMetodoPagoNombre(pago.id_metodo_pago)}
                          </div>
                          {pago.referencia && (
                            <div className="text-xs text-gray-600">Ref: {pago.referencia}</div>
                          )}
                          {pago.numero_operacion && (
                            <div className="text-xs text-gray-600">Op: {pago.numero_operacion}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">S/ {pago.monto.toFixed(2)}</span>
                        <button
                          onClick={() => eliminarPago(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resumen de pagos */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total a Pagar:</span>
                <span className="font-semibold">S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Pagado:</span>
                <span className="font-semibold">S/ {totalPagado.toFixed(2)}</span>
              </div>
              {cambio > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Cambio:</span>
                  <span className="font-semibold">S/ {cambio.toFixed(2)}</span>
                </div>
              )}
              {cambio < 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Falta pagar:</span>
                  <span className="font-semibold">S/ {Math.abs(cambio).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones del modal */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={totalPagado < total}
              className={`flex-1 py-2 rounded transition-colors text-sm sm:text-base ${
                totalPagado >= total
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Confirmar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPago;