import {Group} from "../models/group.model.js";
import {GroupMember} from "../models/groupMember.model.js";


//NOT TESTED IN POSTMAN
export const createGroup = async (req, res) => {
    try {
        const {groupName, createdBy} = req.body;
        const group = await Group.create({groupName, createdBy});
        res.status(201).json({message: "Group created successfully", group});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const fetchGroups = async (req, res) => {
    try {
        const { userId } = req.params; 
        const groupMemberships = await GroupMember.find({ user_id: userId }).select("group_id");
        const groupIds = groupMemberships.map(membership => membership.group_id);
        const groups = await Group.find({ _id: { $in: groupIds } });
        res.status(200).json({ groups });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
}

export const addGroupMembers = async (req, res) => {
    try {
        const { group_id, user_ids } = req.body; 

        const groupExists = await Group.findById(group_id);
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