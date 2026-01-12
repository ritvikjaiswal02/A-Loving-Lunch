const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for making API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }

    return { data };
  } catch (error: any) {
    return { error: error.message || 'Network error' };
  }
}

// Auth API
export const authApi = {
  register: (username: string, email: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () => apiCall('/auth/me'),
};

// BentoBox API
export const bentoBoxApi = {
  create: (bentoBox: any) =>
    apiCall('/bentoboxes', {
      method: 'POST',
      body: JSON.stringify(bentoBox),
    }),

  getUserBoxes: () => apiCall('/bentoboxes/my'),

  getById: (id: string) => apiCall(`/bentoboxes/${id}`),

  update: (id: string, bentoBox: any) =>
    apiCall(`/bentoboxes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bentoBox),
    }),

  delete: (id: string) =>
    apiCall(`/bentoboxes/${id}`, {
      method: 'DELETE',
    }),

  getPublic: () => apiCall('/bentoboxes/public'),
};

export default { authApi, bentoBoxApi };
