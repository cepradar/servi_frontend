import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ActionMenu({ onEdit, onDelete, onPrint, onVoid, canEdit = false, canDelete = false, canPrint = false, canVoid = false, ariaLabel = 'Acciones' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      const target = e.target;
      const insideButton = ref.current && ref.current.contains(target);
      const insideMenu = menuRef.current && menuRef.current.contains(target);
      if (!insideButton && !insideMenu) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="p-1 rounded hover:bg-gray-100 transition-colors"
        title="Opciones"
      >
        <EllipsisVerticalIcon className="h-4 w-4 text-gray-600" />
      </button>

      {open && (() => {
        const rect = ref.current?.getBoundingClientRect();
        const menuWidth = 160;
        const top = rect ? (rect.bottom + window.scrollY + 6) : undefined;
        const left = rect ? (rect.right + window.scrollX - menuWidth) : undefined;

        const menu = (
          <div
            ref={menuRef}
            role="menu"
            className="bg-white border border-gray-200 rounded shadow-lg z-[9999]"
            style={{ position: 'absolute', top: top ? `${top}px` : undefined, left: left ? `${left}px` : undefined, width: `${menuWidth}px` }}
          >
            <div className="py-1">
              {canEdit && (
                <button onClick={() => { setOpen(false); onEdit && onEdit(); }} role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <PencilIcon className="h-4 w-4 text-yellow-500" /> Editar
                </button>
              )}

              {canPrint && (
                <button onClick={() => { setOpen(false); onPrint && onPrint(); }} role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <PrinterIcon className="h-4 w-4 text-blue-500" /> Imprimir
                </button>
              )}

              {canVoid && (
                <button onClick={() => { setOpen(false); onVoid && onVoid(); }} role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <XMarkIcon className="h-4 w-4 text-rose-500" /> Anular
                </button>
              )}

              {canDelete && (
                <button onClick={() => { setOpen(false); onDelete && onDelete(); }} role="menuitem" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <TrashIcon className="h-4 w-4 text-red-500" /> Eliminar
                </button>
              )}

              {(!canEdit && !canDelete) && (
                <div className="px-3 py-2 text-xs text-gray-500">Sin acciones disponibles</div>
              )}
            </div>
          </div>
        );

        return createPortal(menu, document.body);
      })()}
    </div>
  );
}
