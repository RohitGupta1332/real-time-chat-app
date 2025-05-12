import { useEffect, useState, createRef } from 'react';
import styles from '../../styles/groupInfo.module.css';
import { FiX } from 'react-icons/fi';


import AddToGroup from '../../assets/AddToGroup.svg';
import LeaveGroup from '../../assets/LeaveGroup.svg';
import DeleteGroup from '../../assets/DeleteGroup.svg';
import DefaultGroupIcon from '../../assets/default-profile.png';

import { useGroupStore } from '../../store/useGroupStore';
import { useAuthStore } from '../../store/userAuth';
import UserChatItem from './UserChatItem';
import SearchResults from './SearchResults';
import ProfileView from '../ProfileView'; // Import ProfileView

import { toast } from 'react-toastify';

const GroupInfo = ({ setShowGroupInfo, group, onClose }) => {
    const { fetchGroupMembers, groupMembers, isFetchingMembers, deleteGroup, removeGroupMember, addGroupMembers } = useGroupStore();
    const { viewProfile, authUser, searchUser, searchResult } = useAuthStore();
    const [userDetailsList, setUserDetailsList] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isAddingMembers, setIsAddingMembers] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null); // Track which user's options are shown
    const [selectedProfile, setSelectedProfile] = useState(null); // Track the user whose profile is being viewed

    const mediaBaseUrl = 'https://real-time-chat-app-pbgx.onrender.com/uploads/';

    const groupIconUrl = group?.group_icon ? `${mediaBaseUrl}${group.group_icon}` : null;

    const isAdmin = groupMembers?.some(
        (member) => member.user_id === authUser?._id && member.isAdmin
    );

    useEffect(() => {
        if (searchValue && typeof searchUser === 'function') {
            searchUser(searchValue.trim());
        } else if (!searchValue) {
            useAuthStore.setState({ searchResult: null });
        }
    }, [searchValue, searchUser]);

    useEffect(() => {
        if (group?._id) {
            fetchGroupMembers(group._id);
        }
    }, [group?._id, fetchGroupMembers]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (groupMembers?.length > 0) {
                setIsLoadingUsers(true);
                const newUserDetailsList = [];

                for (const member of groupMembers) {
                    if (!userDetailsList.find(user => user.userId === member.user_id)) {
                        try {
                            const response = await viewProfile({ userId: member.user_id });
                            if (response?.profile) {
                                newUserDetailsList.push({
                                    userId: member.user_id,
                                    ...response.profile,
                                    isAdmin: member.isAdmin
                                });
                            }
                        } catch (error) {
                            console.error(`Failed to fetch user ${member.user_id}:`, error.message);
                            newUserDetailsList.push({
                                userId: member.user_id,
                                name: 'Unknown User',
                                bio: '',
                                image: null,
                                isAdmin: member.isAdmin
                            });
                        }
                    } else {
                        const existingUser = userDetailsList.find(user => user.userId === member.user_id);
                        newUserDetailsList.push(existingUser);
                    }
                }

                setUserDetailsList(newUserDetailsList);
                setIsLoadingUsers(false);
            }
        };

        fetchUserDetails();
    }, [groupMembers, viewProfile]);

    const handleDeleteGroup = async () => {
        try {
            await deleteGroup(group._id);
            setShowGroupInfo(false);
            onClose();
        } catch (error) {
            console.error("Delete group failed:", error);
        }
    };

    const handleLeaveGroup = async () => {
        if (!authUser?._id) {
            toast.error("User not authenticated");
            return;
        }

        try {
            await removeGroupMember(group._id, authUser._id);
            setShowGroupInfo(false);
            onClose()
        } catch (error) {
            console.error("Leave group failed:", error);
        }
    };

    const handleAddMember = async (user) => {
        if (!authUser?._id) {
            toast.error("User not authenticated");
            return;
        }

        if (!isAdmin) {
            toast.error("Only admins can add members");
            return;
        }

        if (groupMembers.some(member => member.user_id === user.userId)) {
            toast.error("User is already a member of this group");
            return;
        }

        try {
            await addGroupMembers(group._id, [user.userId]);
            setSearchValue('');
        } catch (error) {
            console.error("Add member failed:", error);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!authUser?._id) {
            toast.error("User not authenticated");
            return;
        }

        if (!isAdmin) {
            toast.error("Only admins can remove members");
            return;
        }

        try {
            await removeGroupMember(group._id, userId);
            setSelectedUserId(null); // Close the options menu
        } catch (error) {
            console.error("Remove member failed:", error);
        }
    };

    const handleViewProfile = (user) => {
        setSelectedProfile({
            userID: user.userId,
            name: user.name || 'No Name',
            username: user.username || 'No Username',
            bio: user.bio || 'No bio available',
            image: user.image || null,
            instagramUrl: user.instagramUrl || '',
            facebookUrl: user.facebookUrl || '',
            youtubeUrl: user.youtubeUrl || '',
            twitterUrl: user.twitterUrl || ''
        });
        setSelectedUserId(null);
    };

    const filteredSearchResults = searchResult?.filter(
        (user) => !groupMembers.some(member => member.user_id === user.userId)
    ) || [];

    if (selectedProfile) {
        return <div className={styles.profileModal} style={{overflow:"hidden"}}>
        <ProfileView
            formData={selectedProfile}
            fileInputRef={createRef()} 
            showProfilePicOptions={false}
            setShowProfilePicOptions={() => {}}
            onClose={() => setSelectedProfile(null)}
        />
    </div>
    }

    return (
        <div className={styles.fullPage}>
            {/* Top Header with Close Icon */}
            <div className={styles.topHeader}>
                <FiX className={styles.closeIcon} onClick={() => setShowGroupInfo(false)} />
            </div>

            {isAdmin && isAddingMembers && (
                <>
                    <input
                        type="search"
                        placeholder="Search users to add..."
                        className={styles.search}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    {searchValue && (
                        <SearchResults
                            results={filteredSearchResults}
                            setSearchValue={setSearchValue}
                            onUserClick={handleAddMember}
                            onAddUserToList={() => {}}
                        />
                    )}
                </>
            )}

            {/* Header Section */}
            <div className={styles.header}>
                {groupIconUrl ? (
                    <img
                        src={groupIconUrl}
                        alt="Group Icon"
                        className={styles.groupIcon}
                        onError={(e) => {
                            e.target.src = DefaultGroupIcon;
                        }}
                    />
                ) : (
                    <img src={DefaultGroupIcon} alt="Default Group Icon" className={styles.groupIcon} />
                )}
                <div className={styles.groupDetails}>
                    <h2>{group?.group_name || 'Loading...'}</h2>
                    <p>{groupMembers?.length || 0} Members</p>
                </div>
            </div>

            {/* Options Section */}
            <div className={styles.options}>
                <button
                    className={`${styles.optionButton} ${styles.addButton}`}
                    onClick={() => {
                        if (!authUser?._id) {
                            toast.error("User not authenticated");
                            return;
                        }
                        if (!isAdmin) {
                            toast.error("Only admins can add members");
                            return;
                        }
                        setIsAddingMembers((prev) => !prev);
                    }}
                >
                    <img src={AddToGroup} alt="Add to Group" className={styles.icon} />
                    Add Members
                </button>
                <button className={styles.optionButton} style={{ color: "#C73C3E" }} onClick={handleLeaveGroup}>
                    <img src={LeaveGroup} alt="Leave Group" className={styles.icon} />
                    Leave
                </button>
                <button className={styles.optionButton} style={{ color: "#C73C3E" }} onClick={handleDeleteGroup}>
                    <img src={DeleteGroup} alt="Delete Group" className={styles.icon} />
                    Delete & Exit
                </button>
            </div>

            {/* Tabs Section */}
            <div className={styles.tabs}>
                Members
            </div>

            {/* Members List */}
            <div className={styles.membersList}>
                {isFetchingMembers || isLoadingUsers ? (
                    <div>Loading members...</div>
                ) : userDetailsList?.length > 0 ? (
                    userDetailsList.map((user) => (
                        <div key={user.userId} className={styles.memberWrapper}>
                            <UserChatItem
                                id={user.userId}
                                userId={user.userId}
                                name={user.name || 'Unknown User'}
                                bio={user.bio || ''}
                                image={user.image}
                                lastMessage={null}
                                time={user.isAdmin}
                                onUserClick={() => {
                                    setSelectedUserId(selectedUserId === user.userId ? null : user.userId);
                                }}
                            />
                            {selectedUserId === user.userId && (
                                <div className={styles.userOptions}>
                                    <button
                                        className={styles.userOptionButton}
                                        onClick={() => handleViewProfile(user)}
                                    >
                                        View Profile
                                    </button>
                                    {isAdmin && user.userId !== authUser?._id && (
                                        <button
                                            className={styles.userOptionButton}
                                            onClick={() => handleRemoveMember(user.userId)}
                                        >
                                            Remove Member
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No members found.</div>
                )}
            </div>
        </div>
    );
};

export default GroupInfo;