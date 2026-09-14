import React, { useEffect, useState } from 'react';
import dashboardService from '../api/services/dashboardService';
import inventoryService from '../api/services/inventoryService';
import AdminDashboard from './AdminDashboard';
import TechDashboard from './TechDashboard';

function calculateProductInventoryValue(products) {
  if (!Array.isArray(products)) return null;

  return products.reduce((total, product) => {
    const quantity = Number(product?.quantity) || 0;
    const price = Number(product?.price) || 0;
    return total + quantity * price;
  }, 0);
}

export default function HomeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    dashboardService.getDashboard()
      .then(async (res) => {
        if (!mounted) return;
        const dashboardData = res.data;

        if (!dashboardData?.admin) {
          setData(dashboardData);
          return;
        }

        try {
          const productsResponse = await inventoryService.listProducts();
          const products = Array.isArray(productsResponse.data)
            ? productsResponse.data
            : productsResponse.data?.products;
          const productInventoryValue = calculateProductInventoryValue(products);

          setData({
            ...dashboardData,
            admin: {
              ...dashboardData.admin,
              ...(productInventoryValue !== null && { totalInventoryValue: productInventoryValue }),
            },
          });
        } catch (productsError) {
          console.error('Error calculando el valor del inventario:', productsError);
          setData({
            ...dashboardData,
            admin: {
              ...dashboardData.admin,
              totalInventoryValue: null,
            },
          });
        }
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="text-center text-gray-500">Cargando dashboard...</div>;
  if (error) return <div className="text-red-600">Error al cargar dashboard</div>;

  if (data?.admin) return <AdminDashboard data={data.admin} />;
  if (data?.tech) return <TechDashboard data={data.tech} />;

  return <div className="text-gray-600">No hay dashboard disponible para tu rol.</div>;
}
