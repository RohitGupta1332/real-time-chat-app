import { useState, useEffect } from 'react';

import styles from '../../styles/userChat.module.css';
import DefaultPic from '../../assets/default-profile.png';

import { GoPaperclip } from "react-icons/go";
import { MdEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { FiX } from "react-icons/fi";

import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/userAuth';

const UserChat = ({ selectedUser, onClose }) => {
  const [input, setInput] = useState('');
  const { onlineUsers } = useAuthStore();
  const { messages, getMessages, sendMessage } = useChatStore();

  console.log(selectedUser)

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

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

  return (
    <div className={styles.chatContainer}>
      {/* Chat Header */}
      {selectedUser ? (
        <div className={styles.chatHeader}>
          <img
            src={selectedUser.image || DefaultPic}
            alt="Profile"
            className={styles.headerAvatar}
          />
          <div>
            <h3 className={styles.headerName}>{selectedUser.name}</h3>
            <span className={`${styles.status} ${selectedUser.id && onlineUsers.includes(selectedUser.id) ? styles.active : styles.inactive}`}>
              {selectedUser.userId && onlineUsers.includes(selectedUser.userId) ? 'Online' : 'Offline'}
            </span>
          </div>
          <FiX
            className={styles.closeButton}
            onClick={onClose}
            style={{ cursor: "pointer", marginLeft: "auto" }}
          />
        </div>
      ) : ""}

      {/* Messages Area */}
      <div className={styles.messages}>
        {messages.length > 0 && (
          <div className={styles.dateDivider}>Today</div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.messageUser : styles.messageOther}`}
          >
            {msg.type === 'image' ? (
              <img src={msg.src} alt="Sent" className={styles.messageImage} />
            ) : (
              <p className={styles.messageText}>{msg.text}</p>
            )}
            <span className={styles.messageTime}>{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      {selectedUser ? <div className={styles.inputArea}>
        <GoPaperclip className={styles.emojiButton} />
        <MdEmojiEmotions className={styles.emojiButton} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className={styles.input}
        />
        <IoSend className={styles.sendButton} />
      </div> : ""}

      {!selectedUser ? <div className={styles.noChatSelected}>
        <p>Select a Chat to start the conversation</p>
      </div> : ""}
    </div>
  );
};

export default UserChat;