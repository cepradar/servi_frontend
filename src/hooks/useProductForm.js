import { useCallback, useState } from 'react';

const DEFAULT_PRODUCT_FORM_DATA = {
  id: '',
  name: '',
  description: '',
  price: '',
  quantity: '',
  categoryId: '',
  categoriaElectrodomesticoId: '',
  activo: true,
};

export function useProductForm() {
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const resetForm = useCallback((nextFormData = {}) => {
    setEditingId(null);
    setShowForm(false);
    setFormData(nextFormData);
  }, []);

  const startCreate = useCallback(() => {
    setEditingId(null);
    setFormData(DEFAULT_PRODUCT_FORM_DATA);
    setShowForm(true);
  }, []);

  const startEdit = useCallback((id, nextFormData) => {
    setFormData(nextFormData);
    setEditingId(id);
    setShowForm(true);
  }, []);

  return {
    formData,
    editingId,
    showForm,
    handleChange,
    resetForm,
    startCreate,
    startEdit,
  };
}
