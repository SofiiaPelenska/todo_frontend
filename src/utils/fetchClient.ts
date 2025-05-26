const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5050';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(
  endpoint: string,
  method: RequestMethod = 'GET',
  data?: object,
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json();
}

export const client = {
  get: <T>(endpoint: string) => request<T>(endpoint, 'GET'),
  post: <T>(endpoint: string, data?: object) =>
    request<T>(endpoint, 'POST', data),
  patch: <T>(endpoint: string, data: object) =>
    request<T>(endpoint, 'PATCH', data),
  delete: <T>(endpoint: string) => request<T>(endpoint, 'DELETE'),
};
