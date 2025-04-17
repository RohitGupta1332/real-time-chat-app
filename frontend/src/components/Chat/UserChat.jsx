import { useState, useEffect } from 'react';
import styles from '../../styles/userChat.module.css';
import DefaultPic from '../../assets/default-profile.png';
import { GoPaperclip } from 'react-icons/go';
import { MdEmojiEmotions } from 'react-icons/md';
import { IoSend } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/userAuth';

const UserChat = ({ selectedUser, onClose }) => {
  const [input, setInput] = useState('');
  const { onlineUsers } = useAuthStore();
  const { messages, getMessages, sendMessage, listenMessages } = useChatStore();

  useEffect(() => {
    if (!selectedUser?.userId) return;

    const unsubscribe = listenMessages(selectedUser);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser?.userId) {
      getMessages(selectedUser.userId);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    const messagesContainer = document.querySelector(`.${styles.messages}`);
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(selectedUser, input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

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

  const formatDate = (createdAt) => {
    const msgDate = createdAt ? new Date(createdAt) : null;
    if (!msgDate || isNaN(msgDate)) return 'Today';

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = msgDate.toDateString() === today.toDateString();
    const isYesterday = msgDate.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return msgDate.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.chatContainer}>
      {selectedUser ? (
        <div className={styles.chatHeader}>
          <img
            src={selectedUser.image || DefaultPic}
            alt="Profile"
            className={styles.headerAvatar}
          />
          <div>
            <h3 className={styles.headerName}>{selectedUser.name}</h3>
            <span
              className={`${styles.status} ${onlineUsers.includes(selectedUser.userId)
                ? styles.active
                : styles.inactive
                }`}
            >
              {onlineUsers.includes(selectedUser.userId) ? 'Online' : 'Offline'}
            </span>
          </div>
          <FiX
            className={styles.closeButton}
            onClick={onClose}
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
          />
        </div>
      ) : null}

      {selectedUser ? (
        <div className={styles.messages}>
          {messages.map((msg, index) => {
            const currentDate = new Date(msg.createdAt);
            const previousDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;
            const isNewDate =
              !previousDate || currentDate.toDateString() !== previousDate.toDateString();

            const isUserMessage = msg.receiverId === selectedUser?.userId;

            return (
              <div key={index}>
                {isNewDate && (
                  <div className={styles.dateDivider}>
                    <span>{formatDate(msg.createdAt)}</span>
                  </div>
                )}

                <div
                  className={`${styles.messageWrapper} ${isUserMessage ? styles.messageUser : styles.messageOther} ${index === messages.length - 1 ? styles.newMessage : ''}`}
                >
                  {msg.type === 'image' ? (
                    <div className={styles.messageText}>
                      <img src={msg.src} alt="Sent" className={styles.messageImage} />
                      <span className={styles.messageTime}>{formatTime(msg.createdAt)}</span>
                    </div>
                  ) : (
                    <div className={styles.messageText}>
                      {msg.text.trim()}
                      <span className={styles.messageTime}>{formatTime(msg.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {selectedUser ? (
        <div className={styles.inputArea}>
          <GoPaperclip className={styles.emojiButton} />
          <MdEmojiEmotions className={styles.emojiButton} />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className={styles.textarea}
          />

          <IoSend className={styles.sendButton} onClick={handleSend} />
        </div>
      ) : (
        <div className={styles.noChatSelected}>
          <p>Select a Chat to start the conversation</p>
        </div>
      )}
    </div>
  );
};

export default UserChat;
