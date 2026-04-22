import axios from "axios";

const api = axios.create({
    baseURL: "https://api-araf.vue.aait-d.com/",
});

const getLanguage = () => localStorage.getItem('lang') || 'ar';

api.interceptors.request.use(
    (request) => {
        request.headers['Accept-Language'] = getLanguage();
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Error Handeling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 404) {
            window.location.href = "/404";
        }

        if (status === 403) {
            window.location.href = "/403";
        }

        return Promise.reject(error);
    }
);

export default api;

