import React, { useState, useEffect } from 'react';
import api from './utils/axiosConfig'; // Axios con interceptor JWT
import Modal from './common/Modal';
import { useToast } from './ui/Toast';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from './DataTable';
import ActionMenu from './common/ActionMenu';
import { usePermissions } from './utils/PermissionsContext';
import { useProductForm } from '../hooks/useProductForm';
import { useResourceData } from '../hooks/useResourceData';
import { useInventoryActions } from '../hooks/useInventoryActions';
import ProductForm from './inventory/ProductForm';
import ProductList from './inventory/ProductList';
import CategoryList from './inventory/CategoryList';
import CategoryForm from './inventory/CategoryForm';

const ResourceList = ({ data, onEdit, onDelete, onAdd }) => {
  const { permissions } = usePermissions();
  const can = (c) => permissions.includes(c);
  const canCreate = can('inventory.create');
  const canUpdate = can('inventory.update');
  const canDelete = can('inventory.delete');
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
          ...((canUpdate || canDelete) ? [{
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
            )
          }] : [])
        ]}
      />
    </div>
  );
};

export default function CrudManager({ resourceType, userRole, onFormStateChange }) {
  const { toast } = useToast();
  void userRole;
  const { permissions } = usePermissions();
  const can = (c) => permissions.includes(c);
  const canCreate = can('inventory.create');
  const canUpdate = can('inventory.update');
  const canDelete = can('inventory.delete');
  const { data, loading, reload } = useResourceData(resourceType);
  const [categories, setCategories] = useState([]);
  const [categoriasElectrodomestico, setCategoriasElectrodomestico] = useState([]);
  const {
    formData,
    editingId,
    showForm,
    handleChange,
    resetForm,
    startCreate,
    startEdit,
  } = useProductForm();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => { });
  const [saving, setSaving] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  const actions = useInventoryActions({
    resourceType,
    reload,
    getPrevious: (id) => data.find((item) => item.id === id),
  });

  

  const agregarEditarProductos = async (e, type) => {
    e.preventDefault();

    if (saving) return;

    const normalizedId = (formData.id || '').trim();
    if (!editingId) {
      if (!normalizedId) {
        toast.warn('Debes ingresar un codigo de producto.');
        return;
      }

      const idExists = data.some((item) =>
        String(item?.id || '')
          .trim()
          .toLowerCase() === normalizedId.toLowerCase()
      );

      if (idExists) {
        toast.warn('Ese codigo de producto ya existe. Ingresa uno diferente.');
        return;
      }
    }

    const payload = {
      id: editingId ? editingId : normalizedId,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      categoryId: formData.categoryId,
      categoriaElectrodomesticoId: formData.categoriaElectrodomesticoId || null,
      activo: formData.activo ?? true
    };

    setSaving(true);
    try {
      console.log('[CrudManager] Payload enviado:', payload);
      await actions.save(payload, editingId);
      resetForm();
    } catch (error) {
      console.error(`Error al ${editingId ? 'actualizar' : 'agregar'} ${type}:`, error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await api.get('/api/categories/listarCategoria');
        setCategories(response.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    const cargarCategoriasElectrodomestico = async () => {
      try {
        const response = await api.get('/api/categorias-electrodomestico/listar');
        setCategoriasElectrodomestico(response.data || []);
      } catch (error) {
        console.error('Error al cargar categorías de electrodoméstico:', error);
        setCategoriasElectrodomestico([]);
      }
    };

    if (resourceType === 'products') {
      cargarCategorias();
      cargarCategoriasElectrodomestico();
    }
  }, [resourceType]);

  // Notificar al Dashboard sobre cambios en el estado del formulario
  useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange(showForm || editingId !== null);
    }
  }, [showForm, editingId, onFormStateChange]);

  // Resetear formulario cuando cambia el resourceType (cambio de pestaña)
  useEffect(() => {
    resetForm();
  }, [resourceType, resetForm]);

  useEffect(() => {
    if (showForm) {
      setProductSearchTerm('');
    }
  }, [showForm]);

  const handleEdit = (id) => {
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      let categoriaElectrodomesticoId =
        itemToEdit.categoriaElectrodomesticoId ??
        itemToEdit.categoriaElectrodomestico?.id ??
        '';

      if (!categoriaElectrodomesticoId) {
        const nombreCategoria =
          itemToEdit.categoriaElectrodomesticoNombre ||
          itemToEdit.categoriaElectrodomesticoName ||
          itemToEdit.categoriaElectrodomestico?.nombre;
        const match = categoriasElectrodomestico.find(
          (cat) => cat.nombre === nombreCategoria
        );
        categoriaElectrodomesticoId = match?.id || '';
      }

      startEdit(id, {
        ...itemToEdit,
        categoryId: itemToEdit.categoryId || '',
        categoriaElectrodomesticoId: categoriaElectrodomesticoId ? String(categoriaElectrodomesticoId) : '',
        activo: itemToEdit.activo ?? true
      });
    }
  };

  const handleDelete = (id) => {
    setShowModal(true);
    setModalMessage(`¿Estás seguro de que quieres eliminar este ${resourceType}?`);
    setModalAction(() => async () => {
      try {
        await actions.remove(id);
        if (editingId === id) resetForm();
      } catch (error) {
        console.error(`Error al eliminar ${resourceType}:`, error);
        toast.error(`Error al eliminar ${resourceType}.`);
      } finally {
        setShowModal(false);
      }
    });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleAdd = () => {
    startCreate();
  };

  if (loading) return <div className="p-8 text-center">Cargando {resourceType}...</div>;

  return (
    <>
      {showForm ? (
        <div className="space-y-2">
          {resourceType === 'products' ? (
            <ProductForm
              resourceType={resourceType}
              formData={formData}
              categories={categories}
              categoriasElectrodomestico={categoriasElectrodomestico}
              editingId={editingId}
              handleChange={handleChange}
              actions={{ onSubmit: agregarEditarProductos, onCancel: handleCancelEdit }}
              meta={{ saving, canSubmit: editingId ? canUpdate : canCreate }}
            />
          ) : (
            <CategoryForm
              formData={formData}
              handleChange={handleChange}
              actions={{ onSubmit: agregarEditarProductos, onCancel: handleCancelEdit }}
              meta={{ saving, canSubmit: editingId ? canUpdate : canCreate }}
            />
          )}
          {resourceType === 'products' && editingId && canDelete && (
            <div className="max-w-2xl mx-auto flex justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleDelete(editingId)}
                className="h-9 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                🗑️ Eliminar
              </button>
            </div>
          )}
        </div>
      ) : (
        resourceType === 'products' ? (
          <ProductList
            data={data}
            loading={loading}
            categories={categories}
            categoriasElectrodomestico={categoriasElectrodomestico}
            searchTerm={productSearchTerm}
            setSearchTerm={setProductSearchTerm}
            actions={{ onAdd: handleAdd, onEdit: handleEdit, onDelete: handleDelete }}
            permissions={{ create: canCreate, update: canUpdate, delete: canDelete }}
          />
        ) : (
          <CategoryList
            data={data}
            actions={{ onEdit: handleEdit, onDelete: handleDelete, onAdd: handleAdd }}
            permissions={{ create: canCreate, update: canUpdate, delete: canDelete }}
          />
        )
      )}
      {showModal && (
        <Modal
          message={modalMessage}
          onConfirm={modalAction}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
