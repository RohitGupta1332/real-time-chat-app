import { useState, useEffect, useRef } from 'react';

import styles from '../../styles/userChat.module.css';

import DefaultPic from '../../assets/default-profile.png';
import SendButton from '../../assets/Send.svg'

import ProfileView from '../ProfileView.jsx'

import { GoPaperclip } from 'react-icons/go';
import { MdEmojiEmotions } from 'react-icons/md';
import { FiX, FiInfo } from 'react-icons/fi';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/userAuth';

const UserChat = ({ selectedUser, setSelectedUser, onClose }) => {
  const [input, setInput] = useState('');
  const [showProfileView, setShowProfileView] = useState(false);
  const [showProfilePicOptions, setShowProfilePicOptions] = useState(false);

  const { onlineUsers } = useAuthStore();
  const { messages, getMessages, sendMessage, listenMessages, sendTypingStatus, isUserTyping } = useChatStore();

  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  
    sendTypingStatus(selectedUser.userId, true);
  
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(selectedUser.userId, false);
    }, 500);
  };
  


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
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showProfileView) {
          setShowProfileView(false);
        } else if (selectedUser) {
          setSelectedUser(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedUser, showProfileView]);



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
  }, [messages, showProfileView]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(selectedUser, input);
      setInput('');
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

  if (showProfileView) {
    return <ProfileView
      formData={{
        userID: selectedUser?.userId,
        name: selectedUser?.name,
        username: selectedUser?.username,
        gender: selectedUser?.gender,
        bio: selectedUser?.bio,
        instagramUrl: selectedUser?.instagramUrl,
        youtubeUrl: selectedUser?.youtubeUrl,
        facebookUrl: selectedUser?.facebookUrl,
        twitterUrl: selectedUser?.twitterUrl,
        image: selectedUser?.image
      }}
      showProfilePicOptions={showProfilePicOptions}
      setShowProfilePicOptions={setShowProfilePicOptions}
      onClose={() => setShowProfileView(false)}
    />
  }

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

            {/* 🧠 Add this: dynamic status with typing check */}
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

          <FiInfo
            className={styles.button}
            onClick={() => {
              setShowProfileView(true);
            }}
          />
          <FiX
            className={`${styles.button} ${styles.closeButton}`}
            onClick={onClose}
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
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type message"
            className={styles.textarea}
          />

          <img src={SendButton} alt="send" className={styles.sendButton} onClick={handleSend} />
        </div>
      ) : (
        <div className={styles.noChatSelected}>
          <p>Select a chat to start the conversation</p>
        </div>
      )}
    </div>
  );
};

export default UserChat;