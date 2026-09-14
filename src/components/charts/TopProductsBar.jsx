import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#2563eb', '#1d4ed8', '#0ea5e9', '#06b6d4', '#7c3aed'];

export default function TopProductsBar({ data }) {
  if (!data || data.length === 0) return <div className="text-sm text-gray-500">No hay productos vendidos.</div>;
  const formatted = data.map((d, i) => ({ name: d.name || d.productId, qty: Number(d.quantitySold || 0), colorIndex: i }));

  return (
    <div style={{ width: '100%', height: 300 }} className="bg-white p-3 rounded shadow">
      <h4 className="font-semibold mb-2">Top productos vendidos</h4>
      <ResponsiveContainer>
        <BarChart data={formatted} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={160} />
          <Tooltip />
          <Bar dataKey="qty" fill="#3b82f6">
            {formatted.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
