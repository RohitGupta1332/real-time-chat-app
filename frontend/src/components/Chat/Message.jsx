import styles from '../../styles/userChat.module.css';
import { IoDocumentTextSharp } from 'react-icons/io5';

import AudioPlayer from '../AudioPlayer';

const Message = ({ message, isUserMessage, isLastMessage }) => {
    const markdownToHTML = (markdown) => {
        if (!markdown) return "";

        markdown = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const escapedCode = code.replace(/</g, '<').replace(/>/g, '>');
            return `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
        });
        markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
        markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
        markdown = markdown.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
        markdown = markdown.replace(/\[([^\[]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        markdown = markdown.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
        markdown = markdown.replace(/(?:^|\n)(\d+\..+(?:\n\d+\..+)*)/g, (match) => {
            const items = match.trim().split('\n').map(line => line.replace(/^\d+\.\s+/, '<li>') + '</li>').join('');
            return `<ol>${items}</ol>`;
        });
        markdown = markdown.replace(/(?:^|\n)([*+-].+(?:\n[*+-].+)*)/g, (match) => {
            const items = match.trim().split('\n').map(line => line.replace(/^[*+-]\s+/, '<li>') + '</li>').join('');
            return `<ul>${items}</ul>`;
        });
        markdown = markdown
            .split(/\n{2,}/)
            .map(para => {
                const trimmed = para.trim();
                if (/^<\/?(ul|ol|li|pre|code|blockquote|h\d|a|strong|em|p)/.test(trimmed)) {
                    return trimmed;
                }
                return `<p>${trimmed}</p>`;
            })
            .join('');

        return markdown;
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

    const formattedText = markdownToHTML(message.text || '');
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
                            <img src={fileUrl} alt="Sent" className={styles.messageImage} />
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
                    <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                )}

                <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
            </div>
        </div>
    );
};

export default Message;
