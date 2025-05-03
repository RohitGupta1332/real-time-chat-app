import { useAuthStore } from '../../store/userAuth';
import { useChatStore } from '../../store/useChatStore';
import { useGroupStore } from '../../store/useGroupStore';
import Message from './Message.jsx';
import styles from '../../styles/userChat.module.css';
import { useEffect, useRef, useState } from 'react';

const MessageList = ({ selectedUser }) => {
  const { messages, aiMessages, unreadMessages, getMessages, getAIMessages, isResponseLoading, isUserTyping } = useChatStore();
  const { groupMessages, fetchGroupMessages, listenGroupMessages, unreadGroupMessages } = useGroupStore();
  const { authUser } = useAuthStore();
  const messagesContainerRef = useRef(null);
  const [unreadIndex, setUnreadIndex] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const initialUnreadMessagesRef = useRef([]);
  const prevSelectedUserRef = useRef(null);
  const isAI = selectedUser?.userId === 'ai-bot-uuid-1234567890';
  const isGroup = selectedUser?.isGroup;
  const ai_messages = aiMessages;

  const hasFetchedMessagesRef = useRef(false);

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

  const aiFormattedMessages = ai_messages.map((msg, i) => ({
    ...msg,
    _id: `ai-${i}`,
    senderId: 'ai-bot-uuid-1234567890',
    receiverId: authUser?._id,
  }));

  const displayMessages = isAI
    ? aiFormattedMessages
    : isGroup
      ? groupMessages
      : userMessages;

  useEffect(() => {
    hasFetchedMessagesRef.current = false;
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;

    if (isAI) {
      if (!hasFetchedMessagesRef.current) {
        getAIMessages();
        hasFetchedMessagesRef.current = true;
      }
    } else if (isGroup) {
      if (selectedUser?._id && !hasFetchedMessagesRef.current) {
        fetchGroupMessages(selectedUser._id);
        hasFetchedMessagesRef.current = true;
      }
    } else {
      if (selectedUser?.userId && !hasFetchedMessagesRef.current) {
        getMessages(selectedUser.userId);
        hasFetchedMessagesRef.current = true;
      }
    }
  }, [isAI, isGroup, getMessages, getAIMessages, fetchGroupMessages, selectedUser?.groupId]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [displayMessages, selectedUser]);

  useEffect(() => {
    if (!isGroup || !selectedUser?.groupId) return;

    const unsubscribe = listenGroupMessages(selectedUser.groupId);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isGroup, selectedUser?.groupId]);

  useEffect(() => {
    if (isAI || isGroup || !selectedUser?.userId) {
      initialUnreadMessagesRef.current = [];
      setUnreadIndex(null);
      setUnreadCount(0);
      return;
    }
    const latestMessage = userMessages[userMessages.length - 1];
    const isLatestMessageSentByAuthUser =
      latestMessage && (latestMessage.senderId) === authUser?._id;
    if (isLatestMessageSentByAuthUser) {
      setUnreadIndex(null);
      setUnreadCount(0);
      initialUnreadMessagesRef.current = [];
    } else {
      const existingMessageIds = new Set(initialUnreadMessagesRef.current.map((msg) => msg._id));
      const newUnreadMessages = unreadMessages.filter(
        (msg) =>
          !existingMessageIds.has(msg._id) &&
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
    prevSelectedUserRef.current = selectedUser;
  }, [selectedUser, userMessages, authUser, unreadMessages, isAI, isGroup]);

  return (
    <div className={styles.messages} ref={messagesContainerRef}>
      {displayMessages.map((msg, index) => {
        const currentDate = new Date(msg.createdAt);
        const previousDate = index > 0 ? new Date(displayMessages[index - 1].createdAt) : null;
        const isNewDate =
          !previousDate || currentDate.toDateString() !== previousDate.toDateString();
        const isUserMessage = (!isAI && !isGroup && msg.receiverId === selectedUser?.userId) || (isGroup && (msg.senderId._id || msg.senderId) === authUser._id);

        const showUnreadDividerForMessage =
          !isAI &&
          !isGroup &&
          unreadIndex !== null &&
          index === unreadIndex &&
          msg.receiverId === authUser?._id;

        return (
          <div key={msg._id}>
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
            {isAI && (
              <>
                <Message
                  message={{
                    _id: `prompt-${msg._id}`,
                    text: msg.prompt,
                    createdAt: msg.createdAt,
                  }}
                  isUserMessage={true}
                  isLastMessage={true}
                />
                {msg.response && (
                  <Message
                    message={{
                      _id: `response-${msg._id}`,
                      text: msg.response.text,
                      media: msg.response.media,
                      createdAt: msg.createdAt,
                    }}
                    isUserMessage={false}
                    isLastMessage={true}
                  />
                )}
              </>
            )}
            {!isAI && (
              <Message
                message={msg}
                isUserMessage={isUserMessage}
                isLastMessage={true}
              />
            )}
          </div>
        );
      })}
      {(isResponseLoading || isUserTyping) && (
        <Message
          message={{
            _id: 'temp',
            text: 'Responding',
            media: null,
            createdAt: new Date().toISOString()
          }} />
      )}
    </div>
  );
};

export default MessageList;