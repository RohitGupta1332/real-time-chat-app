import { useState, useRef } from 'react';
import { GoPaperclip } from 'react-icons/go';
import { MdEmojiEmotions } from 'react-icons/md';
import { useChatStore } from '../../store/useChatStore';
import SendButton from '../../assets/Send.svg';
import styles from '../../styles/userChat.module.css';

const ChatInput = ({ selectedUser }) => {
  const [input, setInput] = useState('');
  const { sendMessage, sendTypingStatus } = useChatStore();
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

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(selectedUser, input);
      setInput('');
    }
  };

  return (
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
  );
};

export default ChatInput;