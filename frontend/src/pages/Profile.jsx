import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from '../store/userAuth';

import Crop from '../components/Crop';
import Button from '../components/Button'
import DownArrow from '../assets/DownArrow.svg';
import styles from '../styles/profile.module.css';
import buttonStyle from '../styles/button.module.css'

import { FaCamera, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    userID: '',
    image: '',
    name: '',
    username: '',
    gender: '',
    bio: '',
    instagramUrl: '',
    youtubeUrl: '',
    facebookUrl: '',
    twitterUrl: '',
  });

  const { createProfile, updateProfile, viewProfile, isLoadingProfile, onlineUsers } = useAuthStore();

  const isView = location.pathname === '/profile/view';
  const isCreate = location.pathname === '/profile/create' || location.pathname === '/profile';
  const isUpdate = location.pathname === '/profile/update';


  useEffect(() => {
    const fetchProfile = async () => {
      if (isView || isUpdate) {
        try {
          const response = await viewProfile();
          const profileData = response.profile;
          setFormData((prev) => ({
            ...prev,
            userID: profileData.userId || '',
            name: profileData.name || '',
            username: profileData.username || '',
            gender: profileData.gender || '',
            bio: profileData.bio || '',
            instagramUrl: profileData.instagramUrl || '',
            youtubeUrl: profileData.youtubeUrl || '',
            facebookUrl: profileData.facebookUrl || '',
            twitterUrl: profileData.twitterUrl || '',
          }));
          setProfileImage(profileData.image || null);
        } catch (error) {
          console.error('Failed to fetch profile:', error.message);
        }
      }
    };
    fetchProfile();
  }, [isView, isUpdate, viewProfile]);

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
    e.preventDefault();
    e.stopPropagation();
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

  const getBase64Image = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64String = canvas.toDataURL('image/jpeg');
        resolve(base64String);
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name || '',
      username: formData.username || '',
      gender: formData.gender || '',
      bio: formData.bio || '',
      instagramUrl: formData.instagramUrl || '',
      youtubeUrl: formData.youtubeUrl || '',
      facebookUrl: formData.facebookUrl || '',
      twitterUrl: formData.twitterUrl || '',
    };

    if ((isCreate || isUpdate) && profileImage) {
      try {
        const base64Image = await getBase64Image(profileImage);
        data.image = base64Image;
      } catch (error) {
        console.error('Error converting image to base64:', error);
        return;
      }
    }

    if (isUpdate) {
      await updateProfile(data, navigate);
    } else {
      await createProfile(data, navigate);
    }
  };

  if (isView) {
    return (
      <div className={styles.page}>
        <div className={styles.left}>
          <h2>PROFILE</h2>
          <div className={styles.profilePicWrapper}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className={styles.profilePic} />
            ) : (
              <div className={styles.addIcon}>
                <IoIosAddCircle size={50} />
              </div>
            )}
            <div
              className={`${styles.statusDot} ${(onlineUsers.indexOf(formData.userID) !== -1) ? styles.online : styles.offline}`}
            />
          </div>
          {isLoadingProfile && <div>Loading profile...</div>}
          <div className={styles.bio}>
            <p>{formData.bio || 'No bio available'}</p>
          </div>
        </div>
        <div className={styles.rightData}>
          <div className={styles.profileInfo}>
            <h3>{formData.name || 'No Name'}</h3>
            <p>{formData.username || 'No Username'}</p>
          </div>
          <div className={styles.socialIcons}>
            {formData.instagramUrl && <a href={formData.instagramUrl} target='_blank'><FaInstagram /></a>}
            {formData.facebookUrl && <a href={formData.facebookUrl} target='_blank'><FaFacebook /></a>}
            {formData.youtubeUrl && <a href={formData.youtubeUrl} target='_blank'><FaYoutube /></a>}
            {formData.twitterUrl && <a href={formData.twitterUrl} target='_blank'><FaXTwitter /></a>}
          </div>
          <button
          className={buttonStyle.button}
          onClick={() => {
            navigate("/profile/update")
          }}
          >Update</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <h2>{isUpdate ? 'UPDATE PROFILE' : 'CREATE PROFILE'}</h2>
        <div className={styles.profilePicWrapper}>
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className={styles.profilePic}
              onClick={triggerFileInput}
            />
          ) : (
            <div className={styles.addIcon} onClick={triggerFileInput}>
              <IoIosAddCircle size={50} />
            </div>
          )}
          <div className={styles.cameraIcon} onClick={triggerFileInput}>
            <FaCamera />
          </div>
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
        <form className={styles.bioForm} onSubmit={handleSubmit}>
          <textarea
            name="bio"
            placeholder="Write Bio"
            className={styles.bio}
            value={formData.bio}
            onChange={handleInputChange}
            required
          ></textarea>
          <Button text={isUpdate ? 'Update & Next' : 'Save & Next'} /> 
        </form>
      </div>
      <div className={styles.right}>
        <div className={styles.inputGrid}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={isUpdate}
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
              required
              disabled={isUpdate}
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
      </div>
    </div>
  );
};

export default Profile;