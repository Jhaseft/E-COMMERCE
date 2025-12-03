export default function ViewOrderModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl overflow-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold mb-3">Detalle del Pedido #{order.id}</h3>

        <p><strong>Cliente:</strong> {order.customer_name} ({order.customer_phone})</p>
        <p><strong>Total:</strong> {order.total} bs</p>
        <p><strong>Estado:</strong> {order.status?.name}</p>
        <p><strong>Dirección:</strong> {order.note || "-"}</p>

        <h4 className="mt-4 mb-2 font-semibold">Productos</h4>
        <ul className="border rounded p-3 space-y-2">
          {order.items?.map((item) => (
            <li
              key={item.id}
              className="border-b py-2 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                {item.product?.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <div>{item.product?.name}</div>
                  <div className="text-sm text-gray-500">Stock: {item.product?.stock}</div>
                </div>
              </div>
              <span className="font-semibold">x{item.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="text-right mt-5">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
