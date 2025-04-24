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
      const res = await axiosInstance.get("/group/get-groups");
      set({ groups: res.data.memberships });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  fetchGroupMessages: async (group_id) => {
    console.log('Fetching messages for group:', group_id);
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/group/messages/${group_id}`);
      console.log('Messages received:', res.data.messages);
      set({ groupMessages: res.data.messages });
    } catch (error) {
      console.error('Fetch error:', error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Could not fetch group messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (group_id, text, file) => {
    if (!group_id) {
      toast.error("Invalid group ID");
      return;
    }
    set({ isSendingGroupMessage: true });
    try {
      const formData = new FormData();
      formData.append("group_id", group_id);
      formData.append("text", text);
      if (file) formData.append("media", file);
      const res = await axiosInstance.post("/group/send", formData);
      set((state) => ({
        groupMessages: [...state.groupMessages, res.data.newMessage],
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingGroupMessage: false });
    }
  },

  createGroup: async (group_name, user_ids = [], group_description, group_icon) => {
    try {
      const formData = new FormData();
      formData.append("group_name", group_name);
      formData.append("description", group_description);
  
      if (group_icon) {
        formData.append("group_icon", group_icon);
      }

      const response = await axiosInstance.post("/group/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const group = response?.data?.group;
  
      if (!group || !group._id) {
        throw new Error("Invalid group data received from the server");
      }
      toast.success("Group created successfully");
  
      if (user_ids.length > 0) {
        try {
          await get().addGroupMembers(group._id, user_ids);
        } catch (memberError) {
          toast.error("Failed to add group members");
          console.error("Add group members error:", memberError);
        }
      }
  
      await get().fetchGroups();
  
      return group;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to create group";
      toast.error(errorMessage);
      console.error("Create group error:", error);
      throw error;
    }
  }, 
  
  

  deleteGroup: async (group_id) => {
    try {
      await axiosInstance.delete(`/group/delete/${group_id}`);
      toast.success("Group deleted");
      get().fetchGroups();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not delete group");
    }
  },

  fetchGroupMembers: async (group_id) => {
    set({ isFetchingMembers: true });
    try {
      const res = await axiosInstance.get("/group/get-members", {
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
      const res = await axiosInstance.post("/group/add-members", {
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
      await axiosInstance.delete("/group/remove", {
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
