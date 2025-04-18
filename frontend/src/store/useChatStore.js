import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/userAuth.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    aiMessages: [],
    users: [],
    searchResult: [],
    unreadMessages: [],

    isMessageLoading: false,
    isUserLoading: false,
    isResponseLoading: false,
    isUserTyping: false,


    getUsersForSidebar: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            console.log(res);
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
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            if (newMessage.senderId !== selected?.userId)
                set({ unreadMessages: [...get().unreadMessages, newMessage] });

            set((state) => {
                const exists = state.messages.some(m => m._id === newMessage._id);
                if (exists) return state;
                return { messages: [...state.messages, newMessage] };
            });
        };

        const handleTyping = ({ senderId, typing }) => {
            if (senderId === selected.userId) {
                set({ isUserTyping: typing });
            }
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("typing", handleTyping);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("typing", handleTyping);
        };
    },

    sendTypingStatus: async (receiverId, typing) => {
        try {
            await axiosInstance.post("/messages/typing", {
                receiverId,
                typing,
            });
        } catch (error) {
            console.error("Typing status error:", error.response?.data?.message || error.message);
        }
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