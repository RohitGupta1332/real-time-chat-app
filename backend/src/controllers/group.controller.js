import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";

export const createGroup = async (req, res) => {
    try {
        const { groupName, createdBy } = req.body;
        const group = await Group.create(
            {
                group_name: groupName,
                created_by: createdBy
            }
        );
        const addMember = await GroupMember.create({
            group_id: group._id,
            user_id: createdBy,
            isAdmin: true
        });
        res.status(201).json({ message: "Group created successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const fetchGroups = async (req, res) => {
    try {
        const userId = req.user.userId;
        const memberships = await GroupMember.find({ user_id: userId })
            .populate("group_id")
            .select("group_id isAdmin");

        const groups = memberships.map(m => ({
            ...m.group_id._doc,
            isAdmin: m.isAdmin
        }));

        res.status(200).json({ groups });
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
}

export const fetchGroupMessage = async (req, res) => {
    try {
        const { group_id } = req.params;

        const groupExists = await Group.findById(group_id);
        if (!groupExists) {
            return res.status(404).json({ message: "Group not found" });
        }

        const messages = await GroupMessage.find({ group_id })
            .populate("sender_id", "username email")
            .sort({ createdAt: 1 });

        res.status(200).json({ message: "Messages fetched successfully", messages });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const sendMessage = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}