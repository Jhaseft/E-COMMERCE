import { useState } from 'react';

export default function Products() {
  const [products] = useState([
    { id: 1, name: 'Laptop Gaming', price: 1200, image: '' },
    { id: 2, name: 'Auriculares', price: 150, image: '' },
    { id: 3, name: 'Mouse RGB', price: 80, image: '' },
  ]);

  return (
    <section>
      <h2 className="text-3xl font-semibold text-center mb-8 text-brandBlack  dark:text-white">
        Productos Disponibles
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-brandBlack dark:text-white">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                ${product.price}
              </p>
              <button className="mt-4 w-full bg-brandGold text-brandBlack py-2 rounded-lg hover:bg-[#bfa333] transition">
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
