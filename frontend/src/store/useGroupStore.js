import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { useAuthStore } from "./userAuth";

export const useGroupStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  groupMembers: [],
  unreadGroupMessages: [],

  isGroupsLoading: false,
  isGroupMessagesLoading: false,
  isSendingGroupMessage: false,
  isFetchingMembers: false,

  fetchGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups/get-groups");
      set({ groups: res.data.memberships });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  fetchGroupMessages: async (group_id) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/messages/${group_id}`);
      set({ groupMessages: res.data.messages });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not fetch group messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (group_id, text, file) => {
    set({ isSendingGroupMessage: true });
    try {
      const formData = new FormData();
      formData.append("group_id", group_id);
      formData.append("text", text);
      if (file) formData.append("media", file);

      const res = await axiosInstance.post("/groups/send", formData);
      set((state) => ({
        groupMessages: [...state.groupMessages, res.data.newMessage],
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingGroupMessage: false });
    }
  },

  createGroup: async (group_name) => {
    try {
      const res = await axiosInstance.post("/groups/create", { group_name });
      toast.success("Group created successfully");
      get().fetchGroups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create group");
    }
  },

  deleteGroup: async (group_id) => {
    try {
      await axiosInstance.delete(`/groups/delete/${group_id}`);
      toast.success("Group deleted");
      get().fetchGroups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not delete group");
    }
  },

  fetchGroupMembers: async (group_id) => {
    set({ isFetchingMembers: true });
    try {
      const res = await axiosInstance.get("/groups/get-members", {
        params: { group_id },
      });
      set({ groupMembers: res.data.groupDetail });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not fetch members");
    } finally {
      set({ isFetchingMembers: false });
    }
  },

  addGroupMembers: async (group_id, user_ids) => {
    try {
      const res = await axiosInstance.post("/groups/add-members", {
        group_id,
        user_ids,
      });
      toast.success(res.data.message);
      get().fetchGroupMembers(group_id);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add members");
    }
  },

  removeGroupMember: async (group_id, user_id) => {
    try {
      await axiosInstance.delete("/groups/remove", {
        data: { group_id, user_id },
      });
      toast.success("Member removed");
      get().fetchGroupMembers(group_id);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove member");
    }
  },

  listenGroupMessages: (group_id) => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const handleGroupMessage = (newMessage) => {
      set((state) => ({
        groupMessages: [...state.groupMessages, newMessage],
        unreadGroupMessages:
          newMessage.group_id === group_id
            ? state.unreadGroupMessages
            : [...state.unreadGroupMessages, newMessage],
      }));
    };

    socket.on("groupMessage", handleGroupMessage);

    return () => {
      socket.off("groupMessage", handleGroupMessage);
    };
  },
}));
