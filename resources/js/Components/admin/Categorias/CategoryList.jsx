import CategoryRow from "./CategoryRow";

export default function CategoryList({
  categories,
  selectionMode,
  selectedIds,
  setSelectedIds,
  onEdit,
  level = 0 // nivel de anidación
}) {
  const toggle = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (!categories || categories.length === 0)
    return <p className="text-gray-500">No hay categorías registradas.</p>;

  return (
    <div className="space-y-4">
      {categories.map(cat => (
        <div key={cat.id} className="pl-4" style={{ paddingLeft: `${level * 20}px` }}>
          <CategoryRow
            category={cat}
            isSelectable={selectionMode}
            selected={selectedIds.includes(cat.id)}
            onSelect={toggle}
            onEdit={onEdit}
            onView={() => console.log("Ver productos de:", cat.id)}
          />

          {/* Renderizar subcategorías recursivamente */}
          {cat.children && cat.children.length > 0 && (
            <CategoryList
              categories={cat.children}
              selectionMode={selectionMode}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              onEdit={onEdit}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}
