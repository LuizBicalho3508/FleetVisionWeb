// Local: src/api/apiClient.js
import axios from 'axios';

const BASE_URL = 'https://fleetvision.com.br'; 

// Helper para pegar usuário logado
const getUserName = () => {
    const userStr = localStorage.getItem('traccar_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        return user.name || user.email;
    }
    return 'Desconhecido';
};

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
});

apiClient.interceptors.request.use((config) => {
    const authToken = localStorage.getItem('traccar_auth_token');
    if (authToken && config.url !== '/session') {
      config.headers['Authorization'] = authToken;
    }
    if (config.url === '/session' && config.method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.data = new URLSearchParams(config.data);
    }
    return config;
}, (error) => Promise.reject(error));

export const adminApiClient = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
});

// Injeta o nome do usuário no header para auditoria
adminApiClient.interceptors.request.use((config) => {
    config.headers['X-User-Name'] = getUserName();
    return config;
});

export default apiClient;