import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Dashboard from './Dashboard.jsx';
import IngresosPage from '../pages/Ingresos.jsx';
import ExpensasPage from '../pages/Gastos.jsx';
import CategoriasPage from '../pages/Categorias.jsx';

const Layout = () => {
  const { logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="text-xl font-bold">Gestor de Gastos</div>
              <div className="flex space-x-2 overflow-x-auto md:overflow-visible">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-3 py-2 rounded ${currentPage === 'dashboard' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('ingresos')}
                  className={`px-3 py-2 rounded ${currentPage === 'ingresos' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                >
                  Ingresos
                </button>
                <button
                  onClick={() => setCurrentPage('expensas')}
                  className={`px-3 py-2 rounded ${currentPage === 'expensas' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                >
                  Gastos
                </button>
                <button
                  onClick={() => setCurrentPage('categorias')}
                  className={`px-3 py-2 rounded ${currentPage === 'categorias' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                >
                  Categorias
                </button>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'ingresos' && <IngresosPage />}
        {currentPage === 'expensas' && <ExpensasPage />}
        {currentPage === 'categorias' && <CategoriasPage />}
      </main>
    </div>
  );
};

export default Layout;
