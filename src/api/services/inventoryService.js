import axiosClient from '../axiosClient';

const inventoryService = {
  listProducts: () => axiosClient.get('/api/products/listar'),
  createProduct: (payload) => axiosClient.post('/api/products/agregar', payload),
  updateProduct: (id, payload) => axiosClient.put(`/api/products/actualizar/${id}`, payload),
  deleteProduct: (id) => axiosClient.delete(`/api/products/eliminar/${id}`),
  registerProductAudit: async (
    productId,
    tipoEvento,
    cantidadInicial,
    cantidadFinal,
    precioInicial,
    precioFinal
  ) => {
    try {
      const username = localStorage.getItem('username') || 'ADMIN';

      let tipo;
      let descripcion;

      switch (tipoEvento) {
        case 'CREACION':
          tipo = 'CP';
          descripcion = `Producto creado con cantidad inicial: ${cantidadFinal}`;
          break;
        case 'ACTUALIZACION':
          tipo = 'MA';
          descripcion = `Producto actualizado - Cantidad final: ${cantidadFinal}`;
          break;
        case 'ELIMINACION':
          tipo = 'EP';
          descripcion = `Producto eliminado del inventario - Cantidad anterior: ${cantidadInicial}`;
          break;
        default:
          tipo = 'MA';
          descripcion = `Operación ${tipoEvento} en producto`;
      }

      await axiosClient.post('/api/auditoria/registrar', null, {
        params: {
          productId: productId,
          cantidadInicial: cantidadInicial,
          cantidadFinal: cantidadFinal,
          precioInicial: precioInicial,
          precioFinal: precioFinal,
          tipo: tipo,
          descripcion: descripcion,
          usuarioUsername: username,
          referencia: `${tipoEvento}_PRODUCTO_${productId}_${Date.now()}`
        }
      });

      console.log(`✅ Evento ${tipoEvento} registrado para producto ${productId} por usuario ${username}`);
    } catch (error) {
      console.error('⚠️ Error al registrar evento de auditoría:', error);
      // No bloquear la operación principal si falla la auditoría
    }
  },
};

export default inventoryService;