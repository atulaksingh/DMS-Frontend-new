import axios from "axios";
// import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";


const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem("user");
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

export function getUserRole() {
    const storedUser = localStorage.getItem("user");
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


