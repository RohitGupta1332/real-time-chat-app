import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import { GroupMessage } from "../models/groupMessage.model.js";
import { io } from "../lib/socket.js";

export const createGroup = async (req, res) => {
    try {
        const { group_name, description } = req.body;
        const created_by = req.user.userId;
        const group_icon = req.file?.filename || "";
        const group = await Group.create({
            group_name,
            group_icon,
            description,
            created_by
        });
        const addMember = await GroupMember.create({
            group_id: group._id,
            user_id: created_by,
            isAdmin: true
        });
        res.status(201).json({ message: "Group created successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};

export const fetchGroups = async (req, res) => {
    try {
        const userId = req.user.userId;
        const memberships = await GroupMember.find({ user_id: userId })
            .populate("group_id")

        res.status(200).json({ message: "Fetched group successfully", memberships });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};

export const addGroupMembers = async (req, res) => {
    try {
        const { group_id, user_ids } = req.body;

        const groupExists = await Group.findOne({ _id: group_id });

        if (!groupExists) {
            return res.status(404).json({ message: "Group not found" });
        }

        const existingMembers = await GroupMember.find({ group_id, user_id: { $in: user_ids } });
        const existingUserIds = existingMembers.map(member => member.user_id.toString());

        const newMembers = user_ids
            .filter(user_id => !existingUserIds.includes(user_id))
            .map(user_id => ({
                group_id,
                user_id
            }));

        if (newMembers.length === 0) {
            return res.status(400).json({ message: "All users are already members of this group" });
        }

        await GroupMember.insertMany(newMembers);

        res.status(201).json({ message: "Members added successfully", addedMembers: newMembers });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { group_id } = req.params;
        const group = await Group.findById(group_id);
        if (!group) {
            return res.status(404).json({ message: "Group not found!" });
        }

        if (group.created_by.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to delete this group" });
        }
        const deletedGroup = await Group.findByIdAndDelete(group_id);

        await GroupMember.deleteMany({ group_id });
        await GroupMessage.deleteMany({ group_id });
        res.status(200).json({ message: "Group deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error?.message || error })
    }
};

export const fetchGroupMessages = async (req, res) => {
    try {
        const { group_id } = req.params;
        const groupExists = await Group.findById(group_id);
        if (!groupExists) {
            return res.status(404).json({ message: "Group not found!" });
        }
        const messages = await GroupMessage.find({ group_id }).populate("senderId", "username email").sort({ createdAt: 1 });
        res.status(200).json({ message: "Messages fetched successfully", messages });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error?.message || error })
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { group_id, text, scheduleTime } = req.body;
        const senderId = req.user.userId;
        const groupExists = await Group.findOne({ _id: group_id });
        if (!groupExists) {
            return res.status(404).json({ message: "Group not found!" });
        }

        let mediaUrl = req.file?.filename || "";

        const newMessage = await GroupMessage.create({
            group_id,
            senderId,
            text,
            media: mediaUrl
        });
        io.to(group_id).emit("groupMessage", newMessage);
        res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
};

export const fetchGroupMembers = async (req, res) => {
    try {
        const { group_id } = req.query;
        const groupDetail = await GroupMember.find({ group_id }).populate("group_id");
        if (!groupDetail) {
            return res.status(404).json({ message: "Group not found" });
        }
        return res.status(200).json({ message: "Group members fetched successfully", groupDetail })

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error?.message || error });
    }
};

export const removeGroupMember = async (req, res) => {
    try {
        const { group_id, user_id } = req.body;
        const member = await GroupMember.findOne({ group_id, user_id });
        if (!member) {
            return res.status(404).json({ message: "Member not found in group" });
        }
        await GroupMember.deleteOne({ group_id, user_id });
        res.status(200).json({ message: "Member removed successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error?.message || error });
    }
};
