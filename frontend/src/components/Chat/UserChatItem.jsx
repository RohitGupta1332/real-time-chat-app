import styles from '../../styles/userChatItem.module.css';
import DefaultPic from '../../assets/default-profile.png';

const UserChatItem = ({id, name, bio, image, lastMessage, time, isActive, onUserClick }) => {
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
            {(isActive || false) && <div className={styles.onlineDot} />}
        </div>

        <div className={styles.content}>
            <div className={styles.header}>
                <span className={styles.name}>{name}</span>
                <span className={styles.time}>{time || ""}</span>
            </div>
            <p className={styles.message}>{lastMessage || bio}</p>
        </div>
    </div>
  );
};

export default UserChatItem;