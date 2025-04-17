import Sidebar from "../components/Chat/Sidebar";
import UserChat from "../components/Chat/UserChat";
import { useState, useEffect } from "react";
import { useMediaQuery } from '@react-hook/media-query';
import styles from "../styles/chat.module.css";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isExiting, setIsExiting] = useState(false); // State for exit animation
  const isCompactMobile = useMediaQuery(
    '(orientation: portrait) and (min-resolution: 200dpi) and (max-width: 768px)'
  );

  const showSidebar = !isCompactMobile || (isCompactMobile && selectedUser === null);
  const showUserChat = !isCompactMobile || (isCompactMobile && selectedUser !== null);

  // Handle close with exit animation
  const handleClose = () => {
    if (isCompactMobile) {
      setIsExiting(true); // Trigger exit animation only for mobile
    } else {
      setSelectedUser(null); // Close instantly for desktop
    }
  };

  // Unmount after animation completes (mobile only)
  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        setSelectedUser(null); // Unmount UserChat
        setIsExiting(false); // Reset exit state
      }, 300); // Match animation duration (0.3s)
      return () => clearTimeout(timer);
    }
  }, [isExiting]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      {showSidebar && <Sidebar onUserClick={setSelectedUser} />}
      {showUserChat && (
        <div
          className={`${styles.userChatWrapper} ${
            isCompactMobile ? (isExiting ? styles.exitMobile : styles.mobile) : ''
          }`}
        >
          <UserChat selectedUser={selectedUser} onClose={handleClose} />
        </div>
      )}
    </div>
  );
};

export default Chat;