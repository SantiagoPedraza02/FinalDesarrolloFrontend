import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      // aquí puedes redirigir si hace falta
    } catch {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Columna izquierda: formulario */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Marca / título */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              {/* Logo simple (opcional) */}
              <div className="h-8 w-8 rounded-full bg-indigo-600"></div>
              <span className="text-xl font-semibold">Santiago Daniel Pedraza</span>
            </div>
            <h1 className="text-3xl font-bold mt-6">Gestor de Ingresos y Gastos</h1>
            <p className="opacity-70 mt-2">
              Controla tus finanzas personales de manera fácil y segura.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="seu@email.com"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  contraseña
                </label>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div
                className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Entrar
            </button>

            
          
          </form>
        </div>
      </div>

      {/* Coluna direita: fundo decorado */}
      <div className="hidden md:block relative">
        {/* Degradê de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500" />

        {/* Blobs suaves (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="g1" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="220" cy="200" r="220" fill="url(#g1)"></circle>
          <circle cx="620" cy="420" r="260" fill="url(#g1)"></circle>
          <circle cx="400" cy="640" r="200" fill="url(#g1)"></circle>
        </svg>

        {/* Sutil borda/curva no centro (opcional) */}
        <div className="absolute left-0 top-0 h-full w-1 bg-white/10"></div>
      </div>
    </div>
  );
};

export default Login;


