import { create } from "zustand";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set, get) => ({
    authUser: null,

    isSigningIn: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isCreatingProfile: false,
    isUpdatingProfile: false,
    isResending: false,
    isVerifing: false,
    isLoadingProfile: false,

    searchResult: null,

    isProfileCreated: false,
    isVerificationCodeSent: false,

    isVerified: false,

    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axios.get(`${API}/auth/check`, {
                withCredentials: true
            });
            set({ authUser: res.data });
            set({ isProfileCreated: res.data.isProfileCreated });
            get().connectSocket();
        } catch (error) {
            console.error(error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    resendVerification: async () => {
        try {
            set({ isResending: true });
            const email = localStorage.getItem("email");

            if (!email) {
                toast.error("Some error occurred! Please retry");
                return;
            }

            await axios.post(`${API}/auth/resend`, { email }, {
                withCredentials: true
            });
            toast.success("Verification code resent");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to resend code");
        } finally {
            set({ isResending: false });
        }
    },

    signup: async (data, navigate) => {
        try {
            set({ isSigningIn: true });
            const res = await axios.post(`${API}/auth/signup`, data, {
                withCredentials: true
            });

            localStorage.setItem("email", res.data.email);

            toast.success("Verification code sent");
            set({ isVerificationCodeSent: true });
            navigate("/otp");
        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Signup failed");
            console.error(error);
        } finally {
            set({ isSigningIn: false });
        }
    },

    login: async (data, navigate) => {
        try {
            set({ isLoggingIn: true });
            const res = await axios.post(`${API}/auth/login`, data, {
                withCredentials: true
            });
            toast.success("Login successful");

            
            set({ isProfileCreated: res.data.isProfileCreated });
            set({ authUser: res.data });
            get().connectSocket();
            if (res.data.isProfileCreated) {
                navigate("/chat");
            } else {
                navigate("/profile");
            }

        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    verifyEmail: async (code, navigate) => {
        try {
            set({ isVerifing: true });
            const email = localStorage.getItem('email');
            const res = await axios.post(`${API}/auth/verify`, { email, verificationCode: code }, {
                withCredentials: true
            });

            if (res.status === 201) {
                set({
                    authUser: res.data,
                    isVerified: true,
                    isVerificationCodeSent: false
                });

                localStorage.setItem("isVerified", true);
                toast.success("Verification Success");

                navigate("/profile");
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message ??
                error?.message ??
                "Verification failed"
            );
        } finally {
            set({ isVerifing: false });
            localStorage.clear();
        }
    },

    createProfile: async (data, navigate) => {
        try {
            set({ isCreatingProfile: true });

            const requiredFields = ['name', 'username', 'bio', 'gender'];
            const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');

            if (missingFields.length > 0) {
                toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
                return;
            }

            const res = await axios.post(`${API}/profile/create`, data, {
                withCredentials: true
            });
            if (res.status === 201) {
                toast.success("Profile created successfully");
                set({ isProfileCreated: true });
                get().connectSocket();
                navigate("/chat");
            } else {
                toast.error(`${res.data?.message}` || "Profile creation failed");
            }

        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Profile creation failed");
        } finally {
            set({ isCreatingProfile: false });
        }
    },

    viewProfile: async (data) => {
        try {
            set({ isLoadingProfile: true });
            const res = await axios.get(`${API}/profile/view`, {
                params: { userId: data.userId },
                withCredentials: true
            });

            if (res.status === 200) {
                return res.data;
            } else if (res.status === 404) {
                toast.error("Profile not found!");
            } else {
                toast.error("Unexpected server error");
            }

        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Some error occurred");
        } finally {
            set({ isLoadingProfile: false });
        }
    },

    updateProfile: async (data, navigate) => {
        try {
            set({ isUpdatingProfile: true });

            const requiredFields = ['name', 'bio'];
            const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');

            if (missingFields.length > 0) {
                toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
                return;
            }

            const res = await axios.post(`${API}/profile/update`, data, {
                withCredentials: true
            });
            if (res.status === 200) {
                toast.success("Profile Updated successfully");
                navigate("/profile/view");
            } else {
                toast.error(`${res.data?.message}` || "Profile update failed");
            }

        } catch (error) {
            toast.error(`${error.response?.data?.message}` || "Some error occurred");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    searchUser: async (searchValue) => {
        try {
            const res = await axios.get(`${API}/profile/search/${searchValue}`, {
                withCredentials: true
            });
            set({ searchResult: res.data.result });
        } catch (error) {
            set({ searchResult: null });
        }
    },

    logout: async (navigate) => {
        try {
            await axios.post(`${API}/auth/logout`, {}, {
                withCredentials: true
            });
            // window.location.reload();
            navigate('/');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || "Some error occurred!");
        }
    },

    connectSocket: () => {
        const { authUser, isProfileCreated } = get();
        if (!authUser || !isProfileCreated || get().socket?.connected)
            return;
        const socket = io(import.meta.env.VITE_BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (onlineUserIds) => {
            set({ onlineUsers: [...onlineUserIds] });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected)
            get().socket.disconnect();
    }
}));
