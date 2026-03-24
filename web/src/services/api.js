import axios from 'axios';

// Servidor Django 
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

function tokenParaRequisicao() {
    const ctx = sessionStorage.getItem('pantexContext') || 'vendedor';
    const tokenFabrica = localStorage.getItem('tokenPantex');
    const tokenVendedor = localStorage.getItem('tokenPantexVendedor');
    if (ctx === 'fabrica') return tokenFabrica || tokenVendedor;
    return tokenVendedor || tokenFabrica;
}

api.interceptors.request.use((config) => {
    const rel = config.url || '';
    // Login/refresh 
    if (rel.includes('login') || rel.includes('refresh')) {
        return config;
    }
    const token = tokenParaRequisicao();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;