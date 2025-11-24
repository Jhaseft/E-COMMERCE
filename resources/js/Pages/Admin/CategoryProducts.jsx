import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import ProductFormModal from "@/Components/admin/Categorias/ProductFormModal";

export default function CategoryProducts({ category, products }) {
  const [productList, setProductList] = useState(products.data);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [fullscreenMessage, setFullscreenMessage] = useState(null); // mensaje fullscreen
  const [deleting, setDeleting] = useState(false); // spinner durante eliminación

  // Guardar producto
  const handleSaveProduct = (savedProduct, isEdit) => {
    if (isEdit) {
      setProductList(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
      setFullscreenMessage("Producto actualizado correctamente.");
    } else {
      setProductList(prev => [savedProduct, ...prev]);
      setFullscreenMessage("Producto agregado correctamente.");
    }
    setModalOpen(false);
    setTimeout(() => setFullscreenMessage(null), 2000);
  };

  // Eliminar producto con spinner
  const handleDeleteProduct = async (productId) => {
    if (!confirm("¿Eliminar producto?")) return;

    setDeleting(true); // mostrar spinner
    try {
      const res = await fetch(`/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
      });
      const json = await res.json();
      if (json.status === "success") {
        setProductList(prev => prev.filter(p => p.id !== productId));
        setFullscreenMessage("Producto eliminado correctamente.");
        setTimeout(() => setFullscreenMessage(null), 2000);
      } else {
        alert("Error al eliminar producto");
        console.error(json);
      }
    } catch (err) {
      console.error(err);
      alert("Error en la solicitud");
    } finally {
      setDeleting(false); // ocultar spinner
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 relative">
      <Head title={`Productos de ${category.name}`} />

      {/* Spinner fullscreen durante eliminación */}
      {deleting && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center z-50">
          <div className="w-16 h-16 border-4 border-t-pink-600 border-gray-300 rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold text-gray-800">Eliminando producto...</p>
        </div>
      )}

      {/* Mensaje fullscreen */}
      {fullscreenMessage && !deleting && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex justify-center items-center z-50 animate-fade">
          <p className="text-2xl font-bold text-green-600">{fullscreenMessage}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <button
          className="px-4 py-2 bg-gray-800 text-white rounded-xl shadow hover:bg-gray-900"
          onClick={() =>  router.visit('/admin/dashboard')}
        >
          ← Volver
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
          onClick={() => { setEditingProduct(null); setModalOpen(true); }}
        >
          + Agregar producto
        </button>
      </div>

      <h2 className="text-3xl sm:text-4xl font-semibold text-center mr-52 mb-4 text-brandBlack dark:text-white">
        Productos de <span className="text-pink-600">{category.name}</span>
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-12">
        {category.description}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productList.length === 0 && (
          <p className="text-gray-500 dark:text-gray-300 text-center col-span-full">
            No hay productos en esta categoría.
          </p>
        )}

        {productList.map(product => (
          <div
            key={product.id}
            className="bg-white dark:bg-zinc-800 rounded-2xl shadow hover:scale-105 transition-transform duration-300 overflow-hidden"
          >
            <div className="w-full h-64 sm:h-72 lg:h-80 overflow-hidden">
              <img
                src={product.image || "https://via.placeholder.com/600x400"}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-brandBlack dark:text-white">
                {product.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 mt-1 text-sm sm:text-base">
                {product.description || "Sin descripción"}
              </p>
              <p className="text-gray-700 dark:text-gray-100 mt-2">
                Stock: {product.stock}
              </p>
              <p className="text-gray-700 dark:text-gray-100 mt-2 font-bold text-base sm:text-lg">
                Bs {Number(product.price).toFixed(2)}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                  onClick={() => { setEditingProduct(product); setModalOpen(true); }}
                >
                  Editar
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {products.links.map((link, index) => (
          <button
            key={index}
            disabled={!link.url}
            onClick={() => {
              if (!link.url) return;
              const url = new URL(link.url);
              const page = url.searchParams.get('page');
              router.visit(route('admin.categories.products', { category: category.id, page }));
            }}
            className={`px-3 py-1 rounded-lg font-semibold transition 
        ${link.active
                ? "bg-pink-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
              }`}
          >
            {link.label.replace("&raquo;", "»").replace("&laquo;", "«")}
          </button>
        ))}
      </div>

      {modalOpen && (
        <ProductFormModal
          categoryId={category.id}
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </section>
  );
}
