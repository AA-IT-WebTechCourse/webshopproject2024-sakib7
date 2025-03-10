import axios from "axios";

const axiosApiInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApiInstance.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (user?.token) {
      config.headers.Authorization = `Token ${user?.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default axiosApiInstance;
