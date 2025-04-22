import { FaTimes } from 'react-icons/fa';
import { IoDocumentTextSharp } from 'react-icons/io5';
import styles from '../../styles/userChat.module.css';

import AudioPlayer from '../AudioPlayer';

const MediaPreview = ({ file, onRemove }) => {
    return (
        <div className={styles.mediaPreviewContainer}>
            <div className={styles.mediaPreview}>
                {file.type.startsWith('image') && (
                    <img src={URL.createObjectURL(file)} alt="preview" className={styles.mediaImagePreview} />
                )}
                {file.type.startsWith('video') && (
                    <video src={URL.createObjectURL(file)} controls className={styles.mediaVideoPreview} />
                )}
                {file.type.startsWith('audio') && (
                    <AudioPlayer src={URL.createObjectURL(file)} />
                )}
                {(file.type === 'application/pdf' || (file.name?.endsWith('.pdf'))) && (
                    <>
                        <IoDocumentTextSharp className={styles.mediaDocumentIcon} />
                        <div className={styles.mediaFileName}>{file.name ?? 'Unnamed file'}</div>
                    </>
                )}

                {(file.type === 'application/msword' || file.name?.endsWith('.docx')) && (
                    <>
                        <IoDocumentTextSharp className={styles.mediaDocumentIcon} />
                        <div className={styles.mediaFileName}>{file.name ?? 'Unnamed file'}</div>
                    </>
                )}



                <button className={styles.removeButton} onClick={onRemove}>
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default MediaPreview;
