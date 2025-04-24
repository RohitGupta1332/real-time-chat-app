import styles from '../../styles/userChat.module.css';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { useState, useEffect } from 'react';

import AudioPlayer from '../AudioPlayer';

import MarkdownView from 'react-showdown';

const Message = ({ message, isUserMessage, isLastMessage }) => {

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

        if (isSameMinute) return 'Just now';

        return msgDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const fileName = message.media;
    const fileUrl = fileName ? `http://localhost:3000/uploads/${fileName}` : '';

    const ext = fileName && fileName.split('.').pop().toLowerCase();

    return (
        <div
            className={`${styles.messageWrapper} ${isUserMessage ? styles.messageUser : styles.messageOther
                } ${isLastMessage ? styles.newMessage : ''}`}
        >
            <div className={styles.messageText}>

                {message.media && (
                    <div className={styles.mediaContainer}>
                        {['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'svg', 'ico', 'heic', 'heif', 'raw', 'psd', 'ai', 'eps'].includes(ext) && (
                            <img src={fileUrl} alt="Sent" className={styles.messageImage} onClick={() => openImage(fileUrl)} />
                        )}

                        {['mp4', 'webm', 'ogg', 'mov', 'mkv', 'avi', 'wmv', 'flv', '3gp', 'mpeg'].includes(ext) && (
                            <video src={fileUrl} controls className={styles.messageVideo} />
                        )}

                        {['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma', 'aiff', 'alac'].includes(ext) && (
                            <AudioPlayer src={fileUrl} />
                        )}

                        {['pdf', 'doc', 'docx', 'dot', 'dotx', 'ppt', 'pptx', 'xls', 'xlsx', 'odt', 'ods', 'odm', 'odp', 'rtf', 'txt', 'html', 'htm', 'xml', 'epub', 'mobi', 'azw3', 'chm', 'zip', 'rar', '7z', 'tar', 'gz'].includes(ext) && (
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={styles.messageDocument}>
                                <IoDocumentTextSharp /> {fileName}
                            </a>
                        )}
                    </div>
                )}
                {message.text && (
                    <MarkdownView
                        markdown={message.text}
                        options={{ tables: true, emoji: true }}
                    />
                )}

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
    );
};

export default Message;