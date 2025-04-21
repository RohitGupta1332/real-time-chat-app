import styles from '../../styles/userChat.module.css';

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

    return (
        <div
            className={`${styles.messageWrapper} ${isUserMessage ? styles.messageUser : styles.messageOther
                } ${isLastMessage ? styles.newMessage : ''}`}
        >
            {message.type === 'image' ? (
                <div className={styles.messageText}>
                    <img src={message.src} alt="Sent" className={styles.messageImage} />
                    <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
                </div>
            ) : (
                <div className={styles.messageText}>
                    <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                    <span className={styles.messageTime}>{formatTime(message.createdAt)}</span>
                </div>
            )}
        </div>
    );
};

export default Message;
