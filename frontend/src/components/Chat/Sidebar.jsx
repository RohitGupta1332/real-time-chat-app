import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useChatStore } from "../../store/useChatStore";
import styles from "../../styles/sidebar.module.css";
import DefaultPic from '../../assets/default-profile.png'

import BottomNavbar from "./Navbar";
import UserChatItem from "./UserChatItem";

import { FiBell, FiX, FiUser } from "react-icons/fi";

const Sidebar = ({ onProfileClick }) => {
    const navigate = useNavigate()

    const [activeTab , setActiveTab] = useState('chats')

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
    return(
        <div className={styles.sidebar}>
            <div className={styles.top}>
                <h2>Chats</h2>
                <div className={styles.icons}>
                    <FiUser
                    style={{
                        cursor : 'pointer'
                    }}
                    onClick={() => navigate('/profile/view')}/>
                    <FiBell style={{
                        cursor : 'pointer'
                    }}/>
                    <FiX style={{
                        cursor : 'pointer'
                    }}/>
                </div>
            </div>
            <input type="search" placeholder="Search"/>
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
            <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab}/>
        </div>
    );
};

export default Sidebar;