import { useAuthStore } from '../../store/userAuth';
import { useChatStore } from '../../store/useChatStore';
import { useGroupStore } from '../../store/useGroupStore';
import Message from './Message.jsx';
import styles from '../../styles/userChat.module.css';
import { useEffect, useRef, useState, useMemo } from 'react';

const MessageList = ({ selectedUser }) => {
  const { messages, aiMessages, unreadMessages, getMessages, getAIMessages, isResponseLoading, isUserTyping } = useChatStore();
  const { groupMessages, fetchGroupMessages, unreadGroupMessages, deleteMessage } = useGroupStore();
  const { authUser } = useAuthStore();

  const isAI = selectedUser?.userId === 'ai-bot-uuid-1234567890';
  const isGroup = selectedUser?.isGroup;

  const messagesContainerRef = useRef(null);
  const hasFetchedMessagesRef = useRef(false);
  const initialUnreadMessagesRef = useRef([]);
  const initialUnreadGroupMessagesRef = useRef([]);
  const unreadMessagesByChatRef = useRef({});
  const prevMessageCountRef = useRef(0);

  const [unreadIndex, setUnreadIndex] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadGroupIndex, setUnreadGroupIndex] = useState(null);
  const [unreadGroupCount, setUnreadGroupCount] = useState(0);
  const [activeMessageId, setActiveMessageId] = useState(null);

  const formatDate = (createdAt) => {
    const msgDate = createdAt ? new Date(createdAt) : null;
    if (!msgDate || isNaN(msgDate)) return 'Today';

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return 'Today';
    if (msgDate.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return msgDate.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const userMessages = useMemo(
    () =>
      messages.filter(
        (msg) =>
          (msg.senderId === selectedUser?.userId && msg.receiverId === authUser?._id) ||
          (msg.receiverId === selectedUser?.userId && msg.senderId === authUser?._id)
      ),
    [messages, selectedUser?.userId, authUser?._id]
  );

  const aiFormattedMessages = useMemo(
    () =>
      aiMessages.map((msg, i) => ({
        ...msg,
        _id: `ai-${i}`,
        senderId: 'ai-bot-uuid-1234567890',
        receiverId: authUser?._id,
      })),
    [aiMessages, authUser?._id]
  );

  const displayMessages = useMemo(
    () => (isAI ? aiFormattedMessages : isGroup ? groupMessages : userMessages),
    [isAI, aiFormattedMessages, isGroup, groupMessages, userMessages]
  );

  useEffect(() => {
    hasFetchedMessagesRef.current = false;
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser || isAI || hasFetchedMessagesRef.current) return;

    const chatId = isGroup ? selectedUser._id : selectedUser.userId;

    if (isGroup && selectedUser._id) {
      fetchGroupMessages(selectedUser._id);
    } else if (selectedUser?.userId) {
      getMessages(selectedUser.userId);
    }

    if (unreadMessagesByChatRef.current[chatId]) {
      if (isGroup) {
        initialUnreadGroupMessagesRef.current = unreadMessagesByChatRef.current[chatId];
        setUnreadGroupCount(initialUnreadGroupMessagesRef.current.length);
      } else {
        initialUnreadMessagesRef.current = unreadMessagesByChatRef.current[chatId];
        setUnreadCount(initialUnreadMessagesRef.current.length);
      }
    }

    hasFetchedMessagesRef.current = true;
  }, [selectedUser, isGroup, getMessages, fetchGroupMessages, deleteMessage]);

  useEffect(() => {
    if (!selectedUser || selectedUser.userId !== 'ai-bot-uuid-1234567890') return;
    if (hasFetchedMessagesRef.current) return;

    getAIMessages();
    hasFetchedMessagesRef.current = true;
  }, [isAI, getAIMessages]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const isAtBottom =
      messagesContainer.scrollHeight - messagesContainer.scrollTop <=
      messagesContainer.clientHeight + 50;
    const messageCount = displayMessages.length;

    if (
      messageCount > prevMessageCountRef.current ||
      isAtBottom ||
      prevMessageCountRef.current === 0
    ) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    prevMessageCountRef.current = messageCount;
  }, [displayMessages, selectedUser]);

  useEffect(() => {
    if (!selectedUser || isAI || isGroup) return;

    const latest = userMessages[userMessages.length - 1];
    const isSentByUser = latest?.senderId === authUser?._id;
    const chatId = selectedUser.userId;

    if (isSentByUser) {
      initialUnreadMessagesRef.current = [];
      unreadMessagesByChatRef.current[chatId] = [];
      setUnreadIndex(null);
      setUnreadCount(0);
      return;
    }

    const existingIds = new Set(initialUnreadMessagesRef.current.map((m) => m._id));
    const newUnread = unreadMessages.filter(
      (msg) =>
        !existingIds.has(msg._id) &&
        msg.senderId === selectedUser?.userId &&
        msg.receiverId === authUser?._id
    );

    initialUnreadMessagesRef.current.push(...newUnread);
    unreadMessagesByChatRef.current[chatId] = [...initialUnreadMessagesRef.current];
    setUnreadCount(initialUnreadMessagesRef.current.length);

    const firstUnreadId = initialUnreadMessagesRef.current[0]?._id;
    const index = userMessages.findIndex((msg) => msg._id === firstUnreadId);
    setUnreadIndex(index !== -1 ? index : null);
  }, [selectedUser, userMessages, authUser, unreadMessages, isAI, isGroup]);

  useEffect(() => {
    if (!isGroup || !selectedUser?._id) return;

    const latest = groupMessages[groupMessages.length - 1];
    const isSentByUser = (latest?.senderId?._id || latest?.senderId) === authUser._id;
    const chatId = selectedUser._id;

    if (isSentByUser) {
      initialUnreadGroupMessagesRef.current = [];
      unreadMessagesByChatRef.current[chatId] = [];
      setUnreadGroupIndex(null);
      setUnreadGroupCount(0);
      return;
    }

    const existingIds = new Set(initialUnreadGroupMessagesRef.current.map((m) => m._id));
    const newUnread = unreadGroupMessages.filter(
      (msg) =>
        !existingIds.has(msg._id) &&
        msg.group_id === selectedUser._id &&
        (msg.senderId?._id || msg.senderId) !== authUser._id
    );

    initialUnreadGroupMessagesRef.current.push(...newUnread);
    unreadMessagesByChatRef.current[chatId] = [...initialUnreadGroupMessagesRef.current];
    setUnreadGroupCount(initialUnreadGroupMessagesRef.current.length);

    const allMessages = [...groupMessages];
    const unreadIds = new Set(groupMessages.map((m) => m._id));
    newUnread.forEach((msg) => {
      if (!unreadIds.has(msg._id)) {
        allMessages.push(msg);
      }
    });

    const firstUnreadId = initialUnreadGroupMessagesRef.current[0]?._id;
    const index = allMessages.findIndex((msg) => msg._id === firstUnreadId);
    setUnreadGroupIndex(index !== -1 ? index : null);
  }, [groupMessages, unreadGroupMessages, selectedUser, authUser, isGroup]);

  const handleToggleOptions = (messageId) => {
    setActiveMessageId(activeMessageId === messageId ? null : messageId);
  };

  return (
    <div className={styles.messages} ref={messagesContainerRef}>
      {displayMessages.map((msg, index) => {
        const currentDate = new Date(msg.createdAt);
        const previousDate = index > 0 ? new Date(displayMessages[index - 1].createdAt) : null;
        const isNewDate = !previousDate || currentDate.toDateString() !== previousDate.toDateString();

        const isUserMessage =
          (!isAI && !isGroup && msg.receiverId === selectedUser?.userId) ||
          (isGroup && (msg.senderId._id || msg.senderId) === authUser._id);

        const showUnreadDivider =
          (!isAI && !isGroup && unreadIndex === index) ||
          (isGroup && unreadGroupIndex === index);

        const unreadToShow = isGroup ? unreadGroupCount : unreadCount;

        return (
          <div key={msg._id}>
            {isNewDate && (
              <div className={styles.dateDivider}>
                <span>{formatDate(msg.createdAt)}</span>
              </div>
            )}
            {showUnreadDivider && unreadToShow > 0 && (
              <div className={styles.unreadDivider}>
                <span>{unreadToShow} new message{unreadToShow !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div style={{ position: 'relative' }}>
              {isAI ? (
                <>
                  <Message
                    message={{
                      _id: `prompt-${msg._id}`,
                      text: msg.prompt,
                      createdAt: msg.createdAt,
                    }}
                    isUserMessage={true}
                    isLastMessage={index === displayMessages.length - 1}
                    showOptions={activeMessageId === `prompt-${msg._id}`}
                    onToggleOptions={() => handleToggleOptions(`prompt-${msg._id}`)}
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
                      isLastMessage={index === displayMessages.length - 1}
                      showOptions={activeMessageId === `response-${msg._id}`}
                      onToggleOptions={() => handleToggleOptions(`response-${msg._id}`)}
                    />
                  )}
                </>
              ) : (
                <Message
                  message={msg}
                  isUserMessage={isUserMessage}
                  isLastMessage={index === displayMessages.length - 1}
                  showOptions={activeMessageId === msg._id}
                  onToggleOptions={() => handleToggleOptions(msg._id)}
                />
              )}
            </div>
          </div>
        );
      })}

      {(isResponseLoading || isUserTyping) && (
        <Message
          message={{
            _id: 'temp',
            text: 'Responding',
            media: null,
            createdAt: new Date().toISOString(),
          }}
        />
      )}
    </div>
  );
};

export default MessageList;