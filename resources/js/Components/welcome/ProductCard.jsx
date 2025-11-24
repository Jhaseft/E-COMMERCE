export default function ProductCard({
  product,
  handleAddToCart,
  addingId,
  successId,
}) {
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-xl border
        ${isOutOfStock ? "border-red-600 opacity-80" : "border-[#D4AF37]"}
        bg-gray-900 text-white
        hover:scale-105 hover:shadow-2xl
        transition-all duration-300
        font-poppins
        
      `}
    >
      {/* Cinta de Agotado */}
      {isOutOfStock && (
        <div className="absolute top-3 left-0 bg-red-600 text-[#D4AF37] px-4 py-1 text-base font-extrabold rounded-r-lg shadow-md z-10 font-poppins">
          AGOTADO
        </div>
      )}

    

      {/* Imagen del producto */}
      <div className="w-full h-80 sm:h-72 lg:h-[25rem] overflow-hidden rounded-t-2xl">
        <img
          src={product.image || "https://via.placeholder.com/600x400"}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-4">

        {/* Título en Playfair Display */}
        <h3 className="text-3xl font-extrabold text-[#D4AF37] leading-tight tracking-wide drop-shadow-md font-playfair">
          {product.name}
        </h3>

        {/* Descripción */}
        <p className="text-gray-300 text-lg leading-relaxed font-poppins">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2 ">

          {/* Stock */}
          <span
            className={`px-2 py-2 text-xs sm:text-base font-bold rounded-full border font-poppins
    ${isOutOfStock
                ? "bg-red-600 text-white border-red-700"
                : "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]"
              }
  `}
          >
            {isOutOfStock ? "Sin stock" : `Stock: ${product.stock}`}
          </span>

          {/* Precio en Playfair */}
          <p className="text-3xl font-black text-[#D4AF37] drop-shadow-lg font-playfair">
            Bs {Number(product.price).toFixed(2)}
          </p>
        </div>

        {/* Botón */}
        <button
          onClick={() => handleAddToCart(product)}
          disabled={addingId === product.id || isOutOfStock}
          className={`
            mt-3 w-full py-3 rounded-xl text-xl font-extrabold tracking-wider
            transition-all shadow-lg font-poppins
            ${addingId === product.id
              ? "bg-gray-600 text-white cursor-not-allowed"
              : successId === product.id
                ? "bg-red-700 text-[#D4AF37]"
                : "bg-red-600 text-[#D4AF37] hover:bg-red-700"
            }
          `}
        >
          {isOutOfStock
            ? "No disponible"
            : addingId === product.id
              ? "Agregando..."
              : successId === product.id
                ? "¡Agregado!"
                : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
