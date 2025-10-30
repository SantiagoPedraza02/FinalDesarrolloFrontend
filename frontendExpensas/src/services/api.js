const VITE_API_URL = 'https://disciplined-smile-production.up.railway.app/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    let detail = 'Error en la solicitud';
    try {
      const data = await response.json();
      detail = data?.detail || JSON.stringify(data);
    } catch (_) {}
    throw new Error(`${response.status}: ${detail}`);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return null;
};

const api = {

  login: async (username, password) => {
    const response = await fetch(`${VITE_API_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },
  refresh: async (refreshToken) => {
    const response = await fetch(`${VITE_API_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });
    return handleResponse(response);
  },

  getCategories: async (token) => {
    const response = await fetch(`${VITE_API_URL}/categorias/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },
  createCategory: async (token, data) => {
    const response = await fetch(`${VITE_API_URL}/categorias/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  deleteCategory: async (token, id) => {
    const response = await fetch(`${VITE_API_URL}/categorias/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },
  // Ingresos
  getIngresos: async (token, filters = '') => {
    const response = await fetch(`${VITE_API_URL}/ingresos/${filters}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  createIngreso: async (token, data) => {
    const response = await fetch(`${VITE_API_URL}/ingresos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteIngreso: async (token, id) => {
    const response = await fetch(`${VITE_API_URL}/ingresos/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  // Expensas
  getExpensas: async (token, filters = '') => {
    const response = await fetch(`${VITE_API_URL}/expensas/${filters}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  createExpensa: async (token, data) => {
    const response = await fetch(`${VITE_API_URL}/expensas/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteExpensa: async (token, id) => {
    const response = await fetch(`${VITE_API_URL}/expensas/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }
};

export default api;
