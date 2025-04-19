import { FiInfo, FiX } from 'react-icons/fi';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/userAuth';
import DefaultPic from '../../assets/default-profile.png';
import styles from '../../styles/userChat.module.css';

const ChatHeader = ({ selectedUser, onInfoClick, onClose }) => {
    const { isUserTyping } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className={styles.chatHeader}>
            <img
                src={selectedUser.image || DefaultPic}
                alt="Profile"
                className={styles.headerAvatar}
                onClick={onInfoClick}
            />
            <div>
                <h3 className={styles.headerName}>{selectedUser.name}</h3>
                <span
                    className={`${styles.status} ${isUserTyping
                            ? styles.typing
                            : onlineUsers.includes(selectedUser.userId)
                                ? styles.active
                                : styles.inactive
                        }`}
                >
                    {isUserTyping
                        ? 'Typing...'
                        : onlineUsers.includes(selectedUser.userId)
                            ? 'Online'
                            : 'Offline'}
                </span>
            </div>
            <FiInfo className={styles.button} onClick={onInfoClick} />
            <FiX className={`${styles.button} ${styles.closeButton}`} onClick={onClose} />
        </div>
    );
};

export default ChatHeader;