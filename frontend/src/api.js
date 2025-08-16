import axios from 'axios'

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL
})

export const productApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_URL
})

export function setAuthToken(token) {
  if (token) {
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
    productApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete authApi.defaults.headers.common['Authorization']
    delete productApi.defaults.headers.common['Authorization']
  }
}

export const getUsers = () => authApi.get('/users');
export const updateUserRole = (id, role) => authApi.put(`/users/${id}/role`, { role });

