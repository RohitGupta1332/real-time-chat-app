import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://real-time-chat-app-pbgx.onrender.com/api/",
    withCredentials: true
});