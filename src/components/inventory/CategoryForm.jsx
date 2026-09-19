import React from 'react';
import FormField from '../common/FormField';
import { BtnPrimary, BtnSecondary } from '../common/Buttons';
import Spinner from '../ui/Spinner';

export default function CategoryForm({ formData = {}, handleChange, actions = {}, meta = {} }) {
  const { onSubmit, onCancel } = actions;
  const { saving = false, canSubmit = true } = meta;

  return (
    <form onSubmit={(e) => onSubmit(e, 'categories')} className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-4 md:p-5" noValidate>
      <h2 className="font-bold text-gray-800 text-lg md:text-xl mb-3">{formData.id ? 'Editar Categoría' : 'Crear Categoría'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
        <FormField id="name" label="Nombre de la Categoría" required>
          <input id="name" type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="Ej: Electrónica" required aria-invalid={false} />
        </FormField>

        <FormField id="description" label="Descripción" required>
          <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe brevemente esta categoría" rows="3" required aria-invalid={false} />
        </FormField>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-200 mt-3 pt-3">
        {canSubmit && (
          <BtnPrimary type="submit" className="flex-1" disabled={saving}>
            {saving ? (<><Spinner size="sm" className="mr-2" /> Guardando...</>) : (formData.id ? '💾 Actualizar' : '✚ Crear')}
          </BtnPrimary>
        )}
        <BtnSecondary type="button" className="flex-1" onClick={onCancel}>✕ Cancelar</BtnSecondary>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios</p>
    </form>
  );
}
