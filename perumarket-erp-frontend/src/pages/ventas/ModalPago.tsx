import React from 'react';
import { FaTrash, FaCreditCard, FaMoneyBillWave, FaUniversity, FaMobileAlt, FaWallet, FaReceipt, FaCheckCircle, FaTimes, FaPrint, FaArrowRight } from 'react-icons/fa';
import type { Cliente } from '../../types/clientes/Client';
import type { DetallePago, MetodoPago } from '../../types/ventas/ventas';

interface ModalPagoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (detallesPago: DetallePago[]) => void;
  cliente: Cliente | null;
  total: number;
  metodosPago: MetodoPago[];
}

const ModalPago: React.FC<ModalPagoProps> = ({ isOpen, onClose, onConfirmar, cliente, total, metodosPago }) => {
  
  // 1. Calcular totales fuera para usarlos en la inicialización y validación
  // Nota: Esto se recalcula en cada render, lo cual es correcto.
  const [detallesPago, setDetallesPago] = React.useState<DetallePago[]>([]);
  
  const totalPagado = detallesPago.reduce((sum, pago) => sum + pago.monto, 0);
  // El saldo restante es el TOTAL menos lo que ya está en la lista.
  // Usamos toFixed(2) para evitar errores de punto flotante y volvemos a número.
  const saldoRestante = Number((total - totalPagado).toFixed(2));

  // Función para resetear el formulario. 
  // OJO: Ahora el monto inicial dinámico depende del saldo restante actual.
  const inicializarPago = (montoSugerido: number) => ({
    id_metodo_pago: metodosPago[0]?.id || 0,
    monto: montoSugerido > 0 ? montoSugerido : 0, // El monto por defecto es lo que falta pagar
    referencia: '',
    numero_tarjeta: '',
    fecha_vencimiento: '',
    cvv: '',
    numero_transferencia: '',
    banco: '',
    numero_operacion: ''
  });

  // Iniciamos con el total completo
  const [pagoActual, setPagoActual] = React.useState<DetallePago>(inicializarPago(total));
  const [mostrarExito, setMostrarExito] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setDetallesPago([]);
      // Al abrir, el monto sugerido es el total completo
      setPagoActual(inicializarPago(total));
      setMostrarExito(false);
    }
  }, [isOpen, total, metodosPago]);

  const metodosConIconos = [
    { id: 1, nombre: 'Efectivo', icono: FaMoneyBillWave, color: 'text-green-600' },
    { id: 2, nombre: 'Tarjeta Débito', icono: FaCreditCard, color: 'text-blue-600' },
    { id: 3, nombre: 'Tarjeta Crédito', icono: FaCreditCard, color: 'text-purple-600' },
    { id: 4, nombre: 'Transferencia', icono: FaUniversity, color: 'text-indigo-600' },
    { id: 5, nombre: 'Yape', icono: FaMobileAlt, color: 'text-purple-500' },
    { id: 6, nombre: 'Plin', icono: FaMobileAlt, color: 'text-blue-500' }
  ];

  const getMetodoPagoNombre = (id: number) =>
    metodosPago.find(mp => mp.id === id)?.nombre || 'Desconocido';

  const getIconoMetodo = (id: number) => {
    const metodo = metodosConIconos.find(mp => mp.id === id);
    return metodo ? { Icono: metodo.icono, color: metodo.color } : { Icono: FaCreditCard, color: 'text-slate-500' };
  };

  const validarCamposPago = () => {
    const m = pagoActual.id_metodo_pago;
    if (!pagoActual.monto || pagoActual.monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return false;
    }
    // Validación extra de seguridad: no permitir agregar más del saldo restante
    // (aunque el input lo bloquea, es bueno tenerlo aquí también)
    // Usamos un pequeño margen de error (0.01) por si acaso decimales
    if (pagoActual.monto > saldoRestante + 0.01) {
        alert(`El monto no puede superar el saldo restante (S/ ${saldoRestante.toFixed(2)})`);
        return false;
    }

    switch (m) {
      case 2:
      case 3:
        if (!pagoActual.numero_tarjeta || !pagoActual.fecha_vencimiento || !pagoActual.cvv) {
          alert('Completa todos los datos de la tarjeta');
          return false;
        }
        break;
      case 4:
        if (!pagoActual.numero_transferencia || !pagoActual.banco) {
          alert('Completa los datos de la transferencia');
          return false;
        }
        break;
      case 5:
      case 6:
        if (!pagoActual.numero_operacion || !pagoActual.referencia) {
          alert('Completa los datos del pago móvil');
          return false;
        }
        break;
    }
    return true;
  };

  const agregarPago = () => {
    if (!validarCamposPago()) return;
    
    // 1. Agregamos el pago a la lista
    const nuevosDetalles = [...detallesPago, { ...pagoActual }];
    setDetallesPago(nuevosDetalles);
    
    // 2. Calculamos cuánto falta AHORA
    const nuevoTotalPagado = nuevosDetalles.reduce((sum, p) => sum + p.monto, 0);
    const nuevoSaldoRestante = Number((total - nuevoTotalPagado).toFixed(2));

    // 3. Reseteamos el formulario, pero SUGIRIENDO el saldo restante
    // Si ya se pagó todo (saldo 0), sugerimos 0.
    setPagoActual(inicializarPago(nuevoSaldoRestante));
  };

  const eliminarPago = (index: number) => {
    // Al eliminar, el saldo restante aumentará automáticamente en el render.
    // Opcional: Podríamos actualizar el input actual para que refleje el nuevo saldo,
    // pero dejar que el usuario lo escriba es mejor UX para evitar cambios bruscos.
    setDetallesPago(detallesPago.filter((_, i) => i !== index));
  };

  // Cambio: Eliminamos el cálculo de "cambio" ya que no habrá vuelto.
  
  const handleConfirmar = () => {
    if (detallesPago.length === 0) {
      alert('Agrega al menos un método de pago');
      return;
    }
    // Verificación final estricta: debe ser pago exacto
    if (totalPagado < total) {
      alert(`Aún falta cubrir el monto total. Faltan S/ ${(total - totalPagado).toFixed(2)}`);
      return;
    }
    setMostrarExito(true);
  };

  const handleFinalizarReal = () => {
    onConfirmar(detallesPago);
  };

  // MANEJO DEL INPUT DE MONTO
  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = parseFloat(e.target.value);
    
    if (isNaN(valor)) valor = 0;

    // LÓGICA DE TOPE:
    // Si el valor ingresado es mayor al saldo restante, lo forzamos al saldo restante.
    if (valor > saldoRestante) {
        valor = saldoRestante;
    }

    setPagoActual({ ...pagoActual, monto: valor });
  };


  if (!isOpen) return null;

  const inputClassName = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-slate-400";
  const labelClassName = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide";

  if (mostrarExito) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn flex flex-col items-center text-center">
            
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-white p-2 rounded-full">
                <FaCheckCircle className="text-emerald-500 text-6xl shadow-sm" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-800 mb-2">¡Pedido Realizado!</h2>
            <p className="text-slate-500 mb-6 text-sm">
              El pago se ha procesado correctamente.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 w-full border border-slate-100 mb-8 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Pagado</span>
                    <span className="text-xl font-black text-slate-800">S/ {total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
                <button
                    onClick={() => console.log("Imprimiendo ticket...")}
                    className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-800 transition-all"
                >
                    <FaPrint className="text-slate-400" /> Imprimir Ticket
                </button>
                
                <button
                    onClick={handleFinalizarReal}
                    className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
                >
                    Finalizar y Cerrar <FaArrowRight size={12} />
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <FaWallet size={20} />
                </div>
                Procesar Pago
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                <FaTimes />
            </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* Resumen venta */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                    {cliente?.persona.nombres.charAt(0)}
                </div>
                <div>
                    <span className="text-xs text-slate-500 font-medium">Cliente</span>
                    <p className="font-bold text-slate-800 text-sm">
                        {cliente?.persona.nombres} {cliente?.persona.apellidoPaterno}
                    </p>
                </div>
            </div>
            <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-medium">Total a Pagar</span>
                <p className="text-2xl font-black text-blue-600 tracking-tight">S/ {total.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Columna Izquierda: Formulario de pago */}
            <div className="space-y-5">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                        Seleccionar Método
                    </h4>

                    {/* Método Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                        {metodosConIconos.map((metodo) => {
                        const { Icono, color } = getIconoMetodo(metodo.id);
                        const isSelected = pagoActual.id_metodo_pago === metodo.id;
                        return (
                            <button
                            key={metodo.id}
                            onClick={() => setPagoActual({ ...pagoActual, id_metodo_pago: metodo.id })}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                                isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500 shadow-sm'
                                : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-white hover:border-blue-300 hover:shadow-md'
                            }`}
                            >
                            <Icono className={`mb-1.5 ${isSelected ? '' : 'opacity-70'} ${color}`} size={20} />
                            <span className="text-[10px] font-bold leading-tight">{metodo.nombre}</span>
                            </button>
                        );
                        })}
                    </div>

                    {/* Monto editable con TOPE DINÁMICO */}
                    <div className="mb-4">
                        <label className={labelClassName}>
                            Monto a Pagar 
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">S/</span>
                            <input
                                type="number"
                                value={pagoActual.monto}
                                onChange={handleMontoChange} // Usamos la nueva función con validación
                                className={`${inputClassName} pl-8 font-bold text-slate-800`}
                                min={0}
                                max={saldoRestante} // Ayuda visual para el navegador
                                step={0.01}
                                disabled={saldoRestante <= 0} // Si ya no hay deuda, bloqueamos
                            />
                        </div>
                    </div>

                    {/* Campos dinámicos (Sin cambios) */}
                    <div className="mb-5 min-h-[80px]">
                    {(() => {
                        switch (pagoActual.id_metodo_pago) {
                        case 1:
                            return (
                            <div>
                                <label className={labelClassName}>Referencia (Opcional)</label>
                                <input
                                type="text"
                                value={pagoActual.referencia || ''}
                                onChange={(e) => setPagoActual({ ...pagoActual, referencia: e.target.value })}
                                className={inputClassName}
                                placeholder="Nota adicional..."
                                />
                            </div>
                            );
                        case 2:
                        case 3:
                            return (
                            <div className="space-y-3 animate-fadeIn">
                                <div>
                                    <label className={labelClassName}>Número de Tarjeta</label>
                                    <div className="relative">
                                        <FaCreditCard className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="text"
                                            value={pagoActual.numero_tarjeta || ''}
                                            onChange={(e) => setPagoActual({ ...pagoActual, numero_tarjeta: e.target.value })}
                                            placeholder="0000 0000 0000 0000"
                                            className={`${inputClassName} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClassName}>Vencimiento</label>
                                    <input
                                        type="text"
                                        value={pagoActual.fecha_vencimiento || ''}
                                        onChange={(e) => setPagoActual({ ...pagoActual, fecha_vencimiento: e.target.value })}
                                        placeholder="MM/AA"
                                        className={inputClassName}
                                    />
                                </div>
                                <div>
                                    <label className={labelClassName}>CVV</label>
                                    <input
                                        type="text"
                                        value={pagoActual.cvv || ''}
                                        onChange={(e) => setPagoActual({ ...pagoActual, cvv: e.target.value })}
                                        placeholder="123"
                                        className={inputClassName}
                                    />
                                </div>
                                </div>
                            </div>
                            );
                        case 4:
                            return (
                            <div className="space-y-3 animate-fadeIn">
                                <div>
                                    <label className={labelClassName}>Banco de Origen</label>
                                    <div className="relative">
                                        <FaUniversity className="absolute left-3 top-3 text-slate-400" />
                                        <select
                                            value={pagoActual.banco || ''}
                                            onChange={(e) => setPagoActual({ ...pagoActual, banco: e.target.value })}
                                            className={`${inputClassName} pl-10 appearance-none`}
                                        >
                                            <option value="">Seleccionar banco...</option>
                                            <option value="BCP">BCP</option>
                                            <option value="Interbank">Interbank</option>
                                            <option value="BBVA">BBVA</option>
                                            <option value="Scotiabank">Scotiabank</option>
                                            <option value="Banco de la Nación">Banco de la Nación</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClassName}>Nro. Operación</label>
                                    <input
                                        type="text"
                                        value={pagoActual.numero_transferencia || ''}
                                        onChange={(e) => setPagoActual({ ...pagoActual, numero_transferencia: e.target.value })}
                                        placeholder="Ej: 12345678"
                                        className={inputClassName}
                                    />
                                </div>
                            </div>
                            );
                        case 5:
                        case 6:
                            return (
                            <div className="space-y-3 animate-fadeIn">
                                <div>
                                    <label className={labelClassName}>Nro. Celular</label>
                                    <div className="relative">
                                        <FaMobileAlt className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="text"
                                            value={pagoActual.referencia || ''}
                                            onChange={(e) => setPagoActual({ ...pagoActual, referencia: e.target.value })}
                                            placeholder="999 999 999"
                                            className={`${inputClassName} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClassName}>Código de Operación</label>
                                    <input
                                        type="text"
                                        value={pagoActual.numero_operacion || ''}
                                        onChange={(e) => setPagoActual({ ...pagoActual, numero_operacion: e.target.value })}
                                        placeholder="Ej: 123456"
                                        className={inputClassName}
                                    />
                                </div>
                            </div>
                            );
                        default:
                            return null;
                        }
                    })()}
                    </div>

                    <button
                        onClick={agregarPago}
                        disabled={saldoRestante <= 0} // Si ya no hay deuda, bloqueamos agregar más
                        className={`w-full py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-bold text-sm transform active:scale-95 ${
                            saldoRestante <= 0 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-800 text-white hover:bg-slate-900 hover:shadow-lg'
                        }`}
                    >
                        <FaCheckCircle className={saldoRestante <= 0 ? "text-slate-400" : "text-emerald-400"} /> 
                        {saldoRestante <= 0 ? 'Monto Completado' : 'Agregar al Pago'}
                    </button>
                </div>
            </div>

            {/* Columna Derecha: Lista y Totales */}
            <div className="flex flex-col h-full">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm px-1">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
                    Desglose de Pagos
                </h4>
                
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col mb-4">
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px] max-h-[300px] custom-scrollbar">
                        {detallesPago.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                <FaReceipt size={40} className="mb-2 opacity-50" />
                                <p className="text-sm font-medium">Sin pagos registrados</p>
                            </div>
                        ) : (
                            detallesPago.map((pago, index) => {
                                const { Icono, color } = getIconoMetodo(pago.id_metodo_pago);
                                return (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors group">
                                    <div className="flex items-center flex-1">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100 mr-3 shadow-sm">
                                            <Icono className={`${color}`} size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-slate-700 text-sm truncate">{getMetodoPagoNombre(pago.id_metodo_pago)}</div>
                                            <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-wide">
                                                {pago.referencia && <span>Ref: {pago.referencia}</span>}
                                                {pago.numero_operacion && <span>Op: {pago.numero_operacion}</span>}
                                                {pago.banco && <span>{pago.banco}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800">S/ {pago.monto.toFixed(2)}</span>
                                        <button onClick={() => eliminarPago(index)} className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50">
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                                );
                            })
                        )}
                    </div>
                    
                    {/* Totales footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total Venta</span>
                            <span className="font-bold text-slate-700">S/ {total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total Agregado</span>
                            <span className="font-bold text-emerald-600">S/ {totalPagado.toFixed(2)}</span>
                        </div>
                        
                        {/* Modificado: Solo mostramos RESTANTE si falta dinero. Ocultamos si es 0 */}
                        <div className={`mt-3 pt-3 border-t border-slate-200 flex justify-between items-center ${saldoRestante > 0 ? 'text-red-500' : 'text-green-600'}`}>
                            <span className="font-bold text-sm uppercase">{saldoRestante > 0 ? 'Restante por pagar' : 'Pago Completo'}</span>
                            <span className="text-xl font-black">S/ {saldoRestante.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-white flex gap-3 justify-end rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all text-sm font-bold"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              // Disabled solo si falta dinero (saldoRestante > 0)
              disabled={saldoRestante > 0} 
              className={`px-8 py-2.5 rounded-xl shadow-lg transition-all text-sm font-bold flex items-center gap-2 transform active:scale-95 ${
                saldoRestante <= 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <FaCheckCircle /> Confirmar y Emitir
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModalPago;