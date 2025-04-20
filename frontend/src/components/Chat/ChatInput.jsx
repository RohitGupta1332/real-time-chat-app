import { useState, useRef } from 'react';
import { GoPaperclip } from 'react-icons/go';
import { MdEmojiEmotions } from 'react-icons/md';
import { useChatStore } from '../../store/useChatStore';
import SendButton from '../../assets/Send.svg';
import styles from '../../styles/userChat.module.css';
import MediaInput from './MediaInput.jsx';

const ChatInput = ({ selectedUser }) => {
  const [input, setInput] = useState('');
  const [isMediaSelected, setMediaSelected] = useState(false);
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
      sendMessage(selectedUser, input, null);
      setInput('');
    }
  };

  const handleMediaSelect = (blob) => {
    if (blob instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        sendMessage(selectedUser, input, base64Data);
        setInput('');
        setMediaSelected(false);
      };
      reader.readAsDataURL(blob);
    }
  };

  return (
    <>
      {isMediaSelected && <MediaInput onMediaSelect={handleMediaSelect} />}
      <div className={styles.inputArea}>
        <MdEmojiEmotions className={styles.emojiButton} />
        <GoPaperclip
          className={styles.emojiButton}
          onClick={() => setMediaSelected((prev) => !prev)}
        />
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
        <img
          src={SendButton}
          alt="send"
          className={styles.sendButton}
          onClick={handleSend}
        />
      </div>
    </>
  );
};

export default ChatInput;