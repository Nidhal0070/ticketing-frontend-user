import axios from "axios";

// Utiliser les variables d'environnement, fallback sur localhost:3000
const apiUrl =  "/api";

console.log('🌐 [API] Using backend URL:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

// Ajouter token automatiquement
api.interceptors.request.use(config => {
  console.log(`📤 [API-REQUEST] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🎫 [API-REQUEST] Token attached to request');
  } else {
    console.log('⚠️  [API-REQUEST] No token found in localStorage');
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API-RESPONSE] ${response.status} - ${response.statusText}`);
    return response;
  },
  (error) => {
    console.error(`❌ [API-ERROR] ${error.response?.status} - ${error.response?.statusText}`);
    console.error('📋 [API-ERROR] Error details:', error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
