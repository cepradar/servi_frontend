import React from 'react';
import DataTable from '../DataTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CategoryList({ data = [], actions = {}, permissions = {} }) {
  const { onEdit, onDelete, onAdd } = actions;
  const { create: canCreate, update: canUpdate, delete: canDelete } = permissions;

  return (
    <div className="p-1 md:p-2">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <h3 className="text-sm md:text-base font-bold">Listado de Categorías</h3>
        {canCreate && (
          <button
            onClick={onAdd}
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            Crear Categoría
          </button>
        )}
      </div>

      <DataTable
        data={data}
        columns={[
          { key: 'id', label: 'ID', sortable: true, filterable: true },
          { key: 'name', label: 'Nombre', sortable: true, filterable: true },
          { key: 'description', label: 'Descripción', sortable: true, filterable: true },
          ...((canUpdate || canDelete)
            ? [{
                key: 'acciones',
                label: '',
                width: 70,
                headerClassName: 'px-1',
                cellClassName: 'px-1',
                sortable: false,
                filterable: false,
                render: (item) => (
                  <div className="flex justify-center items-center gap-1 flex-nowrap">
                    {canUpdate && (
                      <button
                        onClick={() => onEdit(item.id)}
                        className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded transition-colors flex-shrink-0"
                        title="Editar"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors flex-shrink-0"
                        title="Eliminar"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ),
              }]
            : []),
        ]}
      />
    </div>
  );
}
