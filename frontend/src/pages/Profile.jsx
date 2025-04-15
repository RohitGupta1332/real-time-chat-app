import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from '../store/userAuth';

import Crop from '../components/Crop';
import ProfilePic from '../components/ProfilePic';
import Button from '../components/Button';

import DownArrow from '../assets/DownArrow.svg';
import DefaultPic from '../assets/default-profile.png';

import styles from '../styles/profile.module.css';
import buttonStyle from '../styles/button.module.css';

import { FaCamera, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(DefaultPic);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showProfilePicOptions, setShowProfilePicOptions] = useState(false);

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

  const { authUser, isProfileCreated, createProfile, updateProfile, viewProfile, isLoadingProfile, onlineUsers } = useAuthStore();

  const isView = location.pathname === '/profile/view';
  const isUpdate = location.pathname === '/profile/update';

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser || !isProfileCreated) return;
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
            image: profileData.image || '',
          }));
          const formatImage = (image) => {
            if (!image || typeof image !== 'string') return DefaultPic;
            if (image.startsWith('data:image')) return image;
            return `data:image/jpeg;base64,${image}`;
          };

          setProfileImage(formatImage(profileData.image));
        } catch (error) {
          console.error('Failed to fetch profile:', error.message);
        }
      }
    };
    fetchProfile();
  }, [authUser, isProfileCreated, isView, isUpdate, viewProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
        setShowProfilePicOptions(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCrop = (croppedImageUrl) => {
    setProfileImage(croppedImageUrl);
    setFormData((prev) => ({ ...prev, image: croppedImageUrl }));
    setShowCropper(false);
  };

  const handleCancel = () => {
    setShowCropper(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageToSend = profileImage;
    if (imageToSend && imageToSend.startsWith("blob:")) {
      imageToSend = await blobToBase64(imageToSend);
    }

    const data = {
      ...formData,
      image: imageToSend === DefaultPic ? null : imageToSend
    };

    if (isUpdate) {
      await updateProfile(data, navigate);
    } else {
      await createProfile(data, navigate);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const blobToBase64 = (blobUrl) => {
    return new Promise((resolve, reject) => {
      fetch(blobUrl)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  if (isView) {
    return (
      <div className={styles.page}>
        <RxCross2
          className={styles.crossIcon}
          onClick={() => navigate("/chat")}
        />

        <div className={styles.left}>
          <h2>PROFILE</h2>
          <div className={styles.profilePicWrapper}>
            <img
              src={profileImage || DefaultPic}
              alt="Profile"
              className={styles.profilePic}
              onClick={() => setShowProfilePicOptions(true)}
            />
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
            {formData.instagramUrl && <a href={formData.instagramUrl} target='_blank' rel="noreferrer"><FaInstagram /></a>}
            {formData.facebookUrl && <a href={formData.facebookUrl} target='_blank' rel="noreferrer"><FaFacebook /></a>}
            {formData.youtubeUrl && <a href={formData.youtubeUrl} target='_blank' rel="noreferrer"><FaYoutube /></a>}
            {formData.twitterUrl && <a href={formData.twitterUrl} target='_blank' rel="noreferrer"><FaXTwitter /></a>}
          </div>
          {authUser?._id === formData.userID && (
            <button
              className={buttonStyle.button}
              onClick={() => navigate("/profile/update")}
            >
              Update Profile
            </button>
          )}
        </div>
        {showProfilePicOptions && (
          <ProfilePic
            fileInputRef={fileInputRef}
            image={profileImage}
            onClose={() => setShowProfilePicOptions(false)}
            onRemove={() => {
              setProfileImage(DefaultPic);
              setFormData((prev) => ({ ...prev, image: null }));
              setShowProfilePicOptions(false);
            }}
            isViewMode={true}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <h2>{isUpdate ? 'UPDATE PROFILE' : 'CREATE PROFILE'}</h2>
        <div className={styles.profilePicWrapper}>
          <img
            src={profileImage || DefaultPic}
            alt="Profile"
            className={styles.profilePic}
            onClick={() => setShowProfilePicOptions(true)}
          />
          <div className={styles.cameraIcon} onClick={() => setShowProfilePicOptions(true)}>
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

        {showProfilePicOptions && (
          <ProfilePic
            fileInputRef={fileInputRef}
            image={profileImage}
            onClose={() => setShowProfilePicOptions(false)}
            onRemove={() => {
              setProfileImage(DefaultPic);
              setFormData((prev) => ({ ...prev, image: null }));
              setShowProfilePicOptions(false);
            }}
            isViewMode={false}
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
          <Button text={isUpdate ? 'Update' : 'Save & Next'} />
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
                setIsOpen(false);
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
