import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const Dashboard = () => {
  const { token } = useAuth();
  const [ingresos, setIngresos] = useState([]);
  const [expensas, setExpensas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const now = new Date();
      const monthStr = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const ym = `${year}-${monthStr}`; // YYYY-MM

      const [ingresosData, expensasData, cats] = await Promise.all([
        api.getIngresos(token, '?ordering=-date'),
        api.getExpensas(token, '?ordering=-date'),
        api.getCategories(token)
      ]);

      // Filter current month on client
      const inMonth = (d) => (d || '').slice(0, 7) === ym;
      setIngresos(Array.isArray(ingresosData) ? ingresosData.filter(i => inMonth(i.date)) : []);
      setExpensas(Array.isArray(expensasData) ? expensasData.filter(e => inMonth(e.date)) : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const catMap = categories.reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});
  const getCatName = (item) => item.category_name || catMap[item.category] || 'Sin categoría';

  const totalIngresos = ingresos.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const totalExpensas = expensas.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const balance = totalIngresos - totalExpensas;

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard - Mes Actual</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded p-6 border">
          <div className="flex items-center justify-between mb-2">
            <span className="opacity-70">Total Ingresos</span>
          </div>
          <p className="text-3xl font-bold">${totalIngresos.toFixed(2)}</p>
          <p className="opacity-70 text-sm mt-2">{ingresos.length} transacciones</p>
        </div>

        <div className="rounded p-6 border">
          <div className="flex items-center justify-between mb-2">
            <span className="opacity-70">Total Gastos</span>
          </div>
          <p className="text-3xl font-bold">${totalExpensas.toFixed(2)}</p>
          <p className="opacity-70 text-sm mt-2">{expensas.length} transacciones</p>
        </div>

        <div className="rounded p-6 border">
          <div className="flex items-center justify-between mb-2">
            <span className="opacity-70">Balance</span>
          </div>
          <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
          <p className="opacity-70 text-sm mt-2">
            {balance >= 0 ? 'Superávit' : 'Déficit'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded border p-6">
          <h3 className="text-lg font-semibold mb-4">Últimos Ingresos</h3>
          <div className="space-y-3">
            {ingresos.slice(0, 5).map((ingreso) => (
              <div key={ingreso.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{getCatName(ingreso)}</p>
                  <p className="text-sm opacity-70">{ingreso.date}</p>
                </div>
                <p className="text-green-600 font-semibold">${ingreso.amount}</p>
              </div>
            ))}
            {ingresos.length === 0 && (
              <p className="opacity-70 text-center py-4">No hay ingresos este mes</p>
            )}
          </div>
        </div>

        <div className="rounded border p-6">
          <h3 className="text-lg font-semibold mb-4">Últimos Gastos</h3>
          <div className="space-y-3">
            {expensas.slice(0, 5).map((expensa) => (
              <div key={expensa.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{getCatName(expensa)}</p>
                  <p className="text-sm opacity-70">{expensa.date}</p>
                </div>
                <p className="text-red-600 font-semibold">${expensa.amount}</p>
              </div>
            ))}
            {expensas.length === 0 && (
              <p className="opacity-70 text-center py-4">No hay gastos este mes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

