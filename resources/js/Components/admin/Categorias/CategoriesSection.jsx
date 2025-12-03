import { useState } from "react";
import CategoryToolbar from "./CategoryToolbar";
import CategoryModal from "./CategoryModal";
import CategoryList from "./CategoryList";
import CategoryPagination from "./CategoryPagination";

export default function CategoriesSection({ categories: initialCategoriesData }) {
  const [categoriesData, setCategoriesData] = useState(initialCategoriesData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [search, setSearch] = useState(''); // estado del input
  const [typingTimeout, setTypingTimeout] = useState(null); // para debounce

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Limpiar timeout anterior
    if (typingTimeout) clearTimeout(typingTimeout);

    // Esperar 300ms antes de buscar
    setTypingTimeout(
      setTimeout(async () => {
        const perPage = categoriesData.per_page;
        const response = await fetch(`/admin/categories/paginate?page=1&perPage=${perPage}&search=${encodeURIComponent(value)}`);
        setCategoriesData(await response.json());
      }, 300)
    );
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const refreshPage = async (page = 1) => {
    const perPage = categoriesData.per_page;
    const response = await fetch(`/admin/categories/paginate?page=${page}&perPage=${perPage}&search=${encodeURIComponent(search)}`);
    setCategoriesData(await response.json());
  };


  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 max-w-4xl w-[95%] sm:w-full text-gray-700">
      <h2 className="text-3xl text-center font-bold mb-6">Categorías</h2>
      <form onSubmit={handleSearchChange} className="mb-4 ">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

      </form>
      <CategoryToolbar
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        openCreate={() => { setEditingCategory(null); setModalOpen(true); }}
        refresh={refreshPage}
      />

      <CategoryModal
        open={modalOpen}
        close={() => setModalOpen(false)}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        refresh={refreshPage}
        categories={categoriesData.data} // enviar categorías para selector padre
      />

      <CategoryList
        categories={categoriesData.data}
        selectionMode={selectionMode}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onEdit={openEditModal}
      />

      <CategoryPagination
        current={categoriesData.current_page}
        last={categoriesData.last_page}
        goToPage={refreshPage}
      />
    </div>
  );
}
