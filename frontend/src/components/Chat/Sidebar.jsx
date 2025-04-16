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

const Sidebar = ({ onProfileClick }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("chats");
    const [isShrunk, setIsShrunk] = useState(false);
    const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
    const [searchValue, setSearchValue] = useState("");
    const [usersList, setUserList] = useState([])

    const { searchUser, searchResult, authUser } = useAuthStore();
    const { users, getUsersForSidebar, selectUser, getMessages, isUserLoading } = useChatStore();

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
            searchUser(searchValue);
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

    const filterSearchResults = (results, authUserId) => {
        return results?.filter((user) => user.userId !== authUserId) || [];
    };

    const filteredSearchResults = filterSearchResults(searchResult, authUser?._id);

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
                    {searchValue && <SearchResults results={filteredSearchResults} setUserList={setUserList} setSearchValue={setSearchValue} />}
                    {!searchValue && (
                        <div className={styles.userList}>
                            {usersList.map((item, index) => (
                                item.user && item.user.fullName ? (
                                    <UserChatItem
                                        key={index}
                                        user={item.user}
                                        fullName={item.user.fullName}
                                        lastMessage={item.lastMessage}
                                        time={item.time}
                                        isActive={item.isActive}
                                    />
                                ) : null
                            ))}
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