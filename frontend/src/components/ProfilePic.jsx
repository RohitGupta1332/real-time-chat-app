import React from 'react';
import styles from '../styles/profilePic.module.css';

const ProfilePic = ({ fileInputRef, image, onClose, onChange, onRemove, isViewMode }) => {
  const handleChangeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <img src={image} alt="Full View" className={styles.fullImage} />
        <div className={styles.actions}>
          <button onClick={onClose}>Close</button>
          <button onClick={() => window.open(image, "_blank")}>View</button>
          <button onClick={handleChangeClick} disabled={isViewMode}>Change</button>
          <button onClick={onRemove} disabled={isViewMode}>Remove</button>
        </div>
      </div>
    </div>
  );
};


export default ProfilePic;