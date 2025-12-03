  import { router } from "@inertiajs/react";

  export default function CategoryRow({
    category,
    isSelectable,
    selected,
    onSelect,
    onView,
    onEdit
  }) {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-4 rounded-lg shadow gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isSelectable && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect(category.id)}
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-gray-500 text-sm">
              {category.products_count} productos
            </p>
            <p className="text-gray-500 text-sm">{category.description || "Sin descripción"}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">

          <button
            className="text-yellow-600 font-semibold hover:text-yellow-800"
            onClick={() => onEdit(category)}
          >
            Editar
          </button>

          <button
            className="text-blue-600 font-semibold hover:text-blue-800"
            onClick={() => router.get(`/admin/categories/${category.id}/products`)}
          >
            Ver productos →
          </button>
        </div>
      </div>
    );
  }
