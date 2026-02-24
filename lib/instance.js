import axios from 'axios';

// Tạo instance của Axios
const instance = axios.create({
    // Vì Next.js chạy chung FE và BE, ta chỉ cần gọi base URL là /api
    // Nó sẽ tự hiểu là gọi vào thư mục app/api/ của dự án
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động nhét Token vào mỗi lần gọi API
instance.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage (hoặc bạn có thể nâng cấp lên lấy từ Cookie sau)
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;