import React from 'react';

export default function ProductForm({
  resourceType,
  formData,
  categories,
  categoriasElectrodomestico,
  editingId,
  handleChange,
  actions = {},
  meta = {},
}) {
  const { onSubmit, onCancel } = actions;
  const { saving = false, canSubmit = true } = meta;
  return (
    <form
      onSubmit={(e) => onSubmit(e, resourceType)}
      className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-4 md:p-5"
    >
      <h2 className="font-bold text-gray-800 text-lg md:text-xl mb-3">
        {editingId ? `Editar ${resourceType === 'products' ? 'Producto' : 'Categoría'}` : `Crear ${resourceType === 'products' ? 'Producto' : 'Categoría'}`}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resourceType === 'products' ? (
          <>
            <div className="form-group">
              <label htmlFor="id" className="block text-xs font-semibold text-gray-700 mb-1">
                ID del Producto <span className="text-red-500">*</span>
              </label>
              <input
                id="id"
                type="text"
                name="id"
                value={formData.id || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: PROD-001"
                required
                readOnly={!!editingId}
                disabled={!!editingId}
              />
              {editingId && <p className="text-[11px] text-gray-500 mt-1">El ID no puede modificarse una vez creado</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="activo"
                type="checkbox"
                name="activo"
                checked={formData.activo ?? true}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="activo" className="text-xs text-gray-600">
                Activo
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                Nombre del Producto <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: Laptop Dell XPS"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe brevemente las características del producto"
                rows={2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoryId" className="block text-xs font-semibold text-gray-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                required
              >
                <option value="">-- Selecciona una categoría --</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categoriaElectrodomesticoId" className="block text-xs font-semibold text-gray-700 mb-1">
                Categoría de Electrodoméstico
              </label>
              <select
                id="categoriaElectrodomesticoId"
                name="categoriaElectrodomesticoId"
                value={formData.categoriaElectrodomesticoId || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">-- Selecciona una categoría --</option>
                {categoriasElectrodomestico.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="block text-xs font-semibold text-gray-700 mb-1">
                Cantidad <span className="text-red-500">*</span>
              </label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price" className="block text-xs font-semibold text-gray-700 mb-1">
                Precio ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                Nombre de la Categoría <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: Electrónica"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe brevemente esta categoría"
                rows="3"
                required
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-200 mt-3 pt-3">
        {canSubmit && (
          <button
            type="submit"
            disabled={saving}
            className="flex-1 h-9 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : (editingId ? '💾 Actualizar' : '✚ Crear')}
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-9 px-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all text-sm font-medium"
        >
          ✕ Cancelar
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-2">
        Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios
      </p>
    </form>
  );
}
