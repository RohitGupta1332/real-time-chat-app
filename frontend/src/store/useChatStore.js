import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/userAuth.js";

const BASE_URL = import.meta.env.VITE_API_URL;

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
            const res = await axios.get(`${BASE_URL}/messages/users`, { withCredentials: true });
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (id) => {
        set({ isMessageLoading: true });
        try {
            const res = await axios.get(`${BASE_URL}/messages/${id}`, { withCredentials: true });
            set({ messages: res.data.messages });
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    listenMessages: (userId, selected_user) => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            set((state) => {
                const alreadyExists = state.messages.some((m) => m._id === newMessage._id);
                const updatedMessages = alreadyExists
                    ? state.messages
                    : [...state.messages, newMessage];

                const isFromOtherUser = newMessage.senderId === userId;
                const isNotCurrentlyViewedUser = selected_user?.userId !== userId;
                const alreadyInUnread = state.unreadMessages.some(
                    (msg) => msg._id === newMessage._id
                );

                const shouldAddToUnread = isFromOtherUser && isNotCurrentlyViewedUser && !alreadyInUnread;

                const updatedUnread = shouldAddToUnread
                    ? [...state.unreadMessages, newMessage]
                    : state.unreadMessages;

                return {
                    messages: updatedMessages,
                    unreadMessages: updatedUnread,
                };
            });
        };

        const handleTyping = ({ senderId, typing }) => {
            if (senderId === userId) {
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
            await axios.post(`${BASE_URL}/messages/typing`, {
                receiverId,
                typing,
            }, { withCredentials: true });
        } catch (error) {
            console.error("Typing status error:", error.response?.data?.message || error.message);
        }
    },

    sendMessage: async (selected, message, file, scheduleTime) => {
        try {
            if (!selected) return;

            const id = selected.userId;

            const formData = new FormData();
            formData.append('message', message);

            if (file) {
                formData.append('media', file);
            }

            if (scheduleTime) {
                formData.append('scheduleTime', scheduleTime);
            }

            const newMessage = await axios.post(`${BASE_URL}/messages/send/${id}`, formData, {
                withCredentials: true,
            });

            set((state) => ({ messages: [...state.messages, newMessage.data.data] }));
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        }
    },

    getAIMessages: async () => {
        set({ isMessageLoading: true });
        try {
            const res = await axios.get(`${BASE_URL}/messages/ai/chats`, { withCredentials: true });
            set({ aiMessages: res.data.messages });
        } catch (error) {
            toast.error(error?.response?.data?.message);
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
            const response = await axios.post(`${BASE_URL}/messages/ai`, { prompt }, { withCredentials: true });
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
            get().getAIMessages();
            set({ isResponseLoading: false });
        }
    },

    deleteChatMessage: async (message_id, chat_id) => {
        try {
            await axios.delete(`${BASE_URL}/messages/delete/${message_id}`, { withCredentials: true });
            toast.success("Message deleted");
            await get().getMessages(chat_id);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong!");
        }
    }
}));
