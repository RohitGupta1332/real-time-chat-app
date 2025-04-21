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
  const [file, setFile] = useState(null); // State to store the selected file
  const { sendMessage, sendTypingStatus, chatWithAI } = useChatStore();
  const typingTimeoutRef = useRef(null);

  const isAI = selectedUser?.userId === 'ai-bot-uuid-1234567890';

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!isAI) {
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
      // Send either the message or the file (or both)
      if (isAI) {
        chatWithAI(input); // Handle AI-specific messages
      } else {
        sendMessage(selectedUser, input, file); // Pass the message or file
      }
      setInput(''); // Clear the text input field after sending
      setFile(null); // Reset the file after sending
    }
  };

  const handleMediaSelect = (selectedFile) => {
    if (selectedFile instanceof Blob) {
      setFile(selectedFile); // Set the selected file to the state
      setMediaSelected(false); // Close the media input once a file is selected
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
              handleSend(); // Trigger send on Enter key (without Shift)
            }
          }}
          placeholder="Type message"
          className={styles.textarea}
        />
        <img
          src={SendButton}
          alt="send"
          className={styles.sendButton}
          onClick={handleSend} // Trigger send when the send button is clicked
        />
      </div>
    </>
  );
};

export default ChatInput;
