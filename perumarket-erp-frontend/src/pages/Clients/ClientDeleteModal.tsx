interface Props {
  visible: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ClienteDeleteModal({ visible, message, onCancel, onConfirm }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
        <p className="text-sm mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
