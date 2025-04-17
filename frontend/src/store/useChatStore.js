import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/userAuth.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    aiMessages: [],
    users: [],
    searchResult: [],
    selectedUser: null,
    isMessageLoading: false,
    isUserLoading: false,
    isResponseLoading: false,

    getUsersForSidebar: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
            console.log(res.data)
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (id) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${id}`);
            console.log("Messages loaded:", res.data.messages); // Debug log for loaded messages
            set({ messages: res.data.messages });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    listenMessages: () => {
        console.log("Hello")
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) {
                return;
            }
            console.log("Message received:", newMessage); // Debug log for received message
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsubscribeMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    sendMessage: async (selectedUser, message) => {
        try {
            if (!selectedUser) return;
            const id = selectedUser._id;
            const res = await axiosInstance.post(`/messages/send/${id}`, {
                message: message, // Wrap the message object
                media: null // Add media if needed, or null if not used
            });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    getAIMessages: async () => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/ai/chats`);
            set({ aiMessages: res.data.messages });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    chatWithAI: async (prompt) => {
        set({ isResponseLoading: true });
        try {
            const response = await axiosInstance.post("/messages/ai", { prompt });
            const result = response.data;
            set((state) => ({
                aiMessages: [...state.aiMessages, { prompt, response: result.data }],
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            set({ isResponseLoading: false });
        }
    },
}));