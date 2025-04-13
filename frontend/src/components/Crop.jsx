import { useRef, useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from '../styles/crop.module.css';

const Crop = ({ imageToCrop, onCrop, onCancel }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({
    unit: 'px',
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    aspect: 1,
  });

  const getCroppedImage = useCallback(() => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          onCrop(croppedImageUrl);
        } else {
          console.error('Failed to create blob from cropped image');
        }
      }, 'image/jpeg', 0.8);
    } else {
      console.warn('Image or crop dimensions not ready');
    }
  }, [crop, onCrop]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Crop Your Profile Picture</h3>
        <div className={styles.cropContainer}>
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            aspect={1}
            circularCrop={true}
          >
            <img ref={imgRef} src={imageToCrop} alt="Crop" className={styles.cropImage} />
          </ReactCrop>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.applyButton} onClick={getCroppedImage}>
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default Crop;