import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const CategoryForm = ({ onSuccess }) => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState('ingresos');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('Ingrese un nombre para la categoría');
      return;
    }
    setLoading(true);
    try {
      await api.createCategory(token, { name: name.trim(), type });
      setName('');
      setType('ingresos');
      onSuccess?.();
    } catch (err) {
      alert(err?.message || 'Error creando categoría');
      
      console.error('Error creando categoría:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Crear Categoría</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Ej: Sueldo, Comida, Transporte"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="ingresos">Ingresos</option>
          
            <option value="gastos">Gastos</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className={`mt-4 w-full bg-black text-white py-3 rounded transition font-medium ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-900'}`}
      >
        {loading ? 'Creando…' : 'Crear Categoría'}
      </button>
    </div>
  );
};

export default CategoryForm;
