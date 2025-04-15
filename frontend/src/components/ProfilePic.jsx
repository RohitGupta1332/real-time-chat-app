import React, { useState } from 'react';
import styles from '../styles/profilePic.module.css';
import ProfilePictureViewer from '../pages/ProfilePictureViewer'; // Import the new component

const ProfilePic = ({ fileInputRef, image, onClose, onChange, onRemove, isViewMode }) => {
  const [showViewer, setShowViewer] = useState(false);

  const handleChangeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleView = () => {
    setShowViewer(true);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <img src={image} alt="Full View" className={styles.fullImage} />
        <div className={styles.actions}>
          <button onClick={onClose}>Close</button>
          <button onClick={handleView}>View</button>
          <button onClick={handleChangeClick} disabled={isViewMode}>Change</button>
          <button onClick={onRemove} disabled={isViewMode}>Remove</button>
        </div>
      </div>
      {showViewer && (
        <ProfilePictureViewer
          image={image}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
};

export default ProfilePic;