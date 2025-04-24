import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/userAuth";
import { useGroupStore } from "../../store/useGroupStore";
import UserChatItem from "./UserChatItem";
import Crop from "../Crop";
import styles from '../../styles/groupAdd.module.css';
import DefaultImage from '../../assets/default-profile.png'

const GroupAdd = ({ users, setShowGroupAdd}) => {
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupDescription, setGroupDescription] = useState("");
  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { searchUser, searchResult } = useAuthStore();
  const { createGroup } = useGroupStore();

  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchUser(searchTerm.trim());
    }
  }, [searchTerm]);

  const getFilteredUsers = (usersList) => {
    if (!usersList) return [];
    return usersList.filter(user => 
      !selectedMembers.some(selected => selected.userId === user.userId)
    );
  };

  const handleSelectUser = (user) => {
    if (!selectedMembers.some((member) => member.userId === user.userId)) {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedMembers(selectedMembers.filter((u) => u.userId !== userId));
  };

  const handleCreateGroup = () => {
    if (!groupName || selectedMembers.length === 0) {
      return alert("Please provide a group name and add at least one member.");
    }

    const user_ids = selectedMembers.map((u) => u.userId);
    createGroup(groupName, user_ids, groupDescription, croppedImage);
    setShowGroupAdd(false);
  };

  const filteredUsers = searchTerm ? getFilteredUsers(searchResult) : getFilteredUsers(users);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
  };

  const handleCrop = (croppedImageUrl) => {
    fetch(croppedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "group-icon.jpg", { type: "image/jpeg" });
        setCroppedImage(file);
        setImagePreview(croppedImageUrl);
        setImageToCrop(null);
      });
  };

  const handleCircleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.groupAddOverlay}>
      <div className={styles.groupAddContainer}>
        <div className={styles.groupAddHeader}>
          <h2>Create a New Group</h2>
          <button className={styles.closeButton} onClick={() => setShowGroupAdd(false)}>×</button>
        </div>

        <div className={styles.groupAddInput}>
          <div
            className={styles.groupIconCircle}
            onClick={handleCircleClick}
            style={{
              backgroundImage: `url(${imagePreview || DefaultImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <textarea
            placeholder="Enter group description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>

        {imageToCrop && (
          <Crop
            imageToCrop={imageToCrop}
            onCrop={handleCrop}
            onCancel={handleCropCancel}
          />
        )}

        <div className={styles.groupAddContent}>
          <div className={styles.usersSection}>
            <h3>Search Users</h3>
            <div className={styles.usersListContainer}>
              {filteredUsers?.map((user) => (
                <UserChatItem
                  key={user.userId}
                  id={user.userId}
                  name={user.name}
                  image={user.image}
                  bio={user.bio}
                  onUserClick={() => handleSelectUser(user)}
                />
              ))}
            </div>
          </div>

          <div className={styles.selectedMembersSection}>
            <h3>Selected Members</h3>
            <div className={styles.selectedMembersList}>
              {selectedMembers.length === 0 ? (
                <p>No members added yet</p>
              ) : (
                selectedMembers.map((user) => (
                    <UserChatItem
                      id={user.userId}
                      name={user.name}
                      image={user.image}
                      bio={user.bio}
                      onUserClick={() => handleRemoveUser(user.userId)}
                    />
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.groupAddFooter}>
          <button className={styles.createGroupButton} onClick={handleCreateGroup}>
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupAdd;