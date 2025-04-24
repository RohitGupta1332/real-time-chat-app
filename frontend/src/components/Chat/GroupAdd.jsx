import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/userAuth";
import { useGroupStore } from "../../store/useGroupStore";
import UserChatItem from "./UserChatItem";
import styles from '../../styles/groupAdd.module.css';

const GroupAdd = ({ users, onClose }) => {
    const [groupName, setGroupName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    const { searchUser, searchResult } = useAuthStore();
    const { createGroup } = useGroupStore();

    useEffect(() => {
        if (searchTerm.trim()) {
            searchUser(searchTerm.trim());
        }
    }, [searchTerm]);

    // Function to get filtered users excluding selected members
    const getFilteredUsers = (usersList) => {
        if (!usersList) return []; // If usersList is null or undefined, return an empty array
        return usersList.filter(user => 
            !selectedMembers.some(selected => selected._id === user._id)
        );
    };

    const handleSelectUser = (user) => {
        if (!selectedMembers.some((member) => member._id === user._id)) {
            setSelectedMembers([...selectedMembers, user]);
        }
    };

    const handleRemoveUser = (userId) => {
        setSelectedMembers(selectedMembers.filter((u) => u._id !== userId));
    };

    const handleCreateGroup = () => {
        if (!groupName || selectedMembers.length === 0) {
            return alert("Please provide a group name and add at least one member.");
        }
        const user_ids = selectedMembers.map((u) => u._id);
        createGroup(groupName, user_ids);
    };

    // Get filtered users based on whether search is applied
    const filteredUsers = searchTerm ? getFilteredUsers(searchResult) : getFilteredUsers(users);

    return (
        <div className={styles.groupAddOverlay}>
            <div className={styles.groupAddContainer}>
                <div className={styles.groupAddHeader}>
                    <h2>Create a New Group</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.groupAddInput}>
                    <input
                        type="text"
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <input
                        type="search"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.groupAddContent}>
                    <div className={styles.usersSection}>
                        <h3>All Users</h3>
                        <div className={styles.usersListContainer}>
                            {filteredUsers?.map((user) => (
                                <UserChatItem
                                    key={user._id}
                                    id={user._id}
                                    name={user.name}
                                    image={user.image}
                                    bio={user.bio}
                                    onUserClick={() => handleSelectUser(user)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.selectedMembersSection}>
                        <h3>Selected Members</h3>
                        <div className={styles.selectedMembersList}>
                            {selectedMembers.length === 0 ? (
                                <p>No members added yet</p>
                            ) : (
                                selectedMembers.map((user) => (
                                    <div key={user._id} className={styles.selectedMemberItem}>
                                        <UserChatItem
                                            id={user._id}
                                            name={user.name}
                                            image={user.image}
                                            bio={user.bio}
                                            onUserClick={() => handleRemoveUser(user._id)}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.groupAddFooter}>
                    <button className={styles.createGroupButton} onClick={handleCreateGroup}>
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupAdd;
