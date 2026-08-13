import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../DataTable';

export default function ProductList({
  data,
  loading,
  categories,
  categoriasElectrodomestico,
  searchTerm,
  setSearchTerm,
  onAdd,
  onEdit,
  onDelete,
  canCreate,
  canUpdate,
  canDelete,
}) {
  const [isMobile, setIsMobile] = useState(false);

  const getCategoryName = useCallback(
    (categoryId) => categories.find((cat) => cat.id === categoryId)?.name || 'N/A',
    [categories]
  );

  const getCategoriaElectrodomesticoId = useCallback((item) => {
    return (
      item?.categoriaElectrodomesticoId ??
      item?.categoriaElectrodomestico?.id ??
      ''
    );
  }, []);

  const getCategoriaElectrodomesticoName = useCallback(
    (item) => {
      const directName = item?.categoriaElectrodomestico?.nombre
        || item?.categoriaElectrodomesticoNombre
        || item?.categoriaElectrodomesticoName;
      if (directName) return directName;

      const categoriaId = getCategoriaElectrodomesticoId(item);
      if (!categoriaId) return 'N/A';
      const match = categoriasElectrodomestico.find((cat) => String(cat.id) === String(categoriaId));
      return match?.nombre || 'N/A';
    },
    [categoriasElectrodomestico, getCategoriaElectrodomesticoId]
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredData = useMemo(() => {
    if (!isMobile || !searchTerm.trim()) return data;
    const query = searchTerm.toLowerCase();

    return data.filter((item) => {
      const categoryName = getCategoryName(item.categoryId);
      const values = [
        item?.id,
        item?.name,
        item?.description,
        categoryName,
        getCategoriaElectrodomesticoName(item),
        item?.categoriaElectrodomestico,
        item?.categoriaElectrodomesticoNombre,
        item?.categoriaElectrodomesticoName
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return values.some((value) => value.includes(query));
    });
  }, [data, isMobile, searchTerm, getCategoryName, getCategoriaElectrodomesticoName]);

  if (loading) return <div className="p-8 text-center">Cargando products...</div>;

  return (
    <div className="p-1 md:p-2">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <h3 className="text-sm md:text-base font-bold">Listado de Productos</h3>
        {canCreate && (
          <button
            onClick={onAdd}
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            Crear Producto
          </button>
        )}
      </div>

      {isMobile && (
        <div className="md:hidden mb-2 space-y-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, nombre, descripción o categoría..."
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {canCreate && (
            <button
              onClick={onAdd}
              className="w-full h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Crear Producto
            </button>
          )}
        </div>
      )}

      <DataTable
        data={filteredData}
        columns={[
          { key: 'id', label: 'ID', sortable: true, filterable: true },
          { key: 'name', label: 'Nombre', sortable: true, filterable: true },
          { key: 'description', label: 'Descripción', sortable: true, filterable: true },
          {
            key: 'categoryId',
            label: 'Categoría',
            sortable: true,
            filterable: true,
            render: (item) => getCategoryName(item.categoryId)
          },
          {
            key: 'categoriaElectrodomesticoId',
            label: 'Tipo Electrodoméstico',
            sortable: true,
            filterable: true,
            render: (item) => getCategoriaElectrodomesticoName(item)
          },
          { key: 'quantity', label: 'Cantidad', sortable: true, filterable: false },
          { key: 'price', label: 'Precio', sortable: true, filterable: false },
          ...((canUpdate || canDelete) ? [{
            key: 'acciones',
            label: '',
            width: 44,
            headerClassName: 'px-1',
            cellClassName: 'px-1',
            sortable: false,
            filterable: false,
            render: (item) => (
              <div className="flex justify-center items-center gap-1 flex-nowrap">
                {canUpdate && (
                  <button
                    onClick={() => onEdit(item.id)}
                    className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white p-0.5 rounded transition-colors flex-shrink-0"
                    title="Editar"
                  >
                    <PencilIcon className="w-3 h-3" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-0.5 rounded transition-colors flex-shrink-0"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            )
          }] : [])
        ]}
      />
    </div>
  );
}
