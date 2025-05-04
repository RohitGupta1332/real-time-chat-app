import { useState, useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/userAuth';
import { useGroupStore } from '../../store/useGroupStore'; // Add import
import ProfileView from '../ProfileView.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageList from './MessageList.jsx';
import ChatInput from './ChatInput.jsx';
import styles from '../../styles/userChat.module.css';
import AiPage from '../AiPage.jsx';
import GroupChatView from './GroupChatView.jsx';

const UserChat = ({ selectedUser, setSelectedUser, onClose, activeTab }) => {
  const [showProfileView, setShowProfileView] = useState(false);
  const [showProfilePicOptions, setShowProfilePicOptions] = useState(false);
  const { getMessages, listenMessages } = useChatStore();
  const { listenGroupMessages, groups } = useGroupStore(); // Add hook
  const { onlineUsers } = useAuthStore();
  const isGroup = selectedUser?.isGroup; // Check if group

  useEffect(() => {
    if (!onlineUsers || onlineUsers.length === 0) return;

    const unsubscribeFunctions = [];

    // if (isGroup) {
    groups.forEach(group => {
      const group_id = group.group_id._id;
      const unsubscribe = listenGroupMessages(group_id, selectedUser?._id);
      if (typeof unsubscribe === 'function') {
        unsubscribeFunctions.push(unsubscribe);
      }
    });
    onlineUsers.forEach((userId) => {
      const unsubscribe = listenMessages(userId, selectedUser);
      if (typeof unsubscribe === 'function') {
        unsubscribeFunctions.push(unsubscribe);
      }
    });

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [onlineUsers, listenMessages, selectedUser, isGroup, groups, listenGroupMessages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showProfileView) {
          setShowProfileView(false);
        } else if (selectedUser) {
          setSelectedUser(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedUser, showProfileView, setSelectedUser]);

  useEffect(() => {
    if (selectedUser?.userId && !isGroup) {
      getMessages(selectedUser.userId);
      useChatStore.setState((state) => ({
        unreadMessages: state.unreadMessages.filter((msg) => msg.senderId !== selectedUser.userId),
      }));
    }
  }, [selectedUser, getMessages, isGroup]);

  if (showProfileView) {
    return (
      <ProfileView
        formData={{
          userID: selectedUser?.userId,
          name: selectedUser?.name,
          username: selectedUser?.username,
          gender: selectedUser?.gender,
          bio: selectedUser?.bio,
          instagramUrl: selectedUser?.instagramUrl,
          youtubeUrl: selectedUser?.youtubeUrl,
          facebookUrl: selectedUser?.facebookUrl,
          twitterUrl: selectedUser?.twitterUrl,
          image: selectedUser?.image,
        }}
        showProfilePicOptions={showProfilePicOptions}
        setShowProfilePicOptions={setShowProfilePicOptions}
        onClose={() => setShowProfileView(false)}
      />
    );
  }

  if (isGroup) {
    return <GroupChatView group={selectedUser} onClose={onClose} />;
  }

  return (
    <div className={styles.chatContainer}>
      {activeTab === 'ai' ? (
        <AiPage onClose={onClose} />
      ) : selectedUser ? (
        <>
          <ChatHeader
            selectedUser={selectedUser}
            onInfoClick={() => setShowProfileView(true)}
            onClose={onClose}
          />
          <MessageList selectedUser={selectedUser} />
          <ChatInput selectedUser={selectedUser} />
        </>
      ) : (
        <div className={styles.noChatSelected}>
          <p>Select a chat to start the conversation</p>
        </div>
      )}
    </div>
  );
};

export default UserChat;