import axios from "axios";

// Créer une instance Axios avec une configuration de base
const api = axios.create({
  baseURL: "http://localhost:3000/api", // URL de votre API backend
  withCredentials: true, // Inclure les cookies dans les requêtes
});
axios.defaults.withCredentials = true;

// Intercepteur de requête (à ajuster si nécessaire)
api.interceptors.request.use(
  (config) => {
    // Ici, tu n'as pas besoin de gérer manuellement le token car il est stocké dans un cookie
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
