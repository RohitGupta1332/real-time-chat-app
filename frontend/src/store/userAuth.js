import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningIn: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isCreatingProfile: false,
    isUpdatingProfile: false,
    isProfileCreated: false,
    isVerificationCodeSent: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            set({ isProfileCreated: res.data.isProfileCreated })
            get().connectSocket();
        } catch (error) {
            console.error(error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    resendVerification: async () => {
        try {
            const email = localStorage.getItem("email");
            if (!email) toast.error("Some error occured! Please retry");
    
            await axiosInstance.post("/auth/resend", { email });
            toast.success("Verification code resent");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to resend code");
        }
    },    

    signup: async (data, navigate) => {
        try {
            set({ isSigningIn: true });
            const res = await axiosInstance.post("/auth/signup", data);

            localStorage.setItem("email", res.data.email);
            
            toast.success("Verification code sent")
            set({ isVerificationCodeSent: true });
            setTimeout(() => navigate("/otp"), 100);
        } catch (error) {
            console.log(error.response);
            toast.error(`${error.response?.data?.message}` || "Signup failed");
        } finally {
            set({ isSigningIn: false });
        }
    },

    login: async (data, navigate) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post("/auth/login", data);
            toast.success("Login successful");

            get().connectSocket();

            setTimeout(() => {
                set({ isProfileCreated: res.data.isProfileCreated });
                set({ authUser: res.data });

                if (res.data.isProfileCreated) {
                    navigate("/chat");
                } else {
                    navigate("/profile");
                }
            }, 10);


        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Login failed")
        } finally {
            set({ isLoggingIn: false });
        }
    },

    verifyEmail: async (code, navigate) => {
        console.log(code)
        try {
            const res = await axiosInstance.post("/auth/verify", { code });
            console.log(res.status)
            set({ authUser: res.data });
            if (res.status === 200) {
                toast.success("Verification Success")
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
            const res = await axiosInstance.post("/profile/create", data);
            if (res.status === 201)
                toast.success("Profile created successfully");
            else
                toast.error(`${error.response?.data?.message}` || "Profile creation failed")

            await useAuthStore.getState().checkAuth();

            get().connectSocket();

        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Profile creation failed");
        } finally {
            set({ isCreatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, isProfileCreated } = get();
        if (!authUser || !isProfileCreated || get().socket?.connected)
            return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (onlineUserIds) => {
            set({ onlineUsers: [...onlineUserIds] });
        })

    },

    disconnectSocket: () => {
        if (get().socket?.connected)
            get().socket.disconnect();
    }
}))