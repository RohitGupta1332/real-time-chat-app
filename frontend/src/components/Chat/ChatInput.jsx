import { useState, useRef } from 'react';
import { GoPaperclip } from 'react-icons/go';
import { MdEmojiEmotions } from 'react-icons/md';
import { IoMdTimer } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { useChatStore } from '../../store/useChatStore';
import { useGroupStore } from '../../store/useGroupStore';
import SendButton from '../../assets/Send.svg';
import styles from '../../styles/userChat.module.css';
import MediaInput from './MediaInput.jsx';
import MediaPreview from './MediaPreview.jsx';
import Scheduler from './Scheduler.jsx';

const ChatInput = ({ selectedUser }) => {
  const [input, setInput] = useState('');
  const [isMediaSelected, setMediaSelected] = useState(false);
  const [file, setFile] = useState(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(null);

  const { sendMessage, sendTypingStatus, chatWithAI } = useChatStore();
  const { sendGroupMessage } = useGroupStore();
  const typingTimeoutRef = useRef(null);

  const isAI = selectedUser?.userId === 'ai-bot-uuid-1234567890';
  const isGroup = selectedUser?.isGroup;

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!isAI && !isGroup) {
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
        setInput('');
        setFile(null);
        setIsSchedulerOpen(false); 
        return; 
      }

      if (scheduleTime) {
        // Yet to handle backend
        setInput('');
        setFile(null);
        setIsSchedulerOpen(false);

      } else {
        if (isGroup) {
          sendGroupMessage(selectedUser._id, input, file);
        } else {
          sendMessage(selectedUser, input, file);
        }
        setInput('');
        setFile(null);
        setIsSchedulerOpen(false);
      }
    } else {
      if (scheduleTime) {
          setScheduleTime(null);
      }
       setIsSchedulerOpen(false);
    }
    setScheduleTime(null)
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

  const handleScheduleSet = (dateTimeString) => {
    setScheduleTime(dateTimeString);
    setIsSchedulerOpen(false);
  };

  const clearSchedule = () => {
    setScheduleTime(null);
  };

  const formattedScheduleTime = scheduleTime
    ? `Scheduled: ${new Date(scheduleTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(scheduleTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
    : '';

  return (
    <>
      {file && <MediaPreview file={file} onRemove={handleRemoveMedia} />}
      {isMediaSelected && <MediaInput onMediaSelect={handleMediaSelect} />}
      <div className={`${styles.inputArea} ${styles.inputAreaRelative}`}>
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
          placeholder={scheduleTime ? "Type scheduled message..." : "Type message"}
          className={styles.textarea}
        />

        {scheduleTime && (
          <div className={styles.scheduleInfo}>
            <span>{formattedScheduleTime}</span>
            <IoCloseCircle
              className={styles.clearScheduleButton}
              onClick={clearSchedule}
              title="Clear schedule"
            />
          </div>
        )}

        {isSchedulerOpen && (
          <Scheduler
            onScheduleSet={handleScheduleSet}
            onClose={() => setIsSchedulerOpen(false)}
          />
        )}

        <IoMdTimer
          className={`${styles.emojiButton} ${scheduleTime ? styles.timerActive : ''}`}
          onClick={() => setIsSchedulerOpen((prev) => !prev)}
          title={scheduleTime ? "Change schedule" : "Schedule message"}
        />

        <img
          src={SendButton}
          alt="send"
          className={`${styles.sendButton} ${scheduleTime ? styles.sendButtonSchedule : ''}`}
          onClick={handleSend}
          title={scheduleTime ? "Send scheduled message now" : "Send Message"}
        />
      </div>
    </>
  );
};

export default ChatInput;