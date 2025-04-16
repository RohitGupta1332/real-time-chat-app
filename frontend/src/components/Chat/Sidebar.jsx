import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useChatStore } from "../../store/useChatStore";
import styles from "../../styles/sidebar.module.css";
import DefaultPic from '../../assets/default-profile.png'

import BottomNavbar from "./Navbar";
import UserChatItem from "./UserChatItem";

import { FiBell, FiX, FiUser, FiMenu } from "react-icons/fi";

const Sidebar = ({ onProfileClick }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("chats");
    const [isShrunk, setIsShrunk] = useState(false);
    const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

    const users = [{
        user : {
            profilePic : DefaultPic,
            fullName : "John Doe"
        } ,
        lastMessage : "Heyy wassup?",
        time : "8:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Marina Mariam"
        } ,
        lastMessage : "Nevermind!",
        time : "8:40 AM",
        isActive : false
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Labina Maliam"
        } ,
        lastMessage : "This works great!",
        time : "9:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "John Doe"
        } ,
        lastMessage : "Heyy wassup?",
        time : "8:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Marina Mariam"
        } ,
        lastMessage : "Nevermind!",
        time : "8:40 AM",
        isActive : false
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Labina Maliam"
        } ,
        lastMessage : "This works great!",
        time : "9:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "John Doe"
        } ,
        lastMessage : "Heyy wassup?",
        time : "8:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Marina Mariam"
        } ,
        lastMessage : "Nevermind!",
        time : "8:40 AM",
        isActive : false
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Labina Maliam"
        } ,
        lastMessage : "This works great!",
        time : "9:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "John Doe"
        } ,
        lastMessage : "Heyy wassup?",
        time : "8:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Marina Mariam"
        } ,
        lastMessage : "Nevermind!",
        time : "8:40 AM",
        isActive : false
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Labina Maliam"
        } ,
        lastMessage : "This works great!",
        time : "9:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "John Doe"
        } ,
        lastMessage : "Heyy wassup?",
        time : "8:30 AM",
        isActive : true
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Marina Mariam"
        } ,
        lastMessage : "Nevermind!",
        time : "8:40 AM",
        isActive : false
    },
    {
        user : {
            profilePic : DefaultPic,
            fullName : "Labina Maliam"
        } ,
        lastMessage : "This works great!",
        time : "9:30 AM",
        isActive : true
    },]

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleResize = () => {
            setIsMobile(mediaQuery.matches);
            if (mediaQuery.matches) setIsShrunk(false);
        };
        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);
    
    const handleToggle = () => {
        if (!isMobile) setIsShrunk(!isShrunk);
    };

    return(
        <div className={`${styles.sidebar} ${isShrunk && !isMobile ? styles.shrunk : ""}`}>
            <div className={`${styles.top} ${isShrunk && !isMobile ? styles.shrunkTop : ""}`}>
                {!isShrunk && <h2>Chats</h2>}
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
                    placeholder="Search"
                    className={styles.search}
                />
                <div className={styles.userList}>
                    {users.map((item, index) => (
                    <UserChatItem
                        key={index}
                        user={item.user}
                        fullName={item.user.fullName}
                        lastMessage={item.lastMessage}
                        time={item.time}
                        isActive={item.isActive}
                    />
                    ))}
                </div>
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