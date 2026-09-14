import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import currencyFormatter from '../utils/currency';

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
});

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

export default function SalesTrendChart({ data }) {
  if (!data || data.length === 0) return <div className="text-sm text-gray-500">No hay datos de ventas recientes.</div>;

  // Expect data: [{ day: '2026-09-01', total: 123.45 }, ...]
  const formatted = data
    .map((item) => ({
      day: typeof item.day === 'string' ? item.day : String(item.day),
      total: Number(item.total || 0),
    }))
    .sort((first, second) => first.day.localeCompare(second.day));
  const periodTotal = formatted.reduce((sum, item) => sum + item.total, 0);
  const dailyAverage = periodTotal / formatted.length;
  const firstValue = formatted[0].total;
  const lastValue = formatted[formatted.length - 1].total;
  const variation = firstValue === 0 ? null : ((lastValue - firstValue) / firstValue) * 100;
  const variationLabel = variation === null
    ? 'Sin base de comparación'
    : `${variation >= 0 ? '+' : ''}${variation.toFixed(0)}% desde el primer registro`;

  return (
    <section className="bg-white p-4 rounded shadow" aria-labelledby="sales-trend-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 id="sales-trend-title" className="font-semibold">Ventas por día (COP)</h4>
          <p className="text-sm text-gray-500 mt-1">
            Cada punto representa el monto vendido en esa fecha. Una línea ascendente indica más ventas.
          </p>
        </div>
        <div className="text-right" aria-label={`Acumulado del período: ${currencyFormatter.format(periodTotal)}`}>
          <div className="text-xs uppercase tracking-wide text-gray-500">Acumulado del período</div>
          <div className="text-lg font-semibold text-gray-900">{currencyFormatter.format(periodTotal)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 mb-2 text-sm">
        <div className="rounded border border-gray-100 bg-gray-50 px-3 py-2">
          <div className="text-gray-500">Promedio por registro</div>
          <div className="font-medium text-gray-900">{currencyFormatter.format(dailyAverage)}</div>
        </div>
        <div className="rounded border border-gray-100 bg-gray-50 px-3 py-2">
          <div className="text-gray-500">Evolución</div>
          <div className={variation !== null && variation < 0 ? 'font-medium text-red-700' : 'font-medium text-emerald-700'}>
            {variationLabel}
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 250 }} role="img" aria-label="Gráfico de ventas por fecha en pesos colombianos">
        <ResponsiveContainer>
          <LineChart data={formatted} margin={{ top: 5, right: 20, left: 8, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => currencyFormatter.format(value)} tick={{ fontSize: 12 }} width={76} />
            <Tooltip
              labelFormatter={(value) => `Fecha: ${formatDate(value)}`}
              formatter={(value) => [currencyFormatter.format(value), 'Ventas del día']}
            />
            <Line type="monotone" dataKey="total" name="Ventas del día" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
