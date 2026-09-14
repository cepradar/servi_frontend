import React from 'react';
import ServicesStatusPie from './charts/ServicesStatusPie';
import { formatCurrency } from './utils/currency';

function Kpi({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

export default function TechDashboard({ data }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Servicios asignados</h3>
          {data.assignedServices?.length ? (
            <ul className="mt-2 divide-y">
              {data.assignedServices.map((s) => (
                <li key={s.id} className="py-2">
                  <div className="font-medium">{s.cliente}</div>
                  <div className="text-xs text-gray-500">{s.fechaIngreso} · {s.estado}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No tienes servicios asignados en este momento.</p>
          )}
        </div>

        <div>
          <ServicesStatusPie assigned={data.assignedServices?.length || 0} pending={data.pendingServices?.length || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi label="Servicios este mes" value={data.servicesThisMonthCount} />
        <Kpi label="Servicios mes anterior" value={data.servicesLastMonthCount} />
        <Kpi label="Ganancias este mes (COP)" value={formatCurrency(data.earningsThisMonth)} />
      </div>
    </div>
  );
}
