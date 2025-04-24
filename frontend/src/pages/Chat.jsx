import { useState, useEffect } from "react";
import Sidebar from "../components/Chat/Sidebar";
import UserChat from "../components/Chat/UserChat";
import { useMediaQuery } from '@react-hook/media-query';
import styles from "../styles/chat.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [isExiting, setIsExiting] = useState(false);
  const isCompactMobile = useMediaQuery('(orientation: portrait) and (max-width: 768px)');

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    if (currentPath === "/ai") setActiveTab("ai");
    else if (currentPath === "/groups") setActiveTab("groups");
    else if (currentPath === "/meetings") setActiveTab("meetings");
    else setActiveTab("chats");
  }, [currentPath]);

  const showSidebar = !isCompactMobile || (isCompactMobile && selectedUser === null);
  const showUserChat = !isCompactMobile || (isCompactMobile && selectedUser !== null);

  const handleChatItemClick = (item) => {
    const isGroup = !!item.group_name; 
    setSelectedUser({ ...item, isGroup });
  };


  const handleClose = () => {
    if (isCompactMobile) {
      setIsExiting(true);
    } else {
      setSelectedUser(null);
      if (selectedUser?.isGroup) {
        setActiveTab('groups');
        navigate('/groups');
      } else {
        setActiveTab('chats');
        navigate('/chat');
      }
    }
  };
  

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    let path = '/chat';
    if (activeTab === 'ai') path = '/ai';
    else if (activeTab === 'groups') path = '/groups';
    else if (activeTab === 'meetings') path = '/meetings';

    setSelectedUser(null);

    if (window.location.pathname !== path) {
      navigate(path, { replace: true });
    }
  }, [activeTab]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {showSidebar && (
        <Sidebar
          onUserClick={handleChatItemClick}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
      )}
      {showUserChat && (
        <div
          className={`${styles.userChatWrapper} ${isCompactMobile ? (isExiting ? styles.exitMobile : styles.mobile) : ''}`}
        >
          <UserChat
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            onClose={handleClose}
            activeTab={activeTab}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
