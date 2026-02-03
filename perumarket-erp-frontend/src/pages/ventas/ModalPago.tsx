import React from 'react';
import {
  FiTrash2, FiCreditCard, FiDollarSign, FiSmartphone,
  FiCheckCircle, FiX, FiPrinter, FiArrowRight, FiTruck, FiFileText
} from 'react-icons/fi';
import { FaUniversity, FaWallet } from 'react-icons/fa';
import type { Cliente } from '../../types/clientes/Client';
import type { DetallePago, MetodoPago } from '../../types/ventas/ventas';
import { useThemeClasses } from '../../hooks/useThemeClasses';

interface ModalPagoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (detallesPago: DetallePago[]) => void;
  cliente: Cliente | null;
  total: number;
  metodosPago: MetodoPago[];
  conEnvio: boolean;
  direccionEnvio: string;
}

const ModalPago: React.FC<ModalPagoProps> = ({ isOpen, onClose, onConfirmar, cliente, total, metodosPago, conEnvio, direccionEnvio }) => {
  const { isDark, colors, heading, textTertiary, border, input, modalOverlay, modalContent } = useThemeClasses();

  const [detallesPago, setDetallesPago] = React.useState<DetallePago[]>([]);
  const totalPagado = detallesPago.reduce((sum, pago) => sum + pago.monto, 0);
  const saldoRestante = Number((total - totalPagado).toFixed(2));

  const inicializarPago = (montoSugerido: number) => ({
    id_metodo_pago: metodosPago[0]?.id || 0,
    monto: montoSugerido > 0 ? montoSugerido : 0,
    referencia: '',
    numero_tarjeta: '',
    fecha_vencimiento: '',
    cvv: '',
    numero_transferencia: '',
    banco: '',
    numero_operacion: ''
  });

  const [pagoActual, setPagoActual] = React.useState<DetallePago>(inicializarPago(total));
  const [mostrarExito, setMostrarExito] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setDetallesPago([]);
      setPagoActual(inicializarPago(total));
      setMostrarExito(false);
    }
  }, [isOpen, total, metodosPago]);

  const metodosConIconos = [
    { id: 1, nombre: 'Efectivo', icono: FiDollarSign, color: 'text-green-600' },
    { id: 2, nombre: 'Tarjeta Débito', icono: FiCreditCard, color: 'text-blue-600' },
    { id: 3, nombre: 'Tarjeta Crédito', icono: FiCreditCard, color: 'text-purple-600' },
    { id: 4, nombre: 'Transferencia', icono: FaUniversity, color: 'text-indigo-600' },
    { id: 5, nombre: 'Yape', icono: FiSmartphone, color: 'text-purple-500' },
    { id: 6, nombre: 'Plin', icono: FiSmartphone, color: 'text-blue-500' }
  ];

  const getMetodoPagoNombre = (id: number) => metodosPago.find(mp => mp.id === id)?.nombre || 'Desconocido';

  const getIconoMetodo = (id: number) => {
    const metodo = metodosConIconos.find(mp => mp.id === id);
    return metodo ? { Icono: metodo.icono, color: metodo.color } : { Icono: FiCreditCard, color: 'text-gray-500' };
  };

  const validarCamposPago = () => {
    const m = pagoActual.id_metodo_pago;
    if (!pagoActual.monto || pagoActual.monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return false;
    }
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
    const nuevosDetalles = [...detallesPago, { ...pagoActual }];
    setDetallesPago(nuevosDetalles);
    const nuevoTotalPagado = nuevosDetalles.reduce((sum, p) => sum + p.monto, 0);
    const nuevoSaldoRestante = Number((total - nuevoTotalPagado).toFixed(2));
    setPagoActual(inicializarPago(nuevoSaldoRestante));
  };

  const eliminarPago = (index: number) => {
    setDetallesPago(detallesPago.filter((_, i) => i !== index));
  };

  const handleConfirmar = () => {
    if (detallesPago.length === 0) {
      alert('Agrega al menos un método de pago');
      return;
    }
    if (totalPagado < total) {
      alert(`Aún falta cubrir el monto total. Faltan S/ ${(total - totalPagado).toFixed(2)}`);
      return;
    }
    setMostrarExito(true);
  };

  const handleFinalizarReal = () => {
    onConfirmar(detallesPago);
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = parseFloat(e.target.value);
    if (isNaN(valor)) valor = 0;
    if (valor > saldoRestante) valor = saldoRestante;
    setPagoActual({ ...pagoActual, monto: valor });
  };

  if (!isOpen) return null;

  const inputClassName = `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${input}`;
  const labelClassName = `block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`;

  if (mostrarExito) {
    return (
      <div className={modalOverlay}>
        <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center text-center border ${modalContent}`}>
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className={`relative p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <FiCheckCircle className="text-emerald-500 text-6xl" />
            </div>
          </div>
          <h2 className={`text-2xl font-black ${heading} mb-2`}>Pedido Realizado!</h2>
          <p className={`${textTertiary} mb-6 text-sm`}>El pago se ha procesado correctamente.</p>
          <div className={`rounded-xl p-4 w-full border mb-8 space-y-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
            <div className={`flex justify-between items-center border-b pb-2 ${border}`}>
              <span className={`text-xs font-bold uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total Pagado</span>
              <span className={`text-xl font-black ${heading}`}>S/ {total.toFixed(2)}</span>
            </div>
          </div>
          {conEnvio && (
            <div className={`rounded-xl p-3 w-full border mb-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center gap-2">
                <FiTruck style={{ color: colors[500] }} />
                <span className={`font-bold text-sm ${heading}`}>Envio a domicilio</span>
              </div>
              <p className={`text-xs mt-1 ${textTertiary}`}>{direccionEnvio}</p>
              <p className="text-xs text-yellow-500 mt-1">Estado: PENDIENTE</p>
            </div>
          )}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                const now = new Date();
                const fecha = `${now.toLocaleDateString('es-PE')} ${now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
                const clienteNombre = cliente?.persona?.nombres
                  ? `${cliente.persona.nombres} ${cliente.persona.apellidoPaterno || ''}`
                  : 'Cliente General';
                const pagosHtml = detallesPago.map(p => {
                  const metodo = metodosPago.find(m => m.id === p.id_metodo_pago);
                  return `<tr><td>${metodo?.nombre || 'Pago'}</td><td class="price">S/ ${p.monto.toFixed(2)}</td></tr>`;
                }).join('');
                const pw = window.open('', '_blank');
                if (!pw) return;
                pw.document.write(`<html><head><title>Ticket</title><style>
                  body{font-family:'Courier New',monospace;width:80mm;margin:0 auto;padding:10px;font-size:12px}
                  .text-center{text-align:center}.font-bold{font-weight:bold}.text-lg{font-size:16px}
                  .text-xl{font-size:20px}.my-2{margin:8px 0}.border-dashed{border-top:1px dashed #000}
                  table{width:100%;border-collapse:collapse}td{padding:2px 4px}.price{text-align:right}
                  @media print{body{width:80mm}}
                </style></head><body>
                  <div class="text-center"><div class="font-bold text-lg">PERU MARKET</div><div>BOLETA DE VENTA</div></div>
                  <div class="border-dashed my-2"></div>
                  <div>Fecha: ${fecha}</div><div>Cliente: ${clienteNombre}</div>
                  <div class="border-dashed my-2"></div>
                  <div class="font-bold">Pagos:</div>
                  <table>${pagosHtml}</table>
                  <div class="border-dashed my-2"></div>
                  <div style="display:flex;justify-content:space-between"><span class="font-bold text-lg">TOTAL:</span><span class="font-bold text-lg">S/ ${total.toFixed(2)}</span></div>
                  <div class="border-dashed my-2"></div>
                  <div class="text-center">Gracias por su compra!</div>
                </body></html>`);
                pw.document.close();
                pw.print();
              }}
              className={`w-full border py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-gray-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <FiPrinter className={isDark ? 'text-gray-500' : 'text-gray-400'} /> Imprimir Ticket
            </button>
            <button
              onClick={handleFinalizarReal}
              className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform active:scale-95 btn-primary"
            >
              Finalizar y Cerrar <FiArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={modalOverlay}>
      <div className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border ${modalContent}`}>

        {/* Header */}
        <div className={`p-5 border-b flex justify-between items-center ${border}`}>
          <h3 className={`text-xl font-bold ${heading} flex items-center gap-2`}>
            <div className="p-2 rounded-lg" style={{ backgroundColor: isDark ? `${colors[900]}40` : colors[50], color: colors[500] }}>
              <FaWallet size={20} />
            </div>
            Procesar Pago
          </h3>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <FiX size={18} />
          </button>
        </div>

        <div className={`overflow-y-auto p-6 space-y-6 ${isDark ? 'bg-gray-850' : 'bg-gray-50/50'}`}>

          {/* Sale Summary */}
          <div className={`rounded-xl p-5 shadow-sm border flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: colors[500] }}>
                {cliente?.persona.nombres.charAt(0)}
              </div>
              <div>
                <span className={`text-xs ${textTertiary} font-medium`}>Cliente</span>
                <p className={`font-bold text-sm ${heading}`}>{cliente?.persona.nombres} {cliente?.persona.apellidoPaterno}</p>
              </div>
            </div>
            <div className={`text-right border-t sm:border-t-0 sm:border-l pt-2 sm:pt-0 sm:pl-6 w-full sm:w-auto ${border}`}>
              <span className={`text-xs ${textTertiary} font-medium`}>Total a Pagar</span>
              <p className="text-2xl font-black tracking-tight" style={{ color: colors[500] }}>S/ {total.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: Payment form */}
            <div className="space-y-5">
              <div className={`p-5 rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-bold mb-4 flex items-center gap-2 text-sm ${heading}`}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: colors[500] }}>1</span>
                  Seleccionar Método
                </h4>

                {/* Method Grid */}
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
                            ? `ring-1 shadow-sm`
                            : `${isDark ? 'border-gray-600 bg-gray-700 text-gray-400 hover:bg-gray-600' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-white hover:shadow-md'}`
                        }`}
                        style={isSelected ? {
                          borderColor: colors[500],
                          backgroundColor: isDark ? `${colors[900]}30` : colors[50],
                          color: colors[600],
                          boxShadow: `0 0 0 1px ${colors[500]}`
                        } : undefined}
                      >
                        <Icono className={`mb-1.5 ${isSelected ? '' : 'opacity-70'} ${isSelected ? '' : color}`} size={20} style={isSelected ? { color: colors[500] } : undefined} />
                        <span className="text-[10px] font-bold leading-tight">{metodo.nombre}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <label className={labelClassName}>Monto a Pagar</label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>S/</span>
                    <input
                      type="number"
                      value={pagoActual.monto}
                      onChange={handleMontoChange}
                      className={`${inputClassName} pl-8 font-bold`}
                      min={0}
                      max={saldoRestante}
                      step={0.01}
                      disabled={saldoRestante <= 0}
                    />
                  </div>
                </div>

                {/* Dynamic fields */}
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
                          <div className="space-y-3">
                            <div>
                              <label className={labelClassName}>Número de Tarjeta</label>
                              <div className="relative">
                                <FiCreditCard className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
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
                                <input type="text" value={pagoActual.fecha_vencimiento || ''} onChange={(e) => setPagoActual({ ...pagoActual, fecha_vencimiento: e.target.value })} placeholder="MM/AA" className={inputClassName} />
                              </div>
                              <div>
                                <label className={labelClassName}>CVV</label>
                                <input type="text" value={pagoActual.cvv || ''} onChange={(e) => setPagoActual({ ...pagoActual, cvv: e.target.value })} placeholder="123" className={inputClassName} />
                              </div>
                            </div>
                          </div>
                        );
                      case 4:
                        return (
                          <div className="space-y-3">
                            <div>
                              <label className={labelClassName}>Banco de Origen</label>
                              <div className="relative">
                                <FaUniversity className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                <select value={pagoActual.banco || ''} onChange={(e) => setPagoActual({ ...pagoActual, banco: e.target.value })} className={`${inputClassName} pl-10 appearance-none`}>
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
                              <input type="text" value={pagoActual.numero_transferencia || ''} onChange={(e) => setPagoActual({ ...pagoActual, numero_transferencia: e.target.value })} placeholder="Ej: 12345678" className={inputClassName} />
                            </div>
                          </div>
                        );
                      case 5:
                      case 6:
                        return (
                          <div className="space-y-3">
                            <div>
                              <label className={labelClassName}>Nro. Celular</label>
                              <div className="relative">
                                <FiSmartphone className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                <input type="text" value={pagoActual.referencia || ''} onChange={(e) => setPagoActual({ ...pagoActual, referencia: e.target.value })} placeholder="999 999 999" className={`${inputClassName} pl-10`} />
                              </div>
                            </div>
                            <div>
                              <label className={labelClassName}>Código de Operación</label>
                              <input type="text" value={pagoActual.numero_operacion || ''} onChange={(e) => setPagoActual({ ...pagoActual, numero_operacion: e.target.value })} placeholder="Ej: 123456" className={inputClassName} />
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
                  disabled={saldoRestante <= 0}
                  className={`w-full py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-bold text-sm transform active:scale-95 ${
                    saldoRestante <= 0
                      ? `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                      : 'btn-primary hover:shadow-lg'
                  }`}
                >
                  <FiCheckCircle className={saldoRestante <= 0 ? (isDark ? "text-gray-500" : "text-gray-400") : ""} />
                  {saldoRestante <= 0 ? 'Monto Completado' : 'Agregar al Pago'}
                </button>
              </div>
            </div>

            {/* Right: Payment list and totals */}
            <div className="flex flex-col h-full">
              <h4 className={`font-bold mb-4 flex items-center gap-2 text-sm px-1 ${heading}`}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: colors[500] }}>2</span>
                Desglose de Pagos
              </h4>

              <div className={`flex-1 rounded-xl shadow-sm border overflow-hidden flex flex-col mb-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px] max-h-[300px] custom-scrollbar">
                  {detallesPago.length === 0 ? (
                    <div className={`h-full flex flex-col items-center justify-center ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                      <FiFileText size={40} className="mb-2 opacity-50" />
                      <p className="text-sm font-medium">Sin pagos registrados</p>
                    </div>
                  ) : (
                    detallesPago.map((pago, index) => {
                      const { Icono, color } = getIconoMetodo(pago.id_metodo_pago);
                      return (
                        <div key={index} className={`flex items-center justify-between p-3 border rounded-xl transition-colors group ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="flex items-center flex-1">
                            <div className={`p-2 rounded-lg border mr-3 shadow-sm ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-100'}`}>
                              <Icono className={color} size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{getMetodoPagoNombre(pago.id_metodo_pago)}</div>
                              <div className={`flex gap-2 text-[10px] ${textTertiary} uppercase tracking-wide`}>
                                {pago.referencia && <span>Ref: {pago.referencia}</span>}
                                {pago.numero_operacion && <span>Op: {pago.numero_operacion}</span>}
                                {pago.banco && <span>{pago.banco}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-bold ${heading}`}>S/ {pago.monto.toFixed(2)}</span>
                            <button onClick={() => eliminarPago(index)} className={`p-1 rounded-md transition-colors ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}>
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Totals footer */}
                <div className={`p-4 border-t space-y-2 ${isDark ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between text-sm">
                    <span className={textTertiary}>Total Venta</span>
                    <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={textTertiary}>Total Agregado</span>
                    <span className="font-bold text-emerald-600">S/ {totalPagado.toFixed(2)}</span>
                  </div>
                  <div className={`mt-3 pt-3 border-t flex justify-between items-center ${border} ${saldoRestante > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    <span className="font-bold text-sm uppercase">{saldoRestante > 0 ? 'Restante por pagar' : 'Pago Completo'}</span>
                    <span className="text-xl font-black">S/ {saldoRestante.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-5 border-t flex gap-3 justify-end ${border} ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl border transition-all text-sm font-bold ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={saldoRestante > 0}
            className={`px-8 py-2.5 rounded-xl shadow-lg transition-all text-sm font-bold flex items-center gap-2 transform active:scale-95 ${
              saldoRestante <= 0
                ? 'btn-primary hover:shadow-xl'
                : `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed shadow-none`
            }`}
          >
            <FiCheckCircle /> Confirmar y Emitir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPago;
