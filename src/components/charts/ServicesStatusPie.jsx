import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function ServicesStatusPie({ assigned = 0, pending = 0 }) {
  const data = [
    { name: 'Asignados', value: assigned },
    { name: 'Pendientes', value: pending }
  ];

  if (assigned + pending === 0) return <div className="text-sm text-gray-500">Sin servicios para mostrar.</div>;

  return (
    <div style={{ width: '100%', height: 220 }} className="bg-white p-3 rounded shadow">
      <h4 className="font-semibold mb-2">Estado de servicios</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={40} outerRadius={80} paddingAngle={3} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
