import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import styles from '../../styles/userChat.module.css';

const GroupChatView = ({ group, onClose }) => {
  return (
    <div className={styles.chatContainer}>
      <ChatHeader selectedUser={group} onClose={onClose} isGroup />
      <MessageList selectedUser={group} isGroup />
      <ChatInput selectedUser={group} isGroup />
    </div>
  );
};

export default GroupChatView;
