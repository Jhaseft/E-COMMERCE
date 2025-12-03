import { useEffect, useState } from 'react';
import SearchBar from '@/Components/welcome/Search';
import { useCart } from '@/Contexts/CartContext';
import CategoryFilter from './CategoryFilter';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const { addToCart } = useCart();

  const priorityCategories = ['Destacados', 'Ofertas'];

  const EagleIcon = ({ size = 60 }) => (
    <img
      src="https://res.cloudinary.com/dcmjhycsr/image/upload/v1763825595/Captura_de_pantalla_2025-11-22_102220-removebg-preview_eur39c.png"
      alt="Águila"
      width={size}
      height={size}
      style={{ display: 'inline-block' }}
    />
  );

  useEffect(() => {
    setLoading(true);
    fetch('/products')
      .then(res => res.json())
      .then(data => {
        let cats = Array.isArray(data) ? data : [];

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
    return (
      <p className="text-center mt-8 text-[#D4AF37] text-xl animate-pulse">
        Cargando productos...
      </p>
    );
  }

  const displayedCategories = selectedCategory
    ? categories.filter(cat => cat.name === selectedCategory)
    : categories;

  return (
    <section className="px-4 sm:px-6 lg:px-8 text-white">

      <SearchBar onSearch={setSearchTerm} />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {displayedCategories.map((category, idx) => {
        const filteredProducts = category.products.filter(product => {
          const name = (product.name ?? "").toLowerCase();
          const search = searchTerm.toLowerCase();
          return name.includes(search);
        });

        const hasChildren = category.children && category.children.length > 0;

        return (
          <div key={category.id} className="mb-12">

            {idx !== 0 && (
              <div className="my-10 flex items-center gap-4">
                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
              </div>
            )}

            <div className="relative mb-8 select-none">
              <div className="absolute -top-3 left-0 w-28 h-1 bg-gradient-to-r from-[#D4AF37] to-[#f8e7a3] shadow-[0_0_10px_#D4AF37] rounded-full"></div>
              <h2 className="md:text-5xl text-4xl font-extrabold italic flex items-center gap-4 tracking-wide drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fcefc2]">
                <EagleIcon />
                {category.name}
              </h2>
              <div className="mt-3 h-1 w-full bg-gradient-to-r from-[#D4AF37]/90 to-transparent rounded-full shadow-[0_0_10px_#D4AF37]"></div>
            </div>

            {category.description && (
              <p className="text-gray-300 mb-8 text-lg italic pl-2">
                {category.description}
              </p>
            )}

            {filteredProducts.length > 0 && (
              <CategorySwiper
                products={filteredProducts}
                handleAddToCart={handleAddToCart}
                addingId={addingId}
                successId={successId}
              />
            )}

            {hasChildren && category.children.map((sub) => (
              <div key={sub.id} className="mt-10">
                <h3 className="text-3xl font-bold italic text-[#D4AF37] mb-4 pl-2">
                  {sub.name}
                </h3>

                <CategorySwiper
                  products={sub.products || []}
                  handleAddToCart={handleAddToCart}
                  addingId={addingId}
                  successId={successId}
                />
              </div>
            ))}

          </div>
        );
      })}
    </section>
  );
}

function CategorySwiper({ products, handleAddToCart, addingId, successId }) {
  if (!products || products.length === 0) return null;

  const isDesktopCarousel = products.length > 3;

  return isDesktopCarousel ? (
    <Swiper
      className="z-[1]"
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      style={{ '--swiper-navigation-color': '#000' }}
    >
      {products.map(product => (
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
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          handleAddToCart={handleAddToCart}
          addingId={addingId}
          successId={successId}
        />
      ))}
    </div>
  );
}
