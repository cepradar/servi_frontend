import React from 'react';
import DataTable from '../DataTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ActionMenu from '../common/ActionMenu';

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
                noMenu: true,
                headerClassName: 'px-1',
                cellClassName: 'px-1',
                sortable: false,
                filterable: false,
                render: (item) => (
                  <div className="flex justify-center items-center gap-1 flex-nowrap">
                    <ActionMenu
                      onEdit={() => onEdit(item.id)}
                      onDelete={() => onDelete(item.id)}
                      canEdit={canUpdate}
                      canDelete={canDelete}
                    />
                  </div>
                ),
              }]
            : []),
        ]}
      />
    </div>
  );
}
