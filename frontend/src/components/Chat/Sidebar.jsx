import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../store/userAuth';
import { useChatStore } from '../../store/useChatStore';
import { useGroupStore } from '../../store/useGroupStore';

import BottomNavbar from './Navbar';
import UserChatItem from './UserChatItem';
import SearchResults from './SearchResults';
import GroupAdd from './GroupAdd';

import { FiX, FiUser, FiMenu } from 'react-icons/fi';
import { MdGroupAdd } from 'react-icons/md';

import LockTalk from '../../assets/LockTalk.png';
import Logo from '../../assets/Logo.png';
import AiImage from '../../assets/Ai.jpg';

import styles from '../../styles/sidebar.module.css';

const Sidebar = ({ onUserClick, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
  const [searchValue, setSearchValue] = useState('');
  const [userList, setUserList] = useState([]);
  const [showGroupAdd, setShowGroupAdd] = useState(false);

  const { searchUser, searchResult } = useAuthStore();
  const { users, getUsersForSidebar, isUserLoading, messages, unreadMessages } = useChatStore();
  const { groups, fetchGroups, unreadGroupMessages } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, activeTab]);

  useEffect(() => {
    getUsersForSidebar();
  }, [getUsersForSidebar, unreadMessages, messages]);

  useEffect(() => {
    setUserList([...users]);
  }, [users]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
      if (mediaQuery.matches) setIsShrunk(false);
    };
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    if (searchValue && typeof searchUser === 'function') {
      searchUser(searchValue.trim());
    } else if (!searchValue) {
      useAuthStore.setState({ searchResult: null });
    }
  }, [searchValue, searchUser]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleToggle = () => {
    if (!isMobile) setIsShrunk(!isShrunk);
  };

  const handleAddUserToList = (newUser) => {
    setUserList((prevList) => {
      if (prevList.some((user) => user._id === newUser._id)) {
        return prevList;
      }
      return [newUser, ...prevList];
    });
  };

  const getUnreadCount = (userId, isGroup = false) => {
    if (isGroup) {
      return unreadGroupMessages.filter((msg) => msg.group_id === userId).length;
    }
    return unreadMessages.filter((msg) => msg.senderId === userId).length;
  };

  return (
    <>
      {showGroupAdd && (
        <GroupAdd users={userList} setShowGroupAdd={setShowGroupAdd} />
      )}

      <div className={`${styles.sidebar} ${isShrunk && !isMobile ? styles.shrunk : ''}`}>
        <div className={`${styles.top} ${isShrunk && !isMobile ? styles.shrunkTop : ''}`}>
          {!isShrunk ? (
            <h2>
              <img src={LockTalk} alt="LockTalk" style={{ width: '100px' }} />
            </h2>
          ) : (
            <h2>
              <img src={Logo} alt="Logo" />
            </h2>
          )}
          <div className={`${styles.icons} ${isShrunk && !isMobile ? styles.shrunkIcons : ''}`}>
            <FiUser style={{ cursor: 'pointer' }} onClick={() => navigate('/profile/view')} />
            <MdGroupAdd
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/groups');
                setShowGroupAdd(true);
              }}
            />
            {!isMobile && (
              isShrunk ? (
                <FiMenu style={{ cursor: 'pointer' }} onClick={handleToggle} aria-label="Expand sidebar" />
              ) : (
                <FiX style={{ cursor: 'pointer' }} onClick={handleToggle} aria-label="Shrink sidebar" />
              )
            )}
          </div>
        </div>
        {!isShrunk && activeTab === 'chats' && (
          <>
            <input
              type="search"
              placeholder="Search users..."
              className={styles.search}
              value={searchValue}
              onChange={handleSearchChange}
              aria-label="Search for users"
            />
            {searchValue && (
              <SearchResults
                results={searchResult}
                setSearchValue={setSearchValue}
                onUserClick={onUserClick}
                onAddUserToList={handleAddUserToList}
              />
            )}
            {!searchValue && (
              <div className={styles.userList}>
                {isUserLoading ? (
                  <p>Loading users...</p>
                ) : userList.length === 0 ? (
                  <p>No chats yet</p>
                ) : (
                  userList
                    .filter((user) => user !== null && user !== undefined)
                    .map((user, index) => (
                      <UserChatItem
                        key={user._id || index}
                        id={user._id}
                        userId={user.userId}
                        name={user.name}
                        image={user.image}
                        bio={user.bio}
                        time={''}
                        unreadCount={getUnreadCount(user.userId)}
                        onUserClick={() => onUserClick(user)}
                        isGroup={false}
                      />
                    ))
                )}
              </div>
            )}
          </>
        )}
        {!isShrunk && activeTab === 'ai' && (
          <>
            <input
              type="search"
              placeholder="Search users..."
              className={styles.search}
              value={searchValue}
              onChange={handleSearchChange}
              aria-label="Search for users"
            />
            {searchValue && (
              <SearchResults
                results={searchResult}
                setSearchValue={setSearchValue}
                onUserClick={onUserClick}
                onAddUserToList={handleAddUserToList}
              />
            )}
            <div className={styles.userList}>
              <UserChatItem
                id={'ai-bot-id-001'}
                userId={'ai-bot-uuid-1234567890'}
                name={'Astra'}
                image={AiImage}
                bio={"Heyy, I'm Astra"}
                time={''}
                unreadCount={0}
                onUserClick={() => onUserClick({ userId: 'ai-bot-uuid-1234567890', name: 'Astra', isAI: true })}
                isGroup={false}
              />
            </div>
          </>
        )}
        {!isShrunk && activeTab === 'groups' && (
          <>
            <input
              type="search"
              placeholder="Search users..."
              className={styles.search}
              value={searchValue}
              onChange={handleSearchChange}
              aria-label="Search for users"
            />
            {searchValue && (
              <SearchResults
                results={searchResult}
                setSearchValue={setSearchValue}
                onUserClick={onUserClick}
                onAddUserToList={handleAddUserToList}
              />
            )}
            <div className={styles.userList}>
              {groups.map((groupMembership) => {
                const group = groupMembership.group_id;
                const icon = group.group_icon ? `${import.meta.env.VITE_BASE_URL}/uploads/${group.group_icon}` : '';
                return (
                  <UserChatItem
                    key={group._id}
                    id={group._id}
                    name={group.group_name}
                    image={icon || ''}
                    bio={group.description || 'Group chat'}
                    time={''}
                    unreadCount={getUnreadCount(group._id, true)}
                    onUserClick={() => onUserClick({ ...group, isGroup: true })}
                    isGroup={true}
                  />
                );
              })}
            </div>
          </>
        )}
        <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} isShrunk={isShrunk && !isMobile} />
      </div>
    </>
  );
};

export default Sidebar;