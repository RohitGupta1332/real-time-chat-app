import { useState, useRef } from 'react';
import { GoPaperclip } from 'react-icons/go';
import { MdEmojiEmotions } from 'react-icons/md';
import { useChatStore } from '../../store/useChatStore';
import { useGroupStore } from '../../store/useGroupStore'; // Add import
import SendButton from '../../assets/Send.svg';
import styles from '../../styles/userChat.module.css';
import MediaInput from './MediaInput.jsx';
import MediaPreview from './MediaPreview.jsx';

const ChatInput = ({ selectedUser }) => {
  const [input, setInput] = useState('');
  const [isMediaSelected, setMediaSelected] = useState(false);
  const [file, setFile] = useState(null);
  const { sendMessage, sendTypingStatus, chatWithAI } = useChatStore();
  const { sendGroupMessage } = useGroupStore(); // Add hook
  const typingTimeoutRef = useRef(null);

  const isAI = selectedUser?.userId === 'ai-bot-uuid-1234567890';
  const isGroup = selectedUser?.isGroup; // Check if group

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!isAI && !isGroup) { // Skip typing status for AI and groups
      sendTypingStatus(selectedUser.userId, true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(selectedUser.userId, false);
      }, 500);
    }
  };

  const handleSend = () => {
    if (input.trim() || file) {
      if (isAI) {
        chatWithAI(input);
      } else if (isGroup) {
        sendGroupMessage(selectedUser._id, input, file);
      } else {
        sendMessage(selectedUser, input, file);
      }
      setInput('');
      setFile(null);
    }
  };

  const handleMediaSelect = (selectedFile) => {
    if (selectedFile instanceof Blob) {
      setFile(selectedFile);
      setMediaSelected(false);
    }
  };

  const handleRemoveMedia = () => {
    setFile(null);
    setMediaSelected(false);
  };

  return (
    <>
      {file && <MediaPreview file={file} onRemove={handleRemoveMedia} />}
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