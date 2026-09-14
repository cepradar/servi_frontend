import api from '../components/utils/axiosConfig';
import inventoryService from '../api/services/inventoryService';
import { useToast } from '../components/ui/Toast';

const apiEndpoints = {
  products: { list: '/api/products/listar', base: '/api/products', eliminar: '/api/products/eliminar' },
  categories: { list: '/api/categories/listarCategoria', base: '/api/categories' },
};

export function useInventoryActions({ resourceType, reload, getPrevious } = {}) {
  const { toast } = useToast();

  const save = async (payload, editingId = null) => {
    try {
      const response = resourceType === 'products'
        ? (editingId
            ? await inventoryService.updateProduct(editingId, payload)
            : await inventoryService.createProduct(payload))
        : await api[editingId ? 'put' : 'post'](
            editingId
              ? `${apiEndpoints[resourceType].base}/actualizar/${editingId}`
              : `${apiEndpoints[resourceType].base}/agregar`,
            payload
          );

      // Registrar auditoría para productos
      if (resourceType === 'products') {
        const productIdReal = response.data?.id || payload.id;
        const productoAnterior = getPrevious ? getPrevious(editingId) : null;
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

      toast.success(`${resourceType} ${editingId ? 'actualizado' : 'agregado'} exitosamente.`);
      if (reload) await reload();
      return response;
    } catch (error) {
      console.error(`Error al ${editingId ? 'actualizar' : 'agregar'} ${resourceType}:`, error);
      const message = error?.response?.data?.message;
      toast.error(message || `Error al ${editingId ? 'actualizar' : 'agregar'} ${resourceType}.`);
      throw error;
    }
  };

  const remove = async (id) => {
    try {
      if (resourceType === 'products') {
        await inventoryService.deleteProduct(id);
      } else {
        const deleteUrl = `${apiEndpoints[resourceType].eliminar}/${id}`;
        await api.delete(deleteUrl);
      }

      if (resourceType === 'products' && getPrevious) {
        const productoAEliminar = getPrevious(id);
        if (productoAEliminar) {
          await inventoryService.registerProductAudit(
            id,
            'ELIMINACION',
            productoAEliminar.quantity || 0,
            productoAEliminar.quantity || 0,
            productoAEliminar.price || 0,
            productoAEliminar.price || 0
          );
        }
      }

      toast.success(`${resourceType} eliminado exitosamente.`);
      if (reload) await reload();
    } catch (error) {
      console.error(`Error al eliminar ${resourceType}:`, error);
      toast.error(`Error al eliminar ${resourceType}.`);
      throw error;
    }
  };

  return { save, remove };
}
