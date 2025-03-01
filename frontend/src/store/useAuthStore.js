import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningIn: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isCreatingProfile: false,
    isUpdatingProfile: false,
    isProfileCreated: false,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });
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
            navigate("/otp");
        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Signup failed");
            console.log(error.response.data)
        } finally {
            set({ isSigningIn: false });
        }
    },

    login: async (data) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Login successful");
        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Login failed")
        } finally {
            set({ isLoggingIn: false });
        }
    },

    verifyEmail: async (code, navigate) => {
        try {
            const res = await axiosInstance.post("/auth/verify", { code });
            set({ authUser: res.data });
            navigate("/profile");
        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Signup failed");
            console.log(error);
        }
    },

    createProfile: async (data) => {
        try {
            set({ isCreatingProfile: true });
            const res = await axiosInstance.post("/profile/create", data);
            set({ authUser: res.data });
            toast.success("Profile created successfully");
            set({ isProfileCreated: true });
        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Profile creation failed");
        } finally {
            set({ isCreatingProfile: false });
        }
    }
}))