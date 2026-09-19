import React from 'react';
import FormField from '../common/FormField';
import { BtnPrimary, BtnSecondary } from '../common/Buttons';
import Spinner from '../ui/Spinner';

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
      noValidate
    >
      <h2 className="font-bold text-gray-800 text-lg md:text-xl mb-3">
        {editingId ? `Editar ${resourceType === 'products' ? 'Producto' : 'Categoría'}` : `Crear ${resourceType === 'products' ? 'Producto' : 'Categoría'}`}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resourceType === 'products' ? (
          <>
            <FormField id="id" label="ID del Producto" required>
              <input
                id="id"
                type="text"
                name="id"
                value={formData.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: PROD-001"
                required
                readOnly={!!editingId}
                disabled={!!editingId}
                aria-invalid={false}
              />
              {editingId && <p className="text-xs text-gray-500 mt-1">El ID no puede modificarse una vez creado</p>}
            </FormField>

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

            <FormField id="name" label="Nombre del Producto" required>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Laptop Dell XPS"
                required
                aria-invalid={false}
              />
            </FormField>

            <FormField id="description" label="Descripción">
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe brevemente las características del producto"
                rows={2}
                aria-invalid={false}
              />
            </FormField>

            <FormField id="categoryId" label="Categoría" required>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                required
                aria-invalid={false}
              >
                <option value="">-- Selecciona una categoría --</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </FormField>

            <FormField id="categoriaElectrodomesticoId" label="Categoría de Electrodoméstico">
              <select
                id="categoriaElectrodomesticoId"
                name="categoriaElectrodomesticoId"
                value={formData.categoriaElectrodomesticoId || ''}
                onChange={handleChange}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                aria-invalid={false}
              >
                <option value="">-- Selecciona una categoría --</option>
                {categoriasElectrodomestico.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </FormField>

            <FormField id="quantity" label="Cantidad" required>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
                required
                aria-invalid={false}
              />
            </FormField>

            <FormField id="price" label="Precio ($)" required>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                aria-invalid={false}
              />
            </FormField>
          </>
        ) : (
          <>
            <FormField id="name" label="Nombre de la Categoría" required>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Electrónica"
                required
                aria-invalid={false}
              />
            </FormField>

            <FormField id="description" label="Descripción" required>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe brevemente esta categoría"
                rows="3"
                required
                aria-invalid={false}
              />
            </FormField>
          </>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-200 mt-3 pt-3">
        {canSubmit && (
          <BtnPrimary type="submit" className="flex-1" disabled={saving}>
            {saving ? (<><Spinner size="sm" className="mr-2" /> Guardando...</>) : (editingId ? '💾 Actualizar' : '✚ Crear')}
          </BtnPrimary>
        )}
        <BtnSecondary type="button" className="flex-1" onClick={onCancel}>✕ Cancelar</BtnSecondary>
      </div>

      <p className="text-xs text-gray-500 text-center mt-2">
        Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios
      </p>
    </form>
  );
}
