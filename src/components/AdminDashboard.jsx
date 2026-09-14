import React from 'react';
import SalesTrendChart from './charts/SalesTrendChart';
import TopProductsBar from './charts/TopProductsBar';

function Kpi({ label, value, suffix }) {
  const formatted = typeof value === 'number' || (value && value.scale !== undefined) ?
    (typeof value === 'number' ? value : value.toString()) : value;
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{formatted}{suffix || ''}</div>
    </div>
  );
}

export default function AdminDashboard({ data }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi label="Valor inventario" value={data.totalInventoryValue ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(data.totalInventoryValue) : '0'} />
        <Kpi label="Productos" value={data.totalProducts} />
        <Kpi label="Servicios pendientes" value={data.pendingServices} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2">
          <SalesTrendChart data={data.salesTrend || []} />
        </div>

        <div>
          <TopProductsBar data={data.topProducts || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Resumen de ventas</h3>
          <div className="mt-2 text-lg">Mes actual: {data.salesThisMonth ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(data.salesThisMonth) : '-'}</div>
          <div className="text-sm text-gray-500">Mes anterior: {data.salesLastMonth ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(data.salesLastMonth) : '-'}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Servicios</h3>
          <div className="mt-2">Total: {data.totalServices}</div>
          <div className="text-sm text-gray-500">Pendientes: {data.pendingServices}</div>
        </div>
      </div>
    </div>
  );
}
