import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import { toast } from "react-toastify"

export const useChatStore = create((set) => ({
    messages: [],
    aiMessages: [],
    users: [],
    selectedUser: null,
    isMessageLoading: false,
    isUserLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance("/messages/users");
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMessages: async (id) => {
        set({ isMessageLoading: true })
        try {
            const res = await axiosInstance(`/messages/${id}`);
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageLoading: false })
        }
    },

    getAIMessages: async () => {
        set({ isMessageLoading: true })
        try {
            const res = await axiosInstance(`/messages/ai/chats`);
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessageLoading: false })
        }

    },

    chatWithAI: async (prompt) => {
        try {
            const response = await axiosInstance.post("/messages/ai", { prompt });
            set((state) => ({
                aiMessages: [...state.aiMessages, { prompt, response: response.data }]
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong!");
        }
    }
}))