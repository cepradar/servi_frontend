import React, { useMemo, useState } from 'react';
import ServicesStatusPie from './charts/ServicesStatusPie';
import { formatCurrency } from './utils/currency';

const nf = new Intl.NumberFormat('es-CO');

const STATUS_LABELS = {
  ORDEN_SERVICIO_CREADA: 'Creada',
  ORDEN_SERVICIO_ASIGNADA: 'Asignada',
  ORDEN_SERVICIO_EN_PROCESO: 'En proceso',
  ORDEN_SERVICIO_PAUSADA: 'Pausada',
  ORDEN_SERVICIO_DIAGNOSTICADA: 'Diagnosticada',
  ORDEN_SERVICIO_REPARADA: 'Reparada',
  ORDEN_SERVICIO_PRUEBA: 'En prueba',
  ORDEN_SERVICIO_LISTA: 'Lista',
  ORDEN_SERVICIO_ENTREGADA: 'Entregada',
  ORDEN_SERVICIO_CANCELADA: 'Cancelada',
  ORDEN_SERVICIO_RECHAZADA: 'Rechazada'
};

const BADGE_CLASSES = {
  asignados: 'bg-blue-100 text-blue-700',
  proceso: 'bg-amber-100 text-amber-700',
  completados: 'bg-green-100 text-green-700'
};

// Agrupa el estado crudo en uno de los filtros del panel.
function groupOf(s) {
  if (s._completed || s.estado === 'ORDEN_SERVICIO_ENTREGADA') return 'completados';
  if (s.estado === 'ORDEN_SERVICIO_ASIGNADA' || s.estado === 'ORDEN_SERVICIO_CREADA') return 'asignados';
  return 'proceso';
}

function statusLabel(estado) {
  return STATUS_LABELS[estado] || (estado ? estado.replace(/^ORDEN_SERVICIO_/, '').replace(/_/g, ' ').toLowerCase() : '-');
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const date = d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '');
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${date}, ${time}`;
}

function whatsappUrl(s) {
  let digits = String(s.telefono || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) digits = `57${digits}`; // celular colombiano sin indicativo
  const text = `Hola ${s.cliente}, te escribo del servicio técnico respecto a tu orden #${s.id}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function inRange(value, range) {
  if (range === 'todo') return true;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return true;
  const now = new Date();
  if (range === 'hoy') return d.toDateString() === now.toDateString();
  if (range === 'semana') {
    const start = new Date(now);
    const day = (now.getDay() + 6) % 7; // semana desde lunes
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
    return d >= start;
  }
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function Kpi({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );
}

function ServiceCard({ s }) {
  const group = groupOf(s);
  const wa = whatsappUrl(s);
  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold">ORDEN #{s.id}</div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${BADGE_CLASSES[group]}`}>{statusLabel(s.estado)}</span>
      </div>
      <div className="text-sm">👤 <span className="font-medium">{s.cliente || 'Sin cliente'}</span></div>
      <div className="text-sm flex flex-wrap items-center gap-2">
        <span>📱 {s.telefono || <span className="text-gray-400">Sin teléfono registrado</span>}</span>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-medium"
          >
            💬 Contactar por WhatsApp
          </a>
        ) : (
          <button type="button" disabled className="px-2 py-1 rounded bg-gray-200 text-gray-500 text-xs cursor-not-allowed">
            💬 WhatsApp no disponible
          </button>
        )}
      </div>
      <div className="text-sm">💻 Equipo: {s.equipo || '-'}</div>
      <div className="text-sm">🛠️ Falla: {s.falla || '-'}</div>
      <div className="text-xs text-gray-500">📅 Fecha ingreso: {formatDate(s.fechaIngreso)}</div>
    </div>
  );
}

const FILTERS = [
  ['todos', 'Todos'],
  ['asignados', 'Asignados'],
  ['proceso', 'En Proceso'],
  ['completados', 'Completados']
];
const RANGES = [
  ['hoy', 'Hoy'],
  ['semana', 'Esta semana'],
  ['mes', 'Este mes'],
  ['todo', 'Todo']
];

export default function TechDashboard({ data }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('todos');
  const [range, setRange] = useState('mes');

  const all = useMemo(
    () => [
      ...(data.assignedServices || []),
      ...(data.completedServices || []).map((s) => ({ ...s, _completed: true }))
    ],
    [data.assignedServices, data.completedServices]
  );

  const inDate = useMemo(() => all.filter((s) => inRange(s.fechaIngreso, range)), [all, range]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inDate
      .filter((s) => filter === 'todos' || groupOf(s) === filter)
      .filter((s) => !q || [s.cliente, s.id, s.equipo].some((v) => String(v ?? '').toLowerCase().includes(q)))
      .sort((a, b) => String(b.fechaIngreso).localeCompare(String(a.fechaIngreso)));
  }, [inDate, filter, query]);

  const count = (g) => inDate.filter((s) => groupOf(s) === g).length;
  const slices = [
    { name: 'Asignados', value: count('asignados'), color: '#3b82f6' },
    { name: 'En Proceso', value: count('proceso'), color: '#f59e0b' },
    { name: 'Completados', value: count('completados'), color: '#10b981' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Buscar por cliente, orden o equipo..."
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(([key, label]) => (
              <Chip key={key} active={filter === key} onClick={() => setFilter(key)}>{label}</Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {RANGES.map(([key, label]) => (
              <Chip key={key} active={range === key} onClick={() => setRange(key)}>{label}</Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow lg:col-span-2">
          <h3 className="font-semibold">Servicios asignados ({visible.length})</h3>
          {visible.length ? (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {visible.map((s) => <ServiceCard key={`${s._completed ? 'c' : 'a'}-${s.id}`} s={s} />)}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500">No hay servicios que coincidan con los filtros.</p>
          )}
        </div>

        <ServicesStatusPie slices={slices} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Kpi label="Servicios este mes" value={nf.format(data.servicesThisMonthCount ?? 0)} />
        <Kpi label="Servicios mes anterior" value={nf.format(data.servicesLastMonthCount ?? 0)} />
        <Kpi label="Ganancias este mes (COP)" value={formatCurrency(data.earningsThisMonth)} />
      </div>
    </div>
  );
}
