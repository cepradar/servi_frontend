import React, { useState, useEffect, useCallback } from 'react';
import api from './utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, BuildingOffice2Icon, XMarkIcon } from '@heroicons/react/24/outline';
import DataTable from './DataTable';
import { usePermissions } from './utils/PermissionsContext';
import FormField from './common/FormField';
import { BtnPrimary, BtnSecondary, BtnDanger } from './common/Buttons';
import ActionMenu from './common/ActionMenu';
import sedeService from '../api/services/sedeService';
import Spinner from './ui/Spinner';
import Modal from './common/Modal';
import { useToast } from './ui/Toast';

const UserForm = ({ formData, handleInputChange, handleFormSubmit, editingId, handleCancelEdit, roles, handleDelete }) => {
  const { permissions } = usePermissions();
  const can = (c) => permissions.includes(c);

  return (
    <form onSubmit={handleFormSubmit} className="border rounded-lg shadow-sm p-4 bg-white" noValidate>
      <h3 className="font-semibold text-lg mb-3">{editingId ? 'Editar Usuario' : 'Crear Usuario'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField id="username" label="Usuario" required>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={formData.username || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
            readOnly={!!editingId}
            aria-invalid={false}
          />
        </FormField>

        <FormField id="email" label="Email" required>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
            aria-invalid={false}
          />
        </FormField>

        <FormField id="telefono" label="Teléfono">
          <input
            id="telefono"
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            aria-invalid={false}
          />
        </FormField>

        {!editingId && (
          <FormField id="password" label="Contraseña" required>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
              aria-invalid={false}
            />
          </FormField>
        )}

        <FormField id="role" label="Rol" required>
          <select
            id="role"
            name="role"
            value={formData.role || ''}
            onChange={handleInputChange}
            className="w-full h-10 px-3 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
            aria-invalid={false}
          >
            <option value="">Seleccionar rol</option>
            {roles.map(role => (
              <option key={role.name} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="firstName" label="Nombre">
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            aria-invalid={false}
          />
        </FormField>

        <FormField id="lastName" label="Apellido">
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            aria-invalid={false}
          />
        </FormField>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        {(editingId ? can('users.update') : can('users.create')) && (
          <BtnPrimary type="submit">{editingId ? 'Actualizar' : 'Crear'}</BtnPrimary>
        )}

        <BtnSecondary type="button" onClick={handleCancelEdit}>Cancelar</BtnSecondary>
      </div>
    </form>
  );
};

const UserList = ({ data, onEdit, onDelete, onAdd }) => {
  const { permissions } = usePermissions();
  const can = (c) => permissions.includes(c);
  return (
    <div className="p-1 md:p-2">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <h3 className="text-sm md:text-base font-bold">Listado de Usuarios</h3>
        {can('users.create') && (
          <button
            onClick={onAdd}
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            Crear Usuario
          </button>
        )}
      </div>

      <DataTable
        data={data}
        columns={[
          { key: 'id', label: 'ID', sortable: true, filterable: true },
          {
            key: 'fullName',
            label: 'Nombre Completo',
            sortable: true,
            filterable: true,
            render: (user) => `${user.firstName || ''} ${user.lastName || ''}`.trim()
          },
          { key: 'telefono', label: 'Teléfono', sortable: true, filterable: true },
          { key: 'email', label: 'Email', sortable: true, filterable: true },
          {
            key: 'role',
            label: 'Rol',
            sortable: true,
            filterable: true,
            render: (user) => (
              <span 
                className="px-2 py-1 rounded text-white text-xs font-bold"
                style={{ backgroundColor: user.roleColor || '#2563eb' }}
              >
                {user.role}
              </span>
            )
          },
          {
            key: 'acciones',
            label: '',
            sortable: false,
            filterable: false,
            width: 44,
            noMenu: true,
            headerClassName: 'px-1',
            cellClassName: 'px-1',
            render: (user) => (
              <div className="flex justify-center items-center gap-1 flex-nowrap">
                <ActionMenu
                  onEdit={() => onEdit(user.username)}
                  onDelete={() => onDelete(user.username)}
                  canEdit={can('users.update')}
                  canDelete={can('users.delete')}
                />
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

// ── Panel de asignación de sedes al usuario ──────────────────────────────────
function UserSedesPanel({ username }) {
  const { permissions } = usePermissions();
  const can = (c) => permissions.includes(c);
  const { toast } = useToast();

  const [assigned, setAssigned] = useState([]);
  const [allSedes, setAllSedes] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const [resAssigned, resAll] = await Promise.all([
        sedeService.getUserSedes(username),
        sedeService.list(),
      ]);
      setAssigned(Array.isArray(resAssigned.data) ? resAssigned.data : []);
      setAllSedes(Array.isArray(resAll.data)      ? resAll.data      : []);
    } catch {
      toast.error('No se pudieron cargar las sedes');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => { load(); }, [load]);

  const unassigned = allSedes.filter(
    (s) => s.activo !== false && !assigned.find((a) => a.codigoSede === s.codigoSede)
  );

  const handleAssign = async () => {
    if (!selected) return;
    try {
      await sedeService.assignSede(username, selected);
      toast.success('Sede asignada correctamente');
      setSelected('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al asignar sede');
    }
  };

  const handleRemove = async (sedeId) => {
    try {
      await sedeService.removeSede(username, sedeId);
      toast.success('Sede removida correctamente');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al remover sede');
    }
  };

  return (
    <div className="border rounded shadow-sm p-3 md:p-4 bg-white mt-3">
      <h3 className="font-bold text-sm md:text-base mb-3 flex items-center gap-2 text-gray-800">
        <BuildingOffice2Icon className="h-4 w-4 text-blue-600" />
        Sedes asignadas al usuario
      </h3>

      {loading ? (
        <div className="py-2"><Spinner size="sm" /></div>
      ) : (
        <>
          {/* Lista de sedes asignadas */}
          <div className="mb-3 min-h-[32px]">
            {assigned.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Sin sedes asignadas.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {assigned.map((sede) => (
                  <span
                    key={sede.codigoSede}
                    className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    <BuildingOffice2Icon className="h-3 w-3 flex-shrink-0" />
                    {sede.nombreSede || sede.nombre || sede.codigoSede}
                    <span className="text-blue-400 font-mono">({sede.codigoSede})</span>
                    {can('users.update') && (
                      <button
                        type="button"
                        onClick={() => handleRemove(sede.codigoSede)}
                        className="ml-0.5 text-blue-400 hover:text-red-600 transition-colors"
                        title="Quitar sede"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Asignar nueva sede */}
          {can('users.update') && unassigned.length > 0 && (
            <div className="flex gap-2 items-center flex-wrap">
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="flex-1 min-w-0 h-8 px-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar sede para asignar...</option>
                {unassigned.map((s) => (
                  <option key={s.codigoSede} value={s.codigoSede}>
                    {s.nombre} ({s.codigoSede}) — {s.ciudad || ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAssign}
                disabled={!selected}
                className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                Asignar
              </button>
            </div>
          )}

          {can('users.update') && unassigned.length === 0 && allSedes.length > 0 && (
            <p className="text-xs text-gray-400 italic">Todas las sedes activas ya están asignadas.</p>
          )}
        </>
      )}
    </div>
  );
}

export default function UserManager({ forceShowForm = false }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
    const [showForm, setShowForm] = useState(forceShowForm);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cargar usuarios y roles al montar el componente
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Actualizar showForm cuando forceShowForm cambie
  useEffect(() => {
    setShowForm(forceShowForm);
  }, [forceShowForm]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/api/users/roles/available');
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      alert('Error al cargar los roles');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // clear field error on change
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Validación simple
    const errors = {};
    if (!formData.username && !editingId) errors.username = 'El usuario es requerido';
    if (!formData.email) errors.email = 'El email es requerido';
    if (!editingId && !formData.password) errors.password = 'La contraseña es requerida';
    if (!formData.role) errors.role = 'El rol es requerido';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      const first = Object.keys(errors)[0];
      const el = document.getElementById(first);
      if (el) el.focus();
      return;
    }

    try {
      if (editingId) {
        await api.put(`/api/users/${editingId}`, formData);
        toast.success('Usuario actualizado');
      } else {
        await api.post('/api/users', formData);
        toast.success('Usuario creado');
      }
      setShowForm(false);
      setFormData({});
      setEditingId(null);
      setFormErrors({});
      await fetchUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast.error(error.response?.data?.message || 'Error al guardar el usuario');
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      setFormData(response.data);
      setEditingId(id);
      setShowForm(true);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      alert('Error al cargar el usuario');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      toast.success('Usuario eliminado');
      setConfirmDelete(null);
      await fetchUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setFormData({});
    setEditingId(null);
  };

  const handleAdd = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {showForm ? (
        <>
          <UserForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            editingId={editingId}
            handleCancelEdit={handleCancelEdit}
            roles={roles}
            handleDelete={handleDelete}
          />
          {editingId && (
            <UserSedesPanel username={formData.username || editingId} />
          )}
        </>
      ) : (
        <>
          <UserList
            data={users}
            onEdit={handleEdit}
            onDelete={(id) => setConfirmDelete(id)}
            onAdd={handleAdd}
          />
          {confirmDelete && (
            <Modal
              title="Eliminar usuario"
              message={`¿Confirma eliminar al usuario ${confirmDelete}? Esta acción no se puede deshacer.`}
              onConfirm={() => handleDelete(confirmDelete)}
              onCancel={() => setConfirmDelete(null)}
              confirmLabel="Eliminar"
              cancelLabel="Cancelar"
              variant="danger"
            />
          )}
        </>
      )}
    </div>
  );
}
