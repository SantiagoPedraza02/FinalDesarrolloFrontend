const VITE_API_URL = 'https://disciplined-smile-production.up.railway.app/api';


let authHandlers = {
  getToken: null,     
  tryRefresh: null,   
  logout: null        
};

export const configureAuth = (handlers = {}) => {
  authHandlers = { ...authHandlers, ...handlers };
};

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


const authorizedRequest = async (makeRequest, initialToken) => {
 
  const firstToken = initialToken ?? (typeof authHandlers.getToken === 'function' ? authHandlers.getToken() : null);
  let response = await makeRequest(firstToken);

  if (response && response.status === 401 && typeof authHandlers.tryRefresh === 'function') {
    try {
      const newAccess = await authHandlers.tryRefresh();
      if (!newAccess) {
        if (typeof authHandlers.logout === 'function') authHandlers.logout();
        throw new Error('401: Token expirado o inválido');
      }
      response = await makeRequest(newAccess);
    } catch (e) {
      if (typeof authHandlers.logout === 'function') authHandlers.logout();
      throw e;
    }
  }

  return handleResponse(response);
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
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/categorias/`, {
      headers: { 'Authorization': `Bearer ${t}` }
    }), token);
  },
  createCategory: async (token, data) => {
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/categorias/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${t}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }), token);
  },
  deleteCategory: async (token, id) => {
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/categorias/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${t}` }
    }), token);
  },
  // Ingresos
  getIngresos: async (token, filters = '') => {
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/ingresos/${filters}`, {
      headers: { 'Authorization': `Bearer ${t}` }
    }), token);
  },

  createIngreso: async (token, data) => {
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/ingresos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${t}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }), token);
  },

  deleteIngreso: async (token, id) => {
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/ingresos/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${t}` }
    }), token);
  },

  // Expensas
  getExpensas: async (token, filters = '') => {
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/expensas/${filters}`, {
      headers: { 'Authorization': `Bearer ${t}` }
    }), token);
  },

  createExpensa: async (token, data) => {
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/expensas/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${t}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }), token);
  },

  deleteExpensa: async (token, id) => {
    return authorizedRequest((t) => fetch(`${VITE_API_URL}/expensas/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${t}` }
    }), token);
  }
};

export default api;
