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
    isVerificationCodeSent: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            set({ isProfileCreated: res.data.isProfileCreated })
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
            if (res.status === 201) {
                set({ isVerificationCodeSent: true });
                setTimeout(() => navigate("/otp"), 1300);
            }
        } catch (error) {
            console.log(error.response);
            toast.error(`${error.response?.data?.message}` || "Signup failed");
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
            if (res.status === 200) {
                set({ isVerificationCodeSent: false })
                navigate("/profile");
            }
        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Signup failed");
            console.log(error);
        }
    },

    createProfile: async (data) => {
        try {
        set({ isCreatingProfile: true });
        await axiosInstance.post("/profile/create", data);
        toast.success("Profile created successfully");

        await useAuthStore.getState().checkAuth();

    } catch (error) {
        toast.error(`${error.response?.data?.message}` || "Profile creation failed");
    } finally {
        set({ isCreatingProfile: false });
    }
    }
}))