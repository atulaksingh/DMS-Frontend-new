import axios from "axios";
import { jwtDecode } from "jwt-decode";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 🔹 Interceptor: Attach token from localStorage
instance.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem("user"); // ✅ changed
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user?.access) {
                config.headers.Authorization = `Bearer ${user.access}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token invalid or expired → clear session and redirect
            localStorage.removeItem("user");
            window.location.href = "/login"; // 👈 redirect to login page
        }
        return Promise.reject(error);
    }
);

// 🔹 Helper: Get user role
export function getUserRole() {
    const storedUser = localStorage.getItem("user"); // ✅ changed
    if (!storedUser) return null;
    try {
        const user = JSON.parse(storedUser);
        if (user?.access) {
            const decoded = jwtDecode(user.access);
            return decoded.role || null;
        }
        return null;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

export default instance;
