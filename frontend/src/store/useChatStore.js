import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import { toast } from "react-toastify"

export const useChatStore = create((set) => ({
    messages: [],
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
    }
}))