import axios from "axios";

const instance = axios.create({
    baseURL: '/api', // QUAN TRỌNG: Đổi thành /api vì Next.js chạy chung 1 server
    timeout: 10000,
});

instance.interceptors.request.use(
    (config) => {
        // Lấy token từ Local Storage nhét vào header của API
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;