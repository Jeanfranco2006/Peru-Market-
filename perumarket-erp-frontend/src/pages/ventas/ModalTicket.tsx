import React from 'react';
import { useThemeClasses } from '../../hooks/useThemeClasses';

interface ModalTicketProps {
  isOpen: boolean;
  onClose: () => void;
  venta: any;
}

const ModalTicket: React.FC<ModalTicketProps> = ({ isOpen, onClose, venta }) => {
  const { isDark, colors } = useThemeClasses();

  if (!isOpen) return null;
  if (!venta) return null;

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${HH}:${min}`;
  };

  const formatPrice = (value: number) => {
    return `S/ ${Number(value).toFixed(2)}`;
  };

  const handlePrint = () => {
    const ticketContent = document.getElementById('ticket-content');
    if (!ticketContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket Venta #${venta.id}</title>
          <style>
            body { font-family: 'Courier New', monospace; width: 80mm; margin: 0 auto; padding: 10px; font-size: 12px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .text-lg { font-size: 16px; }
            .text-xl { font-size: 20px; }
            .my-2 { margin: 8px 0; }
            .border-dashed { border-top: 1px dashed #000; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 2px 4px; text-align: left; }
            .price { text-align: right; }
            @media print { body { width: 80mm; } }
          </style>
        </head>
        <body>${ticketContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const detalles = venta.detalles || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Ticket content - always white bg, black text, monospace */}
        <div
          id="ticket-content"
          className="bg-white text-black font-mono p-6 mx-4 mt-4 rounded-lg"
          style={{ fontSize: '12px' }}
        >
          {/* Header */}
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold">PERU MARKET</h2>
            <p className="text-xs">RUC: 20XXXXXXXXX</p>
            <p className="text-xs font-bold mt-1">BOLETA DE VENTA ELECTRONICA</p>
          </div>
          <div className="border-t border-dashed border-gray-400 my-2" />

          {/* Sale info */}
          <div className="text-xs space-y-1 mb-2">
            <p className="font-bold">Venta #{venta.id}</p>
            <p>Fecha: {formatFecha(venta.fecha)}</p>
            <p>Cliente: {venta.nombreCliente || 'Cliente General'}</p>
            <p>Vendedor: {venta.nombreUsuario}</p>
            <p>Almacen: {venta.nombreAlmacen}</p>
          </div>
          <div className="border-t border-dashed border-gray-400 my-2" />

          {/* Products table */}
          <div className="mb-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="font-bold">
                  <th className="text-left py-1">Producto</th>
                  <th className="text-center py-1">Cant.</th>
                  <th className="text-right py-1">P.Unit</th>
                  <th className="text-right py-1">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-2 text-gray-500">
                      Sin productos
                    </td>
                  </tr>
                ) : (
                  detalles.map((detalle: any, index: number) => (
                    <tr key={index}>
                      <td className="text-left py-0.5 max-w-[120px] truncate">
                        {detalle.nombreProducto}
                      </td>
                      <td className="text-center py-0.5">{detalle.cantidad}</td>
                      <td className="text-right py-0.5">
                        {formatPrice(detalle.precioUnitario)}
                      </td>
                      <td className="text-right py-0.5">
                        {formatPrice(detalle.subtotal)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-dashed border-gray-400 my-2" />

          {/* Totals */}
          <div className="text-xs space-y-1 mb-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(venta.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IGV (18%):</span>
              <span>{formatPrice(venta.igv)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm mt-1">
              <span>TOTAL:</span>
              <span>{formatPrice(venta.total)}</span>
            </div>
          </div>
          <div className="border-t border-dashed border-gray-400 my-2" />

          {/* Footer */}
          <div className="text-center text-xs mt-2">
            <p className="font-bold">Gracias por su compra!</p>
            <p className="mt-1 text-gray-500">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Buttons - outside ticket-content, not printed */}
        <div className="flex gap-3 p-4 justify-end">
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl transform active:scale-95"
            style={{ backgroundColor: colors[600] }}
          >
            Imprimir Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTicket;
