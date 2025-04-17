import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/userAuth.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    aiMessages: [],
    users: [],
    searchResult: [],
    isMessageLoading: false,
    isUserLoading: false,
    isResponseLoading: false,

    getUsersForSidebar: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
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
            set({ messages: res.data.messages });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    listenMessages: (selected) => {
        if (!selected) return;
    
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
    
        const handleNewMessage = (newMessage) => {
            if (newMessage.senderId !== selected.userId) return;
    
            console.log("Message received:", newMessage);
    
            set((state) => {
                const exists = state.messages.some(m => m._id === newMessage._id);
                if (exists) return state;
                return { messages: [...state.messages, newMessage] };
            });
        };
    
        socket.on("newMessage", handleNewMessage);
    
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    },
    

    unsubscribeMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    sendMessage: async (selected, message) => {
        try {
            if (!selected) return;
            const id = selected.userId;
    
            const newMessage = {
                senderId: useAuthStore.getState().authUser._id,
                receiverId: id,
                text: message,
                type: "text",
                createdAt: new Date().toISOString()
            };
            set((state) => ({ messages: [...state.messages, newMessage] }));
    
            await axiosInstance.post(`/messages/send/${id}`, {
                message: message,
                media: null
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