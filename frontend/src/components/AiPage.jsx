import ChatHeader from "./Chat/ChatHeader";
import styles from '../styles/userChat.module.css';
import MessageList from './Chat/MessageList'
import ChatInput from "./Chat/ChatInput";

const AiPage = ({ onClose }) => {
    const user = {
        _id: 'ai-bot-id-001',
        userId: 'ai-bot-uuid-1234567890',
        name: 'Astra',
        image: '',
        bio: "Heyy, I'm an AI assistent",
        lastMessage: '',
        time: '',
        isActive: true,
    };

    return (
        <div className={styles.chatContainer}>
            <ChatHeader selectedUser={user} onClose={onClose} />
            <MessageList selectedUser={user}/>
            <ChatInput selectedUser={user}/>
        </div>
    );
};

export default AiPage;