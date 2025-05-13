import React, { useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import DefaultPic from '../assets/default-profile.png';
import ProfilePic from './ProfilePic';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/profile.module.css'
import { useAuthStore } from '../store/userAuth';
import buttonStyle from '../styles/button.module.css';

const ProfileView = ({
    formData,
    fileInputRef,
    showProfilePicOptions,
    setShowProfilePicOptions,
    onClose
}) => {
    const navigate = useNavigate();
    const {onlineUsers, authUser, isLoadingProfile, logout} = useAuthStore()

    useEffect(() => {}, [logout])

    return (
        <div className={styles.page}>
            <RxCross2
                className={styles.crossIcon}
                onClick={onClose}
            />
            <div className={styles.left}>
                <h2>PROFILE</h2>
                <div className={styles.profilePicWrapper}>
                    <img
                        src={formData.image || DefaultPic}
                        alt="Profile"
                        className={styles.profilePic}
                        onClick={() => setShowProfilePicOptions(true)}
                    />
                    <div
                        className={`${styles.statusDot} ${onlineUsers.indexOf(formData.userID) !== -1
                                ? styles.online
                                : styles.offline
                            }`}
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
                    {formData.instagramUrl && (
                        <a href={formData.instagramUrl} target="_blank" rel="noreferrer">
                            <FaInstagram />
                        </a>
                    )}
                    {formData.facebookUrl && (
                        <a href={formData.facebookUrl} target="_blank" rel="noreferrer">
                            <FaFacebook />
                        </a>
                    )}
                    {formData.youtubeUrl && (
                        <a href={formData.youtubeUrl} target="_blank" rel="noreferrer">
                            <FaYoutube />
                        </a>
                    )}
                    {formData.twitterUrl && (
                        <a href={formData.twitterUrl} target="_blank" rel="noreferrer">
                            <FaXTwitter />
                        </a>
                    )}
                </div>
                {authUser?._id === formData.userID && (
                    <>
                        <button
                            className={buttonStyle.button}
                            onClick={() => navigate("/profile/update")}
                        >
                            Update Profile
                        </button>
                        <br/>
                        <button
                            className={buttonStyle.button}
                            onClick={() => {logout(navigate)}}>
                            Logout
                        </button>
                    </>
                )}
            </div>

            {showProfilePicOptions && (
                <ProfilePic
                    fileInputRef={fileInputRef}
                    image={formData.image}
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
};

export default ProfileView;
