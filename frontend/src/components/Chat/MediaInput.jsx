import styles from '../../styles/userChat.module.css';
import { IoMdPhotos } from "react-icons/io";
import { LuAudioLines } from "react-icons/lu";
import { FaCamera } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";
import { useRef, useState } from 'react';
import CameraCapture from './CameraCapture';

const MediaInput = ({ onMediaSelect }) => {
  const photoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      onMediaSelect(file)
    }
  };

  const handleCapturedData = (data) => {
    if (data instanceof Blob) {
      onMediaSelect(data);
    }
    setShowCamera(false);
  };

  return (
    <div className={styles.mediaInput}>
      <ul>
        <li onClick={() => photoInputRef.current.click()}>
          <IoMdPhotos /> Photos & Videos
          <input
            type="file"
            accept="image/*,video/*"
            style={{ display: 'none' }}
            ref={photoInputRef}
            onChange={(e) => handleFileChange(e, 'photo/video')}
          />
        </li>
        <li onClick={() => audioInputRef.current.click()}>
          <LuAudioLines /> Audio
          <input
            type="file"
            accept="audio/*"
            style={{ display: 'none' }}
            ref={audioInputRef}
            onChange={(e) => handleFileChange(e, 'audio')}
          />
        </li>
        <li onClick={() => setShowCamera(true)}>
          <FaCamera /> Camera
        </li>
        <li onClick={() => documentInputRef.current.click()}>
          <IoDocument /> Document
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
            style={{ display: 'none' }}
            ref={documentInputRef}
            onChange={(e) => handleFileChange(e, 'document')}
          />
        </li>
      </ul>

      {showCamera && (
        <CameraCapture
          onCapture={handleCapturedData}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default MediaInput;