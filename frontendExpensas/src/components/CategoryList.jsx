import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const CategoryList = ({ refreshKey = 0 }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getCategories(token);
        if (mounted) setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        
        console.error('Error cargando categorías:', err);
        alert('Error cargando categorías');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [token, refreshKey]);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.deleteCategory(token, id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
    
      console.error('Error eliminando categoría:', err);
      alert('No se pudo eliminar');
    }
  };

  const normType = (t = '') => {
    const s = (t || '').toLowerCase();
    if (s.startsWith('ingre')) return 'Ingresos';
    if (s.startsWith('gas') || s.startsWith('expen')) return 'Gastos';
    return t || '-';
  };

  if (loading) {
    return <div className="text-center py-12">Cargando…</div>;
  }

  return (
    <div className="rounded border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tipo</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${normType(cat.type) === 'Ingresos' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {normType(cat.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-12 opacity-70">No hay categorías</div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;

