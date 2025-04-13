import { useState, useRef } from 'react';
import { useAuthStore } from '../store/userAuth';
import Crop from '../components/Crop';
import DownArrow from '../assets/DownArrow.svg';
import styles from '../styles/profile.module.css';
import { FaCamera } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    gender: '',
    bio: '',
    instagramUrl: '',
    youtubeUrl: '',
    facebookUrl: '',
    twitterUrl: '',
  });

  const { createProfile } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setShowCropper(true);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSelectChange = () => {
    setIsOpen(false);
  };

  const handleCrop = (croppedImageUrl) => {
    setProfileImage(croppedImageUrl);
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name || '');
    data.append('username', formData.username || '');
    data.append('gender', formData.gender || '');
    data.append('bio', formData.bio || '');
    data.append('instagramUrl', formData.instagramUrl || '');
    data.append('youtubeUrl', formData.youtubeUrl || '');
    data.append('facebookUrl', formData.facebookUrl || '');
    data.append('twitterUrl', formData.twitterUrl || '');

    if (profileImage) {
      try {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        data.append('image', blob, 'profile.jpg');
      } catch (error) {
        console.error('Error converting image to blob:', error);
        return;
      }
    }

    const result = await createProfile(data);
    
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <h2>CREATE PROFILE</h2>

        <div className={styles.profilePicWrapper}>
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className={styles.profilePic}
              onClick={triggerFileInput}
            />
          ) : (
            <button
              type="button"
              className={styles.addIcon}
              onClick={triggerFileInput}
            >
              <IoIosAddCircle size={50} />
            </button>
          )}

          <button
            type="button"
            className={styles.cameraIcon}
            onClick={triggerFileInput}
          >
            <FaCamera />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {showCropper && imageToCrop && (
          <Crop
            imageToCrop={imageToCrop}
            onCrop={handleCrop}
            onCancel={handleCancel}
          />
        )}

        <textarea
          name="bio"
          placeholder="Write Bio"
          className={styles.bio}
          value={formData.bio}
          onChange={handleInputChange}
        ></textarea>

        <button type="submit" className={styles.saveBtn} onClick={handleSubmit}>
          Save & Next
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.right}>
        <div className={styles.inputGrid}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
          />

          <div className={styles.selectWrapper}>
            <select
              name="gender"
              onClick={() => setIsOpen(prev => !prev)}
              onChange={(e) => {
                handleSelectChange();
                handleInputChange(e);
              }}
              value={formData.gender}
            >
              <option value="" disabled>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <img
              src={DownArrow}
              alt="Dropdown"
              className={`${styles.customArrow} ${isOpen ? styles.rotated : ''}`}
            />
          </div>

          <input
            type="text"
            name="instagramUrl"
            placeholder="Instagram (Optional)"
            value={formData.instagramUrl}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="facebookUrl"
            placeholder="Facebook (Optional)"
            value={formData.facebookUrl}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="youtubeUrl"
            placeholder="Youtube (Optional)"
            value={formData.youtubeUrl}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="twitterUrl"
            placeholder="Twitter (Optional)"
            value={formData.twitterUrl}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  );
};

export default Profile;
