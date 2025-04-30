import styles from '../../styles/userChat.module.css'

import { useState } from 'react';
import { toast } from 'react-toastify';

const Scheduler = ({ onScheduleSet, onClose }) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); 
  const nowFormatted = now.toISOString().slice(0, 16);

  const [selectedDateTime, setSelectedDateTime] = useState(nowFormatted);

  const handleConfirm = () => {
    if (new Date(selectedDateTime) > new Date()) {
      onScheduleSet(selectedDateTime); 
      onClose();
    } else {
        toast.error('Please select a future date and time.')
      setSelectedDateTime(nowFormatted);
    }
  };

  return (
    <div className={styles.schedulerPopup}>
      <p className={styles.title}>Schedule message</p>
      <input
        type="datetime-local"
        value={selectedDateTime}
        onChange={(e) => setSelectedDateTime(e.target.value)}
        min={nowFormatted}
        className={styles.dateTimePicker}
      />
      <div className={styles.buttonGroup}>
        <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`} style={{fontSize : '0.85rem'}}>
          Cancel
        </button>
        <button onClick={handleConfirm} className={`${styles.button} ${styles.confirmButton}`} style={{fontSize : '0.85rem'}}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Scheduler;