import { useEffect, useState } from 'react';
import SearchBar from '@/Components/welcome/Search';
import { useCart } from '@/Contexts/CartContext';
import CategoryFilter from './CategoryFilter';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const { addToCart } = useCart();
////////////////////////////////Super importante/////////////////////////////////////////////////////////
  const priorityCategories = ['Destacados', 'Ofertas'];
/////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setLoading(true);
    fetch('/products')
      .then(res => res.json())
      .then(data => {
        let cats = Array.isArray(data) ? data : [];
        // Ordenar categorías prioritarias al inicio
        cats.sort((a, b) => {
          const indexA = priorityCategories.indexOf(a.name);
          const indexB = priorityCategories.indexOf(b.name);
          if (indexA !== -1 || indexB !== -1) return indexA !== -1 ? -1 : 1;
          return 0;
        });
        setCategories(cats);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar productos:', err);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product) => {
    if (product.stock === 0) return;
    setAddingId(product.id);
    await addToCart({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      cantidad: 1,
      image: product.image || 'https://via.placeholder.com/100',
    });
    setAddingId(null);
    setSuccessId(product.id);
    setTimeout(() => setSuccessId(null), 1500);
  };

  if (loading) {
    return <p className="text-center mt-8 text-gray-600">Cargando productos...</p>;
  }

  const displayedCategories = selectedCategory
    ? categories.filter(cat => cat.name === selectedCategory)
    : categories;

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <SearchBar onSearch={setSearchTerm} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {displayedCategories.map((category, idx) => {
        const filteredProducts = category.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredProducts.length === 0) return null;

        // Condiciones de carrusel según dispositivo
        const isMobileCarousel = filteredProducts.length > 1;
        const isTabletCarousel = filteredProducts.length >= 2;
        const isDesktopCarousel = filteredProducts.length > 3;

        return (
          <div key={category.id} className="mb-12">
            {/* Separador */}
            {idx !== 0 && <hr className="my-8 border-gray-300 dark:border-gray-600" />}

            {/* Nombre de categoría */}
            <h2 className="text-3xl font-semibold text-brandBlack dark:text-white mb-2">
              {category.name}
            </h2>

            {/* Descripción de categoría */}
            {category.description && (
              <p className="text-gray-500 dark:text-gray-300 mb-6">{category.description}</p>
            )}

            {(isDesktopCarousel || isTabletCarousel || isMobileCarousel) ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={isDesktopCarousel || isTabletCarousel}
                pagination={false}
                autoplay={isDesktopCarousel ? { delay: 2000, disableOnInteraction: false } : false}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {filteredProducts.map(product => (
                  <SwiperSlide key={product.id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={handleAddToCart}
                      addingId={addingId}
                      successId={successId}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    handleAddToCart={handleAddToCart}
                    addingId={addingId}
                    successId={successId}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function ProductCard({ product, handleAddToCart, addingId, successId }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`bg-white dark:bg-zinc-800 rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'opacity-70' : ''}`}>
      <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/600x400'}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-brandBlack dark:text-white">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-300 mt-2">{product.description}</p>
        <p className={`mt-2 font-semibold ${isOutOfStock ? 'text-red-500' : 'text-gray-700 dark:text-gray-100'}`}>
          {isOutOfStock ? 'No disponible' : `Stock: ${product.stock}`}
        </p>
        <p className="mt-4 font-bold text-lg text-gray-800 dark:text-gray-100">Bs{Number(product.price).toFixed(2)}</p>

        <button
          onClick={() => handleAddToCart(product)}
          disabled={addingId === product.id || isOutOfStock}
          className={`mt-6 w-full py-3 rounded-xl transition ${
            addingId === product.id
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-brandGold text-brandBlack hover:bg-[#bfa333]'
          }`}
        >
          {isOutOfStock
            ? 'No disponible'
            : addingId === product.id
            ? 'Agregando...'
            : successId === product.id
            ? '¡Agregado!'
            : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
