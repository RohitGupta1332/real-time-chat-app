import styles from '../../styles/userChatItem.module.css';
import DefaultPic from '../../assets/default-profile.png';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/userAuth';
import { useState, useEffect } from 'react';
import Admin from '../../assets/Admin.svg'

const UserChatItem = ({ id, userId, name, bio, image, lastMessage, time, onUserClick }) => {
  const { unreadMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const exists = unreadMessages.some(msg => msg.senderId === userId);
    setHasUnread(exists);
  }, [unreadMessages, userId]);

  const isActive = onlineUsers.includes(userId);

  const user = {
    id,
    name,
    bio,
    image,
    lastMessage,
    time,
    isActive
  };

  return (
    <div className={styles.container} onClick={() => onUserClick(user)}>
      <div className={styles.avatarWrapper}>
        <img src={image || DefaultPic} alt="Profile" className={styles.avatar} />
        {isActive && <div className={styles.onlineDot} />}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{name}</span>
          {typeof time === 'boolean' ? (
            time ? (
              <img src={Admin} alt="Admin" className={styles.adminIcon} />
            ) : null
          ) : (
            <span className={styles.time}>{time || ""}</span>
          )}
        </div>
        <p className={styles.message}>{lastMessage || bio}</p>
      </div>
      {hasUnread && <div className={styles.unreadDot} />}
    </div>
  );
};

export default UserChatItem;