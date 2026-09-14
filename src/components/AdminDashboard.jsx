import React from 'react';
import SalesTrendChart from './charts/SalesTrendChart';
import TopProductsBar from './charts/TopProductsBar';
import { formatCurrency } from './utils/currency';

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
        <Kpi label="Valor inventario (COP)" value={data.totalInventoryValue == null ? 'No disponible' : formatCurrency(data.totalInventoryValue)} />
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
          <h3 className="font-semibold">Ventas por mes</h3>
          <div className="mt-2 text-lg">Mes actual: {formatCurrency(data.salesThisMonth)}</div>
          <div className="text-sm text-gray-500">Mes anterior: {formatCurrency(data.salesLastMonth)}</div>
          <p className="text-xs text-gray-400 mt-3">Los valores corresponden a ventas registradas, no al valor total del inventario.</p>
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
