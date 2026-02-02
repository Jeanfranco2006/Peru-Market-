import { useThemeClasses } from '../../../hooks/useThemeClasses';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombreProveedor?: string;
}

export default function ProveedorDeleteModal({ isOpen, onClose, onConfirm, nombreProveedor }: Props) {
  const { isDark, heading, textTertiary } = useThemeClasses();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className={`${isDark ? 'bg-gray-800 border-t-8 border-indigo-500' : 'bg-white border-t-8 border-indigo-600'} rounded-xl p-8 shadow-2xl max-w-sm w-full animate-fadeInUp`}>
         <h2 className={`text-2xl font-black ${heading} mb-2 uppercase`}>Confirmar Baja</h2>
         <p className={`text-sm ${textTertiary} mb-8 font-medium`}>
           Estas seguro de dar de baja al proveedor?
           <strong className={`${heading} block mt-2 text-lg`}>{nombreProveedor}</strong>
         </p>
         <div className="flex gap-3">
           <button onClick={onClose} className={`flex-1 py-3 border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' : 'border-slate-200 bg-slate-200 text-slate-600 hover:bg-slate-300'} rounded-lg font-bold text-sm transition-all`}>
             Cancelar
           </button>
           <button onClick={onConfirm} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-lg transition-all">
             Confirmar Baja
           </button>
         </div>
      </div>
    </div>
  );
}
