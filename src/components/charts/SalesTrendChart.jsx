import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesTrendChart({ data }) {
  if (!data || data.length === 0) return <div className="text-sm text-gray-500">No hay datos de ventas recientes.</div>;

  // Expect data: [{ day: '2026-09-01', total: 123.45 }, ...]
  const formatted = data.map(d => ({ day: typeof d.day === 'string' ? d.day : (d.day + ''), total: Number(d.total || 0) }));

  return (
    <div style={{ width: '100%', height: 260 }} className="bg-white p-3 rounded shadow">
      <h4 className="font-semibold mb-2">Tendencia de ventas (últimos 30 días)</h4>
      <ResponsiveContainer>
        <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(v) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(v)} />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
