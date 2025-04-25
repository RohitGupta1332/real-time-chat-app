// src/components/Chat/ChatHeader.jsx
import { FiInfo, FiX } from 'react-icons/fi';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/userAuth';
import DefaultPic from '../../assets/default-profile.png';
import styles from '../../styles/userChat.module.css';

const AI_BOT_USER_ID = 'ai-bot-uuid-1234567890';

const ChatHeader = ({ selectedUser, onInfoClick, onClose }) => {
  const { isUserTyping } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isAiBot = selectedUser?.userId === AI_BOT_USER_ID;
  const group_image = selectedUser?.group_icon? `http://localhost:3000/uploads/${selectedUser.group_icon}` : ""

  return (
    <div className={styles.chatHeader}>
      <div className={styles.userInfo}>
        <img
          src={selectedUser.image || group_image || DefaultPic}
          alt="Profile"
          className={styles.headerAvatar}
          onClick={isAiBot ? undefined : onInfoClick}
        />
        <div>
          <h3 className={styles.headerName}>{selectedUser.name || selectedUser.group_name}</h3>
          <span
            className={`${styles.status} ${isAiBot
                ? styles.active
                : isUserTyping
                  ? styles.typing
                  : onlineUsers.includes(selectedUser.userId)
                    ? styles.active
                    : styles.inactive
              }`}
          >
            {selectedUser?.isGroup
              ? selectedUser.description || 'Group'
              : isAiBot
                ? 'Online'
                : isUserTyping
                  ? 'Typing...'
                  : onlineUsers.includes(selectedUser.userId)
                    ? 'Online'
                    : 'Offline'}

          </span>
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        {!isAiBot && <FiInfo className={styles.button} onClick={onInfoClick} />}
        <FiX className={`${styles.button} ${styles.closeChat}`} onClick={onClose} />
      </div>
    </div>
  );
};

export default ChatHeader;