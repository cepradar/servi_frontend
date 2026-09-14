import React, { useEffect, useState } from 'react';
import dashboardService from '../api/services/dashboardService';
import AdminDashboard from './AdminDashboard';
import TechDashboard from './TechDashboard';

export default function HomeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    dashboardService.getDashboard()
      .then((res) => {
        if (!mounted) return;
        setData(res.data);
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
