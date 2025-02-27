import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningIn: false,
    isLoggingIn: false,
    isCheckingAuth: true,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res });
        } catch (error) {
            console.error(error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data, navigate) => {
        try {
            set({ isSigningIn: true });
            const res = await axiosInstance.post("/auth/signup", data);
            navigate("/otp")
        } catch (error) {
            toast.error(`${error.response?.data?.message} || "Signup failed`);
            console.log(error.response.data)
        } finally {
            set({ isSigningIn: false });
        }
    }

    //create a handleOTP method in otp.jsx on otp submission and inside that call the otp method, write the api calling here
}))