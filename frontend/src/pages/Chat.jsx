import Sidebar from "../components/Chat/Sidebar";
import UserChat from "../components/Chat/UserChat";
import { useState, useEffect } from "react";
import { useMediaQuery } from '@react-hook/media-query';
import styles from "../styles/chat.module.css";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const isCompactMobile = useMediaQuery(
    '(orientation: portrait) and (max-width: 768px)'
  );

  const showSidebar = !isCompactMobile || (isCompactMobile && selectedUser === null);
  const showUserChat = !isCompactMobile || (isCompactMobile && selectedUser !== null);

  const handleClose = () => {
    if (isCompactMobile) {
      setIsExiting(true);
    } else {
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        setSelectedUser(null);
        setIsExiting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isExiting]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow : 'hidden'}}>
      {showSidebar && <Sidebar onUserClick={setSelectedUser} />}
      {showUserChat && (
        <div className={`${styles.userChatWrapper} ${isCompactMobile ? (isExiting ? styles.exitMobile : styles.mobile) : ''}`}>
          <UserChat selectedUser={selectedUser} setSelectedUser={setSelectedUser} onClose={handleClose} />
        </div>
      )}
    </div>
  );
};

export default Chat;