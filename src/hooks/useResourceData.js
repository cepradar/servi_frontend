import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../components/utils/axiosConfig';
import inventoryService from '../api/services/inventoryService';

const resourceListEndpoints = {
  products: '/api/products/listar',
  categories: '/api/categories/listarCategoria',
};

export function useResourceData(resourceType) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!resourceType || !resourceListEndpoints[resourceType]) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const response =
        resourceType === 'products'
          ? await inventoryService.listProducts()
          : await api.get(resourceListEndpoints[resourceType]);
      setData(response.data);
    } catch (error) {
      console.error(`Error al cargar ${resourceType}:`, error);
      if (error.response && error.response.status === 403) {
        alert('No tienes permiso. Redirigiendo al login.');
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, resourceType]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    data,
    loading,
    reload,
  };
}
