import styles from '../../styles/userChat.module.css';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import AudioPlayer from '../AudioPlayer';
import MessageOption from './MessageOption.jsx';
import { useAuthStore } from '../../store/userAuth';
import { useGroupStore } from '../../store/useGroupStore';
import MarkdownView from 'react-showdown';
import { useChatStore } from '../../store/useChatStore.js';

const Message = ({ message, isUserMessage, isLastMessage, showOptions, onToggleOptions }) => {
  const { viewProfile, authUser } = useAuthStore();
  const { deleteGroupMessage } = useGroupStore();
  const { deleteChatMessage } = useChatStore();
  const [name, setName] = useState(' ');
  const [chat_id, setchat_id] = useState('');
  const [isAi, setIsAi] = useState(false);

  useEffect(() => {
    if (message.senderId === authUser._id) {
        setchat_id(message.receiverId)
    } else {
        setchat_id(message.senderId)
    }
  }, [])

  const fetchProfile = async () => {
    let temp_name = '';
    try {
      if (message.senderId === authUser._id || message.senderId?._id === authUser._id) {
        temp_name = 'You';
      } else {
        const response = await viewProfile({ userId: message.senderId });
        const profile = response.profile;
        temp_name = profile?.name || '';
      }
      setName(temp_name);
    } catch (e) {
      console.error('Error fetching profile', e);
    }
  };

  useEffect(() => {
    if (message.senderId) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    const type = message._id?.split('-')[0];
    if (type === 'prompt') {
      setName('You');
      setIsAi(true)
    } else if (type === 'response') {
      setName('Astra');
      setIsAi(true)
    } else if (message.senderId) {
      fetchProfile();
      setIsAi(false)
    }
  }, [message._id]);


  const [fullImageUrl, setFullImageUrl] = useState(null);

  const openImage = (url) => {
    setFullImageUrl(url);
  };
  const closeImage = () => {
    setFullImageUrl(null);
  };

  const [_, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

    if (isSameMinute && !message.text === 'Responding') return 'Just now';

    return msgDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canDelete = () => {
    const msgDate = new Date(message.createdAt);
    const now = new Date();
    const fourHoursInMs = 4 * 60 * 60 * 1000;
    return (now - msgDate <= fourHoursInMs) && !isAi && (message.senderId === authUser._id || message.senderId?._id === authUser._id); 
  };

  const fileName = message.media;
  const fileUrl = fileName ? `${import.meta.env.VITE_BASE_URL}/uploads/${fileName}` : '';
  const ext = fileName && fileName.split('.').pop().toLowerCase();

  const handleDelete = (message_id) => {
    if (message?.group_id) deleteGroupMessage(message_id, message.group_id);
    else deleteChatMessage(message_id, chat_id)
    onToggleOptions();
  };

  if (message.text === 'Responding') {
    return (
      <div
        className={`${styles.messageWrapper} ${isUserMessage ? styles.messageUser : styles.messageOther} ${
          isLastMessage ? styles.newMessage : ''
        }`}
      >
        <div className={styles.messageText}>
          <div className={styles.typingIndicator}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`${styles.messageWrapper} ${isUserMessage ? styles.messageUser : styles.messageOther} ${
          isLastMessage ? styles.newMessage : ''
        }`}
        onClick={() => {
            onToggleOptions()
        }}
      >
        <div className={styles.messageText}>
          {showOptions && (
            <MessageOption
              onCopy={() => {
                navigator.clipboard.writeText(message?.text);
                onToggleOptions();
              }}
              onDelete={() => handleDelete(message?._id)}
              canDelete={canDelete()}
            />
          )}
          <div className={styles.userName}>{name}</div>

          {message.media && (
            <div className={styles.mediaContainer}>
              {['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'svg', 'ico', 'heic', 'heif', 'raw', 'psd', 'ai', 'eps'].includes(
                ext
              ) && (
                <img src={fileUrl} alt="Sent" className={styles.messageImage} onClick={() => openImage(fileUrl)} />
              )}

              {['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi', 'wmv', 'flv', '3gp', 'mpeg'].includes(ext) && (
                <video src={fileUrl} controls className={styles.messageVideo} />
              )}

              {['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma', 'aiff', 'alac'].includes(ext) && <AudioPlayer src={fileUrl} />}

              {['pdf', 'doc', 'docx', 'dot', 'dotx', 'ppt', 'pptx', 'xls', 'xlsx', 'odt', 'ods', 'odm', 'odp', 'rtf', 'txt', 'html', 'htm', 'xml', 'epub', 'mobi', 'azw3', 'chm', 'zip', 'rar', '7z', 'tar', 'gz'].includes(
                ext
              ) && (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={styles.messageDocument}>
                  <IoDocumentTextSharp /> {fileName}
                </a>
              )}
            </div>
          )}
          {message.text && <MarkdownView markdown={message.text} options={{ tables: true, emoji: true }} />}

          <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
        </div>
        {fullImageUrl && (
          <div className={styles.fullscreenOverlay} onClick={closeImage}>
            <button
              className={styles.closeButton}
              onClick={(e) => {
                e.stopPropagation();
                closeImage();
              }}
            >
              ×
            </button>
            <img src={fullImageUrl} className={styles.fullscreenImage} alt="Full Preview" />
          </div>
        )}
      </div>
    </>
  );
};

export default Message;