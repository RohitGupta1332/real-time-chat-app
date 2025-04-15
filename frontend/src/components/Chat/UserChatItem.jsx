import styles from '../../styles/userChatItem.module.css';
import DefaultPic from '../../assets/default-profile.png'

const UserChatItem = ({ user, lastMessage, time, isActive, onClick }) => {
  return (
    <div className={styles.container} onClick={onClick}>
        <div className={styles.avatarWrapper}>
            <img src={user.profilePic || DefaultPic} alt="Profile" className={styles.avatar} />
            {isActive && <div className={styles.onlineDot} />}
        </div>

        <div className={styles.content}>
            <div className={styles.header}>
            <span className={styles.name}>{user.fullName}</span>
            <span className={styles.time}>{time}</span>
            </div>
            <p className={styles.message}>{lastMessage}</p>
        </div>
    </div>

  );
};

export default UserChatItem;
