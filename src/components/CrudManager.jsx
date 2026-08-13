import React, { useState, useEffect } from 'react';
import api from './utils/axiosConfig'; // Axios con interceptor JWT
import Modal from './common/Modal';
import { useToast } from './ui/Toast';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from './DataTable';
import { usePermissions } from './utils/PermissionsContext';
import inventoryService from '../api/services/inventoryService';
import { useProductForm } from '../hooks/useProductForm';
import { useResourceData } from '../hooks/useResourceData';
import ProductForm from './inventory/ProductForm';
import ProductList from './inventory/ProductList';

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
            )
          }] : [])
        ]}
      />
    </div>
  );
};

export default function CrudManager({ resourceType, userRole, onFormStateChange }) {
  const { toast } = useToast();
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

  const apiEndpoints = {
    products: { list: '/api/products/listar', base: '/api/products', eliminar: '/api/products/eliminar' },
    categories: { list: '/api/categories/listarCategoria', base: '/api/categories' },
  };

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
      const response = type === 'products'
        ? (editingId
            ? await inventoryService.updateProduct(editingId, payload)
            : await inventoryService.createProduct(payload))
        : await api[editingId ? 'put' : 'post'](
            editingId
              ? `${apiEndpoints[type].base}/actualizar/${editingId}`
              : `${apiEndpoints[type].base}/agregar`,
            payload
          );

      // 🔔 Registrar evento de auditoría
      if (resourceType === 'products') {
        // Usar el ID del producto retornado por el backend (puede diferir del temporal)
        const productIdReal = response.data?.id || payload.id;
        const productoAnterior = data.find(item => item.id === editingId);
        const cantidadInicial = editingId ? (productoAnterior?.quantity ?? payload.quantity) : payload.quantity;
        const precioInicial = editingId ? (productoAnterior?.price ?? payload.price) : payload.price;
        await inventoryService.registerProductAudit(
          productIdReal,
          editingId ? 'ACTUALIZACION' : 'CREACION',
          cantidadInicial,
          payload.quantity,
          precioInicial,
          payload.price
        );
      }

      toast.success(`${type} ${editingId ? 'actualizado' : 'agregado'} exitosamente.`);
      resetForm();
      reload();
    } catch (error) {
      console.error(`Error al ${editingId ? 'actualizar' : 'agregar'} ${type}:`, error);
      const message = error?.response?.data?.message;
      toast.error(message || `Error al ${editingId ? 'actualizar' : 'agregar'} ${type}.`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await api.get(apiEndpoints.categories.list);
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
        // Obtener datos del producto antes de eliminarlo para auditoría
        const productoAEliminar = data.find(item => item.id === id);
        
        if (resourceType === 'products') {
          await inventoryService.deleteProduct(id);
        } else {
          const deleteUrl = `${apiEndpoints[resourceType].eliminar}/${id}`;
          await api.delete(deleteUrl);
        }

        // 🔔 Registrar evento de auditoría para eliminación
        if (resourceType === 'products' && productoAEliminar) {
          await inventoryService.registerProductAudit(
            id,
            'ELIMINACION',
            productoAEliminar.quantity || 0,
            productoAEliminar.quantity || 0,
            productoAEliminar.price || 0,
            productoAEliminar.price || 0
          );
        }

        toast.success(`${resourceType} eliminado exitosamente.`);
        if (editingId === id) {
          resetForm();
        }
        reload();
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
          <ProductForm
            resourceType={resourceType}
            formData={formData}
            categories={categories}
            categoriasElectrodomestico={categoriasElectrodomestico}
            editingId={editingId}
            handleChange={handleChange}
            onSubmit={agregarEditarProductos}
            onCancel={handleCancelEdit}
            saving={saving}
            canSubmit={editingId ? canUpdate : canCreate}
          />
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
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canCreate={canCreate}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        ) : (
          <ResourceList
            data={data}
            userRole={userRole}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
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
