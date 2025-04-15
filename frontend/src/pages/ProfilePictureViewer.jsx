import React from 'react';
import styles from '../styles/profilePictureViewer.module.css';

const ProfilePictureViewer = ({ image, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <img src={image} alt="Profile Picture" className={styles.fullImage} />
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfilePictureViewer;