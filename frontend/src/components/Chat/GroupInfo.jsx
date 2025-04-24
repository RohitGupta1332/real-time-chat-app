import { useEffect, useState } from 'react';
import styles from '../../styles/groupInfo.module.css';
import { FiX } from 'react-icons/fi';

import AddToGroup from '../../assets/AddToGroup.svg';
import LeaveGroup from '../../assets/LeaveGroup.svg';
import DeleteGroup from '../../assets/DeleteGroup.svg';

import { useGroupStore } from '../../store/useGroupStore';
import { useAuthStore } from '../../store/userAuth';
import UserChatItem from './UserChatItem';

const GroupInfo = ({ setShowGroupInfo, group }) => {
    const { fetchGroupMembers, groupMembers, isFetchingMembers } = useGroupStore();
    const { viewProfile } = useAuthStore();
    const [userDetailsList, setUserDetailsList] = useState([]); // Store list of user details
    const [isLoadingUsers, setIsLoadingUsers] = useState(false); // Track loading state for user details

    // Base URL for media
    const mediaBaseUrl = 'http://localhost:3000/uploads/';

    // Construct the group icon URL
    const groupIconUrl = group?.group_icon ? `${mediaBaseUrl}${group.group_icon}` : null;

    // Fetch group members when the component mounts or group._id changes
    useEffect(() => {
        if (group?._id) {
            fetchGroupMembers(group._id);
        }
    }, [group?._id, fetchGroupMembers]);

    // Fetch user details sequentially for each member
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (groupMembers?.length > 0) {
                setIsLoadingUsers(true);
                const newUserDetailsList = []; // Temporary list to store user details

                // Fetch user details one by one
                for (const member of groupMembers) {
                    // Check if user details are already in the list to avoid redundant fetches
                    if (!userDetailsList.find(user => user.userId === member.user_id)) {
                        try {
                            const response = await viewProfile({ userId: member.user_id });
                            if (response?.profile) {
                                newUserDetailsList.push({
                                    userId: member.user_id,
                                    ...response.profile,
                                    isAdmin: member.isAdmin // Include isAdmin from groupMembers
                                });
                            }
                        } catch (error) {
                            console.error(`Failed to fetch user ${member.user_id}:`, error.message);
                            // Add a fallback entry if fetching fails
                            newUserDetailsList.push({
                                userId: member.user_id,
                                name: 'Unknown User',
                                bio: '',
                                image: null,
                                isAdmin: member.isAdmin
                            });
                        }
                    } else {
                        // If user details already exist, reuse them
                        const existingUser = userDetailsList.find(user => user.userId === member.user_id);
                        newUserDetailsList.push(existingUser);
                    }
                }

                setUserDetailsList(newUserDetailsList); // Update state with the new list
                setIsLoadingUsers(false);
            }
        };

        fetchUserDetails();
    }, [groupMembers, viewProfile]);

    return (
        <div className={styles.fullPage}>
            {/* Top Header with Close Icon */}
            <div className={styles.topHeader}>
                <FiX className={styles.closeIcon} onClick={() => setShowGroupInfo(false)} />
            </div>

            {/* Header Section */}
            <div className={styles.header}>
                {groupIconUrl ? (
                    <img
                        src={groupIconUrl}
                        alt="Group Icon"
                        className={styles.groupIcon}
                        onError={(e) => {
                            e.target.src = ''; // Fallback to empty string or a default image if needed
                            e.target.style.backgroundColor = '#333'; // Fallback background color
                        }}
                    />
                ) : (
                    <div className={styles.groupIcon}></div> // Fallback placeholder if no group_icon
                )}
                <div className={styles.groupDetails}>
                    <h2>{group?.group_name || 'Loading...'}</h2>
                    <p>{groupMembers?.length || 0} Members</p>
                </div>
            </div>

            {/* Options Section */}
            <div className={styles.options}>
                <button className={styles.optionButton} style={{color : "#6852D6"}}>
                    <img src={AddToGroup} alt="Add to Group" className={styles.icon} />
                    Add Members
                </button>
                <button className={styles.optionButton} style={{color : "#C73C3E"}}>
                    <img src={LeaveGroup} alt="Leave Group" className={styles.icon} />
                    Leave
                </button>
                <button className={styles.optionButton} style={{color : "#C73C3E"}}>
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
                                time={user.isAdmin} // Pass isAdmin as time
                                onUserClick={() => {}}
                            />
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