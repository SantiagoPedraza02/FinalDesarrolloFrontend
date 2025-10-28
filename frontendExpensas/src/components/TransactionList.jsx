import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const TransactionList = ({ type }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const [data, cats] = await Promise.all([
        type === 'ingresos' ? api.getIngresos(token, '?ordering=-date') : api.getExpensas(token, '?ordering=-date'),
        api.getCategories(token)
      ]);
      setTransactions(Array.isArray(data) ? data : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const catMap = categories.reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});
  const catName = (t) => t.category_name || catMap[t.category] || 'Sin categoría';

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta transacción?')) return;
    try {
      if (type === 'ingresos') {
        await api.deleteIngreso(token, id);
      } else {
        await api.deleteExpensa(token, id);
      }
      loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error al eliminar');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="rounded border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Descripción</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Monto</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${type === 'ingresos' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {catName(transaction)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {transaction.description || '-'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${type === 'ingresos' ? 'text-green-600' : 'text-red-600'}`}>
                  ${parseFloat(transaction.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="text-center py-12 opacity-70">
            No hay {type} registrados
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;

