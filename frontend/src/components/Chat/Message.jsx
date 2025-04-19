import styles from '../../styles/userChat.module.css';

const Message = ({ message, isUserMessage, isLastMessage }) => {
    const formatTime = (createdAt) => {
        const msgDate = createdAt ? new Date(createdAt) : null;
        if (!msgDate || isNaN(msgDate)) return 'Just now';

        const now = new Date();
        const isSameMinute =
            msgDate.getFullYear() === now.getFullYear() &&
            msgDate.getMonth() === now.getMonth() &&
            msgDate.getDate() === now.getDate() &&
            msgDate.getHours() === now.getHours() &&
            msgDate.getMinutes() === now.getMinutes();

        if (isSameMinute) return 'Just now';

        return msgDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className={`${styles.messageWrapper} ${isUserMessage ? styles.messageUser : styles.messageOther
                } ${isLastMessage ? styles.newMessage : ''}`}
        >
            {message.type === 'image' ? (
                <div className={styles.messageText}>
                    <img src={message.src} alt="Sent" className={styles.messageImage} />
                    <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
                </div>
            ) : (
                <div className={styles.messageText}>
                    {message.text.trim()}
                    <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
                </div>
            )}
        </div>
    );
};

export default Message;