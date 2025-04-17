import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/userAuth";
import { useChatStore } from "../../store/useChatStore";
import styles from "../../styles/sidebar.module.css";

import BottomNavbar from "./Navbar";
import UserChatItem from "./UserChatItem";
import SearchResults from "./SearchResults";

import { FiBell, FiX, FiUser, FiMenu } from "react-icons/fi";

import LockTalk from '../../assets/LockTalk.png';

const Sidebar = ({ onUserClick }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("chats");
    const [isShrunk, setIsShrunk] = useState(false);
    const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
    const [searchValue, setSearchValue] = useState("");
    const [userList, setUserList] = useState([]); // Local state for temporary user list

    const { searchUser, searchResult, onlineUsers } = useAuthStore();
    const { users, getUsersForSidebar, isUserLoading } = useChatStore();

    useEffect(() => {
        getUsersForSidebar();
    }, [getUsersForSidebar]);

    useEffect(() => {
        setUserList([...users]);
    }, [users]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleResize = () => {
            setIsMobile(mediaQuery.matches);
            if (mediaQuery.matches) setIsShrunk(false);
        };
        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    useEffect(() => {
        if (searchValue && typeof searchUser === 'function') {
            searchUser(searchValue.trim());
        } else if (!searchValue) {
            useAuthStore.setState({ searchResult: null });
        }
    }, [searchValue, searchUser]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleToggle = () => {
        if (!isMobile) setIsShrunk(!isShrunk);
    };

    // Callback to add a searched user to the top of userList
    const handleAddUserToList = (newUser) => {
        setUserList((prevList) => {
            // Avoid duplicates by checking _id
            if (prevList.some(user => user._id === newUser._id)) {
                return prevList;
            }
            return [newUser, ...prevList];
        });
    };

    return (
        <div className={`${styles.sidebar} ${isShrunk && !isMobile ? styles.shrunk : ""}`}>
            <div className={`${styles.top} ${isShrunk && !isMobile ? styles.shrunkTop : ""}`}>
                {!isShrunk && (
                    <h2>
                        <img
                            src={LockTalk}
                            alt="LockTalk"
                            style={{ width: "100px" }}
                        />
                    </h2>
                )}
                <div className={`${styles.icons} ${isShrunk && !isMobile ? styles.shrunkIcons : ""}`}>
                    <FiUser
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/profile/view")}
                    />
                    <FiBell style={{ cursor: "pointer" }} />
                    {!isMobile && (
                        isShrunk ? (
                            <FiMenu
                                style={{ cursor: "pointer" }}
                                onClick={handleToggle}
                                aria-label="Expand sidebar"
                            />
                        ) : (
                            <FiX
                                style={{ cursor: "pointer" }}
                                onClick={handleToggle}
                                aria-label="Shrink sidebar"
                            />
                        )
                    )}
                </div>
            </div>
            {!isShrunk && (
                <>
                    <input
                        type="search"
                        placeholder="Search users..."
                        className={styles.search}
                        value={searchValue}
                        onChange={handleSearchChange}
                        aria-label="Search for users"
                    />
                    {searchValue && (
                        <SearchResults
                            results={searchResult}
                            setSearchValue={setSearchValue}
                            onUserClick={onUserClick}
                            onAddUserToList={handleAddUserToList}
                        />
                    )}
                    {!searchValue && (
                        <div className={styles.userList}>
                            {isUserLoading ? (
                                <p>Loading users...</p>
                            ) : userList.length === 0 ? (
                                <p>No chats yet</p>
                            ) : (
                                userList.map((user, index) => {
                                    return (
                                    <UserChatItem
                                        key={user._id || index}
                                        id={user._id}
                                        name={user.name}
                                        image={user.image}
                                        bio={user.bio}
                                        isActive={onlineUsers.includes(user._id)}
                                        onUserClick={() => onUserClick(user)}
                                    />
                                )})
                            )}
                        </div>
                    )}
                </>
            )}
            <BottomNavbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isShrunk={isShrunk && !isMobile}
            />
        </div>
    );
};

export default Sidebar;