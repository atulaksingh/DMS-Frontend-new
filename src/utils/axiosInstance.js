// // src/utils/axiosInstance.js
// import axios from "axios";

// const instance = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// instance.interceptors.request.use((config) => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user?.access) {
//         config.headers.Authorization = `Bearer ${user.access}`;
//     }
//     return config;
// });

// export default instance;


// src/utils/axiosInstance.js
import axios from "axios";

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

export default instance;


