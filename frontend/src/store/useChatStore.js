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

    listenMessages: (user) => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            set((state) => {
                const alreadyExists = state.messages.some((m) => m._id === newMessage._id);

                const updatedMessages = alreadyExists
                    ? state.messages
                    : [...state.messages, newMessage];

                const isFromOtherUser = newMessage.senderId !== user?.userId;
                const alreadyInUnread = state.unreadMessages.some(
                    (msg) => msg._id === newMessage._id
                );

                const updatedUnread = isFromOtherUser && !alreadyInUnread
                    ? [...state.unreadMessages, newMessage]
                    : state.unreadMessages;

                return {
                    messages: updatedMessages,
                    unreadMessages: updatedUnread,
                };
            });
        };

        const handleTyping = ({ senderId, typing }) => {
            if (senderId === user.userId) {
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

    sendMessage: async (selected, message, file) => {
        try {
            if (!selected) return;
    
            const id = selected.userId;
    
            const formData = new FormData();
            formData.append('message', message);
    
            if (file) {
                formData.append('media', file);
            }

            const newMessage = await axiosInstance.post(`/messages/send/${id}`, formData);
    
            set((state) => ({ messages: [...state.messages, newMessage.data.data] }));
    
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred");
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
    
        const tempId = `ai-${Date.now()}`;
        const placeholder = { _id: tempId, prompt, response: null, createdAt: new Date().toISOString() };
    
        set((state) => ({
            aiMessages: [...state.aiMessages, placeholder],
        }));
    
        try {
            const response = await axiosInstance.post("/messages/ai", { prompt });
            const result = response.data;
    
            set((state) => ({
                aiMessages: state.aiMessages.map((msg) =>
                    msg._id === tempId
                        ? {
                            ...msg,
                            response: result.data,
                            createdAt: result.createdAt || msg.createdAt,
                        }
                        : msg
                ),
            }));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            set({ isResponseLoading: false });
        }
    }    
}));