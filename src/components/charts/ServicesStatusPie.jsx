import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function ServicesStatusPie({ slices = [] }) {
  const data = slices.filter((s) => s.value > 0);
  const total = slices.reduce((acc, s) => acc + s.value, 0);
  const pct = (v) => (total ? ((v / total) * 100).toFixed(1) : '0.0');

  return (
    <div className="bg-white p-4 rounded shadow h-full">
      <h4 className="font-semibold mb-2">Estado de servicios</h4>
      {total === 0 ? (
        <div className="text-sm text-gray-500">Sin servicios para mostrar.</div>
      ) : (
        <>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="value" nameKey="name" data={data} innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [`${v} (${pct(v)}%)`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {slices.map((s) => (
              <li key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-medium">{s.value} ({pct(s.value)}%)</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t text-sm text-gray-600">Total servicios: {total}</div>
        </>
      )}
    </div>
  );
}
