import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api-araf.vue.aait-d.com";

const api = axios.create({
    baseURL: API_BASE_URL,
});


const getToken = () => {
    const token = localStorage.getItem('token');
    return token || null;
};

api.interceptors.request.use(
    (request) => {
        const token = getToken();
        if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
        }
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(error);
        return Promise.reject(error);
    }
);

export default api;
