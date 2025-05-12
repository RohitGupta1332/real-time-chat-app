import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthStore } from "./userAuth";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useGroupStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  groupMembers: [],
  unreadGroupMessages: [],

  isGroupsLoading: false,
  isGroupMessagesLoading: false,
  isSendingGroupMessage: false,
  isFetchingMembers: false,

  groupTypingUsers: {},

  fetchGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axios.get(`${BASE_URL}/group/get-groups`, {
        withCredentials: true,
      });
      set({ groups: res.data.memberships });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to fetch groups";
      toast.error(errorMessage);
      console.error(errorMessage);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  fetchGroupMessages: async (group_id) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axios.get(`${BASE_URL}/group/messages/${group_id}`, {
        withCredentials: true,
      });
      set((state) => ({
        groupMessages: res.data.messages,
        unreadGroupMessages: state.unreadGroupMessages.filter(
          (msg) => msg.group_id !== group_id
        ),
      }));
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Could not fetch group messages";
      toast.error(errorMessage);
      console.error('Fetch error:', errorMessage);
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (group_id, text, file, scheduleTime) => {
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
      if (scheduleTime) formData.append('scheduleTime', scheduleTime);

      const res = await axios.post(`${BASE_URL}/group/send`, formData, {
        withCredentials: true,
      });
      set((state) => ({
        groupMessages: [...state.groupMessages, res.data.newMessage],
      }));
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
      console.error(errorMessage);
    } finally {
      set({ isSendingGroupMessage: false });
    }
  },

  createGroup: async (group_name, user_ids = [], group_description, group_icon) => {
    try {
      const formData = new FormData();
      formData.append("group_name", group_name);
      formData.append("description", group_description);
      if (group_icon) formData.append("group_icon", group_icon);

      const response = await axios.post(`${BASE_URL}/group/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const group = response?.data?.group;
      if (!group || !group._id) throw new Error("Invalid group data received from the server");

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
      console.error("Create group error:", errorMessage);
      throw error;
    }
  },

  deleteGroup: async (group_id) => {
    try {
      await axios.delete(`${BASE_URL}/group/delete/${group_id}`, {
        withCredentials: true,
      });
      toast.success("Group deleted");
      get().fetchGroups();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Could not delete group";
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  },

  fetchGroupMembers: async (group_id) => {
    set({ isFetchingMembers: true });
    try {
      const res = await axios.get(`${BASE_URL}/group/get-members`, {
        params: { group_id },
        withCredentials: true,
      });
      set({ groupMembers: res.data.groupDetail });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Could not fetch members";
      toast.error(errorMessage);
      console.error(errorMessage);
    } finally {
      set({ isFetchingMembers: false });
    }
  },

  addGroupMembers: async (group_id, user_ids) => {
    try {
      const res = await axios.post(`${BASE_URL}/group/add-members`, {
        group_id,
        user_ids,
      }, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      get().fetchGroupMembers(group_id);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to add members";
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  },

  removeGroupMember: async (group_id, user_id) => {
    try {
      await axios.delete(`${BASE_URL}/group/remove`, {
        data: { group_id, user_id },
        withCredentials: true,
      });
      toast.success("Member removed");
      get().fetchGroupMembers(group_id);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to remove member";
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  },

  listenGroupMessages: (listeningGroupId, selectedGroupId) => {
    const socket = useAuthStore.getState().socket;
    const user_id = useAuthStore.getState().authUser._id;
    if (!socket) return;

    const handleGroupMessage = (newMessage) => {
      set((state) => {
        const isFromSelf = newMessage.senderId === user_id;
        const isSameGroup = newMessage.group_id === listeningGroupId;

        if (!isSameGroup || isFromSelf) return state;

        const isSelectedGroup = selectedGroupId && newMessage.group_id === selectedGroupId;

        const updatedGroupMessages = isSelectedGroup
          ? [...state.groupMessages, newMessage]
          : state.groupMessages;

        const updatedUnreadGroupMessages = !isSelectedGroup
          ? [...state.unreadGroupMessages, newMessage]
          : state.unreadGroupMessages;

        return {
          groupMessages: updatedGroupMessages,
          unreadGroupMessages: updatedUnreadGroupMessages,
        };
      });
    };

    socket.on("groupMessage", handleGroupMessage);

    return () => {
      socket.off("groupMessage", handleGroupMessage);
    };
  },

  deleteGroupMessage: async (message_id, group_id) => {
    try {
      await axios.delete(`${BASE_URL}/group/delete/message/${message_id}`, {
        withCredentials: true,
      });
      await get().fetchGroupMessages(group_id);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to delete the message";
      toast.error(errorMessage);
      console.error(errorMessage);
    }
  },
}));
