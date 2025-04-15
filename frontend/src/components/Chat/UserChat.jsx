import { useState, useEffect } from 'react';

import styles from '../../styles/userChat.module.css';
import DefaultPic from '../../assets/default-profile.png';

import { GoPaperclip } from "react-icons/go";
import { MdEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";

const UserChat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
      };
      setMessages([...messages, newMessage]);
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
            src={selectedUser.profilePic || DefaultPic}
            alt="Profile"
            className={styles.headerAvatar}
          />
          <div>
            <h3 className={styles.headerName}>{selectedUser.fullName}</h3>
            <span className={styles.status}>Online</span>
          </div>
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
            className={`${styles.messageWrapper} ${
              msg.sender === 'user' ? styles.messageUser : styles.messageOther
            }`}
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
        <GoPaperclip className={styles.emojiButton}/>
        <MdEmojiEmotions className={styles.emojiButton}/>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className={styles.input}
        />
          <IoSend className={styles.sendButton}/>
      </div> : ""}

      {!selectedUser?<div className={styles.noChatSelected}>
         <p>Select a Chat to start the conversation</p>
     </div>:""}
    </div>
  );
};

export default UserChat;