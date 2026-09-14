import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#2563eb', '#1d4ed8', '#0ea5e9', '#06b6d4', '#7c3aed'];
const MAX_LABEL_LENGTH = 24;

function shortenName(name) {
  const label = String(name || 'Producto sin nombre');
  return label.length > MAX_LABEL_LENGTH ? `${label.slice(0, MAX_LABEL_LENGTH - 1)}...` : label;
}

function ProductTick({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-10} y={0} dy={4} textAnchor="end" fill="#475569" fontSize={12}>
        {`${payload.index + 1}. ${shortenName(payload.value)}`}
      </text>
    </g>
  );
}

export default function TopProductsBar({ data }) {
  if (!data || data.length === 0) return <div className="text-sm text-gray-500">No hay productos vendidos.</div>;
  const formatted = data
    .map((item) => ({
      name: item.name || item.productId || 'Producto sin nombre',
      qty: Number(item.quantitySold || 0),
    }))
    .sort((first, second) => second.qty - first.qty);
  const maximumQuantity = Math.max(...formatted.map((item) => item.qty), 1);
  const chartHeight = Math.max(260, formatted.length * 42 + 80);
  const leader = formatted[0];
  const isTie = formatted.length > 1 && leader.qty === formatted[1].qty;

  return (
    <section style={{ width: '100%', minHeight: chartHeight }} className="bg-white p-4 rounded shadow" aria-labelledby="top-products-title">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 id="top-products-title" className="font-semibold">Productos más vendidos</h4>
          <p className="text-sm text-gray-500 mt-1">Ranking por unidades vendidas</p>
        </div>
        <div className="text-right text-xs text-gray-500" aria-label={`${formatted.length} productos mostrados`}>
          <div className="uppercase tracking-wide">Mostrados</div>
          <div className="text-base font-semibold text-gray-900">{formatted.length}</div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-2" role="status">
        {isTie ? `Empate en el primer lugar con ${leader.qty} unidades.` : `Lidera ${shortenName(leader.name)} con ${leader.qty} unidades.`}
      </p>

      <div style={{ width: '100%', height: chartHeight - 74 }} role="img" aria-label="Ranking de productos por unidades vendidas">
        <ResponsiveContainer>
          <BarChart data={formatted} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, Math.ceil(maximumQuantity * 1.15)]}
              allowDecimals={false}
              label={{ value: 'Unidades', position: 'insideBottom', offset: -18, fill: '#64748b', fontSize: 12 }}
            />
            <YAxis dataKey="name" type="category" width={150} tick={<ProductTick />} interval={0} />
            <Tooltip
              labelFormatter={(value) => `Producto: ${value}`}
              formatter={(value) => [`${value} unidades`, 'Vendidas']}
            />
            <Bar dataKey="qty" name="Unidades vendidas" radius={[0, 4, 4, 0]}>
              {formatted.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
