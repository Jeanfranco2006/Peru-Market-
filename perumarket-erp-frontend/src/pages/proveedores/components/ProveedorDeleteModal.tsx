import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombreProveedor?: string;
}

export default function ProveedorDeleteModal({ isOpen, onClose, onConfirm, nombreProveedor }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full border-t-8 border-indigo-600 animate-fadeInUp">
         <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase">Confirmar Baja</h2>
         <p className="text-sm text-slate-600 mb-8 font-medium">
           ¿Estás seguro de dar de baja al proveedor?
           <strong className="text-slate-900 block mt-2 text-lg">{nombreProveedor}</strong>
         </p>
         <div className="flex gap-3">
           <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 rounded-lg bg-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-300 transition-all">
             Cancelar
           </button>
           <button onClick={onConfirm} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700    shadow-lg transition-all">
             Confirmar Baja
           </button>
         </div>
      </div>
    </div>
  );
}