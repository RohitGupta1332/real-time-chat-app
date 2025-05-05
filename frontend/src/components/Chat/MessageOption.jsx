import styles from '../../styles/userChat.module.css';

const MessageOption = ({ onCopy, onDelete, canDelete = true }) => {
  return (
    <div className={styles.optionContainer}>
      <div className={styles.optionItem} onClick={onCopy}>
        Copy
      </div>
      {canDelete && (
        <div className={styles.optionItem} onClick={onDelete} style={{color : 'red'}}>
          Delete
        </div>
      )}
    </div>
  );
};

export default MessageOption;
