import { useState, useEffect } from "react";

export default function CategoryModal({
  open,
  close,
  editingCategory,
  setEditingCategory,
  refresh,
  categories = [] // lista de categorías para parent_id
}) {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description || "");
      setParentId(editingCategory.parent_id || null);
    } else {
      setName("");
      setDescription("");
      setParentId(null);
    }
  }, [editingCategory]);

  const save = async () => {
    if (!name.trim()) return alert("Ingresa un nombre válido");

    setLoading(true);

    const url = editingCategory ? `/admin/categories/${editingCategory.id}` : "/admin/categories";
    const method = editingCategory ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ name, description, parent_id: parentId })
    });

    setLoading(false);
    close();
    refresh();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
        <h3 className="text-xl font-semibold mb-4">
          {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
        </h3>

        <input
          type="text"
          className="w-full px-3 py-2 mb-3 border rounded-lg"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <textarea
          className="w-full px-3 py-2 mb-3 border rounded-lg resize-none"
          rows={3}
          placeholder="Descripción (opcional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {/* Selector de categoría padre */}
        <select
          className="w-full px-3 py-2 mb-3 border rounded-lg"
          value={parentId || ""}
          onChange={e => setParentId(e.target.value || null)}
        >
          <option value="">Categoría raíz</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
