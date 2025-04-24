import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import styles from '../../styles/userChat.module.css';
import GroupInfo from './GroupInfo';
import { useState } from 'react';

const GroupChatView = ({ group, onClose }) => {
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  return (
    <div className={styles.grpPage}>
      <div className={styles.chatContainer}>
        <ChatHeader
          selectedUser={group}
          onClose={onClose}
          onInfoClick={() => setShowGroupInfo((prev) => !prev)}
        />

        <MessageList selectedUser={group} />
        <ChatInput selectedUser={group} />
      </div>
      {showGroupInfo && <GroupInfo setShowGroupInfo={setShowGroupInfo} group={group}/>}
    </div>
  );
};

export default GroupChatView;
