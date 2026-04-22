import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api-araf.vue.aait-d.com";

const api = axios.create({
    baseURL: API_BASE_URL,
});


const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No auth token found in localStorage');
        return null;
    }
    return token;
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
        const status = error.response?.status;
        console.error('API Error:', status, error.response?.data || error.message);

        if (status === 401) {
            console.warn('Unauthorized request or expired token - check your token');
        }

        if (status === 404) {
            console.warn('Not found');
        }

        if (status === 403) {
            console.warn('Forbidden');
        }

        return Promise.reject(error);
    }
);

export default api;
