import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const TransactionForm = ({ type, onSuccess }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: ''
  });

  useEffect(() => {
    loadCategories();
  }, [type]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories(token);
      // Normaliza tipos para evitar desajustes (ingreso/s vs gasto/expensa)
      const normalizeType = (s = '') => {
        const v = (s || '').toLowerCase();
        if (v.startsWith('ingre')) return 'ingresos';
        if (v.startsWith('gas') || v.startsWith('expen')) return 'expensas';
        return v;
      };
      const t = normalizeType(type);
      const filtered = Array.isArray(data)
        ? data.filter((cat) => normalizeType(cat.type) === t)
        : [];
      setCategories(filtered);
    } catch (error) {
      console.error('Error cargando categorias:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description || '',
        category: formData.category ? parseInt(formData.category) : null,
      };
      if (!payload.amount || !payload.date || !payload.category) {
        throw new Error('Complete monto, fecha y categoría');
      }
      if (type === 'ingresos') {
        await api.createIngreso(token, payload);
      } else {
        await api.createExpensa(token, payload);
      }
      setFormData({ amount: '', date: new Date().toISOString().split('T')[0], description: '', category: '' });
      onSuccess?.();
    } catch (error) {
      console.error('Error creando transacción:', error);
      alert(error.message || 'Error creando transacción');
    }
  };

  return (
    <div className="rounded border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Agregar {type === 'ingresos' ? 'Ingreso' : 'Gasto'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Monto
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Seleccionar...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Descripción
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            placeholder="Opcional"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={`mt-4 w-full ${type === 'ingresos' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white py-3 rounded transition font-medium`}
      >
        Agregar {type === 'ingresos' ? 'Ingreso' : 'Gasto' }
      </button>
    </div>
  );
};

export default TransactionForm;
