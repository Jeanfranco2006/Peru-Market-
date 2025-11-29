// components/ModalConfirmarLogout.tsx
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ModalConfirmarLogoutProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalConfirmarLogout({ 
  isOpen, 
  onConfirm, 
  onCancel 
}: ModalConfirmarLogoutProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cerrar Sesión
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-2">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>
          <p className="text-sm text-gray-500">
            Serás redirigido a la página de inicio de sesión.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Sí, Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}