import React from 'react';

export default function CategoryForm({ formData = {}, handleChange, actions = {}, meta = {} }) {
  const { onSubmit, onCancel } = actions;
  const { saving = false, canSubmit = true } = meta;

  return (
    <form onSubmit={(e) => onSubmit(e, 'categories')} className="max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md p-4 md:p-5">
      <h2 className="font-bold text-gray-800 text-lg md:text-xl mb-3">{formData.id ? 'Editar Categoría' : 'Crear Categoría'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
        <div className="form-group">
          <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">Nombre de la Categoría <span className="text-red-500">*</span></label>
          <input id="name" type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Ej: Electrónica" required />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-1">Descripción <span className="text-red-500">*</span></label>
          <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all resize-none" placeholder="Describe brevemente esta categoría" rows="3" required />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-200 mt-3 pt-3">
        {canSubmit && (
          <button type="submit" disabled={saving} className="flex-1 h-9 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed">{saving ? 'Guardando...' : (formData.id ? '💾 Actualizar' : '✚ Crear')}</button>
        )}
        <button type="button" onClick={onCancel} className="flex-1 h-9 px-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all text-sm font-medium">✕ Cancelar</button>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios</p>
    </form>
  );
}
