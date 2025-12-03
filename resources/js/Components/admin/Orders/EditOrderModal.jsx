import { useState, useEffect } from "react";

export default function EditOrderModal({ order, setOrder, onSave, onClose }) {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    // Traer los estados (solo los que correspondan)
    fetch("/admin/orders/meta")
      .then((res) => res.json())
      .then((data) => {
        setStatuses(data.statuses);
      })
      .catch((err) => console.error("Error cargando estados:", err));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Editar Estado Pedido #{order.id}</h3>

        <div className="grid gap-3">
          <label>
            Estado:
            <select
              className="w-full border rounded px-2 py-1"
              value={order.status_id}
              onChange={(e) =>
                setOrder({ ...order, status_id: parseInt(e.target.value) })
              }
            >
              {statuses
                .filter((s) => s.id === 1 || s.id === 4) // solo pendiente o entregado
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={onSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
