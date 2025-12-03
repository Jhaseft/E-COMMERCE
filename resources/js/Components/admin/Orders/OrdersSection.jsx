import { useState, useEffect } from "react";
import ViewOrderModal from "./ViewOrderModal";
import EditOrderModal from "./EditOrderModal";
import GlobalSpinner from "./GlobalSpinner";

export default function OrdersSection() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/admin/orders?page=${page}&search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  const deleteOrder = async (id) => {
    if (!confirm("¿Seguro quieres eliminar esta orden?")) return;
    try {
      setGlobalLoading(true);
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

      const res = await fetch(`/admin/orders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (!res.ok) {
        console.error("Error al eliminar");
        return;
      }

      fetchOrders();
    } catch (err) {
      console.error("Error al eliminar:", err);
    } finally {
      setGlobalLoading(false);
    }
  };

  const openViewModal = async (id) => {
    const res = await fetch(`/admin/orders/${id}`);
    setSelectedOrder(await res.json());
  };

  const openEditModal = async (id) => {
    const res = await fetch(`/admin/orders/${id}`);
    setEditOrder(await res.json());
  };

  const saveEdit = async () => {
    try {
      setGlobalLoading(true);
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

      const res = await fetch(`/admin/orders/${editOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(editOrder),
      });

      if (!res.ok) {
        console.error("Error al guardar");
        return;
      }

      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Error guardando edición:", err);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 max-w-7xl w-full">
      <GlobalSpinner visible={globalLoading} />

      <h2 className="text-2xl text-center font-semibold mb-4 text-gray-800">
        Órdenes
      </h2>

      <div className="mb-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Buscar por cliente o ID..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-2 border">ID</th>
              <th className="py-2 px-2 border">Cliente</th>
              <th className="py-2 px-2 border">Total</th>
              <th className="py-2 px-2 border">Estado</th>
              <th className="py-2 px-2 border">Dirección</th>
              <th className="py-2 px-2 border">Fecha Entrega</th>
              <th className="py-2 px-2 border">Hora Entrega</th>
              <th className="py-2 px-2 border">Pago</th>
              <th className="py-2 px-2 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Cargando órdenes...</span>
                  </div>
                </td>
              </tr>
            ) : orders?.data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  No hay órdenes
                </td>
              </tr>
            ) : (
              orders.data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="text-center border px-2">{order.id}</td>
                  <td className="text-center border px-2">{order.customer_name || "-"}</td>
                  <td className="text-center border px-2">{order.total} bs</td>
                  <td className="text-center border px-2">{order.status?.name || "-"}</td>
                  <td className="text-center border px-2">{order.note || "-"}</td>
                  <td className="text-center border px-2">
                    {order.delivery_date ? order.delivery_date.split("T")[0] : "-"}
                  </td>
                  <td className="text-center border px-2">{order.delivery_time || "-"}</td>
                  <td className="text-center border px-2">
                    {order.payment_method?.name || "-"}
                  </td>

                  <td className="px-2 py-2 border flex flex-wrap gap-1 justify-center">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => openViewModal(order.id)}
                    >
                      Ver
                    </button>

                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => openEditModal(order.id)}
                    >
                      Editar
                    </button>

                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {orders && (
        <div className="flex justify-center mt-4 gap-3">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
            disabled={!orders.prev_page_url}
            onClick={() => setPage(page - 1)}
          >
            ←
          </button>

          <span className="font-semibold">{page}</span>

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
            disabled={!orders.next_page_url}
            onClick={() => setPage(page + 1)}
          >
            →
          </button>
        </div>
      )}

      {selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {editOrder && (
        <EditOrderModal
          order={editOrder}
          setOrder={setEditOrder}
          onSave={saveEdit}
          onClose={() => setEditOrder(null)}
        />
      )}
    </div>
  );
}
