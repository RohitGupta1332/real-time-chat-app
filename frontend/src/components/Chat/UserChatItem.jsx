import styles from '../../styles/userChatItem.module.css';
import DefaultPic from '../../assets/default-profile.png';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/userAuth';
import { useGroupStore } from '../../store/useGroupStore';
import { useState, useEffect } from 'react';
import Admin from '../../assets/Admin.svg';

const UserChatItem = ({ id, userId, name, bio, image, lastMessage, time, onUserClick, isGroup }) => {
  const { unreadMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { unreadGroupMessages } = useGroupStore();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (isGroup) {
      const exists = unreadGroupMessages.some((msg) => msg.group_id === id);
      setHasUnread(exists);
    } else {
      const exists = unreadMessages.some((msg) => msg.senderId === userId);
      setHasUnread(exists);
    }
  }, [unreadMessages, unreadGroupMessages, userId, id, isGroup]);

  const isActive = !isGroup && onlineUsers.includes(userId);

  const user = {
    id,
    userId,
    name,
    bio,
    image,
    lastMessage,
    time,
    isActive,
    isGroup,
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
            <span className={styles.time}>{time || ''}</span>
          )}
        </div>
        <p className={styles.message}>{lastMessage || bio}</p>
      </div>
      {hasUnread && <div className={styles.unreadDot} />}
    </div>
  );
};

export default UserChatItem;