import { useAuthStore } from '../../store/userAuth';
import { useChatStore } from '../../store/useChatStore';
import Message from './Message.jsx';
import styles from '../../styles/userChat.module.css';
import { useEffect, useRef, useState } from 'react';

const MessageList = ({ selectedUser }) => {
    const { messages, unreadMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messagesContainerRef = useRef(null);
    const [unreadIndex, setUnreadIndex] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const initialUnreadMessagesRef = useRef([]);
    const prevSelectedUserRef = useRef(null);

    const formatDate = (createdAt) => {
        const msgDate = createdAt ? new Date(createdAt) : null;
        if (!msgDate || isNaN(msgDate)) return 'Today';

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isToday = msgDate.toDateString() === today.toDateString();
        const isYesterday = msgDate.toDateString() === yesterday.toDateString();

        if (isToday) return 'Today';
        if (isYesterday) return 'Yesterday';

        return msgDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const userMessages = messages.filter(
        (msg) =>
            (msg.senderId === selectedUser?.userId && msg.receiverId === authUser?._id) ||
            (msg.receiverId === selectedUser?.userId && msg.senderId === authUser?._id)
    );

    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [userMessages, selectedUser]);

    useEffect(() => {

        if (selectedUser?.userId) {
            const latestMessage = userMessages[userMessages.length - 1];
            const isLatestMessageSentByAuthUser =
                latestMessage && latestMessage.senderId === authUser?._id;

            if (isLatestMessageSentByAuthUser) {
                setUnreadIndex(null);
                setUnreadCount(0);
                initialUnreadMessagesRef.current = [];
            } else {
                const existingMessageIds = new Set(initialUnreadMessagesRef.current.map(msg => msg._id));
                const newUnreadMessages = unreadMessages.filter(
                    msg => !existingMessageIds.has(msg._id) && 
                           msg.senderId === selectedUser?.userId && 
                           msg.receiverId === authUser?._id
                );
                initialUnreadMessagesRef.current = [...initialUnreadMessagesRef.current, ...newUnreadMessages];

                const unreadCountForUser = initialUnreadMessagesRef.current.length;
                setUnreadCount(unreadCountForUser);

                const firstUnreadMessageId = initialUnreadMessagesRef.current[0]?._id;

                const index = userMessages.findIndex((msg) => msg._id === firstUnreadMessageId);
                setUnreadIndex(index !== -1 ? index : null);
            }
        } else {
            initialUnreadMessagesRef.current = [];
            setUnreadIndex(null);
            setUnreadCount(0);
        }

        prevSelectedUserRef.current = selectedUser;
    }, [selectedUser, userMessages, authUser, unreadMessages]);

    return (
        <div className={styles.messages} ref={messagesContainerRef}>
            {userMessages.map((msg, index) => {
                const currentDate = new Date(msg.createdAt);
                const previousDate = index > 0 ? new Date(userMessages[index - 1].createdAt) : null;
                const isNewDate =
                    !previousDate || currentDate.toDateString() !== previousDate.toDateString();
                const isUserMessage = msg.receiverId === selectedUser?.userId;
                const isLastMessage = index === userMessages.length - 1;

                const showUnreadDividerForMessage =
                    unreadIndex !== null && index === unreadIndex && msg.receiverId === authUser?._id;

                return (
                    <div key={index}>
                        {isNewDate && (
                            <div className={styles.dateDivider}>
                                <span>{formatDate(msg.createdAt)}</span>
                            </div>
                        )}
                        {showUnreadDividerForMessage && (
                            <div className={styles.unreadDivider}>
                                <span>{unreadCount} new message{unreadCount !== 1 ? 's' : ''}</span>
                            </div>
                        )}
                        <Message
                            message={msg}
                            isUserMessage={isUserMessage}
                            isLastMessage={isLastMessage}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default MessageList;