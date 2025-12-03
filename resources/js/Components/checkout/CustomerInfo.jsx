export default function CustomerInfoForm({ customerName, setCustomerName, customerPhone, setCustomerPhone }) {
    return (
        <div className="border border-gray-700 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2 text-white">Datos del Cliente</h3>

            <label className="block text-gray-300 mb-1">Nombre completo</label>
            <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 rounded bg-black text-white mb-2 border border-gray-600"
                placeholder="Ingresa tu nombre"
            />

            <label className="block text-gray-300 mb-1">Número de teléfono</label>
            <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2 rounded bg-black text-white mb-2 border border-gray-600"
                placeholder="Ingresa tu número"
            />

            <p className="text-gray-400 text-sm">
                Estos datos se usarán para tu pedido. No se requieren inicio de sesión.
            </p>
        </div>
    );
}
