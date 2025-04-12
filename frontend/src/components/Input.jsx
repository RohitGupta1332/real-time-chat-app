import { useState } from 'react';
import styles from '../styles/input.module.css';
import { IoEye, IoEyeOff } from "react-icons/io5";

const Input = ({ type, placeholder, icon, value, onChange, autoFocus }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <div className={styles.inputWrapper}>
        <img src={icon} alt={`${type} icon`} className={styles.inputIcon} />
        
        <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            className={styles.inputField}
            value={value}
            onChange={onChange}
            required
            autoFocus={autoFocus}
        />

        {isPassword && (
            <span className={styles.eyeIcon} onClick={() => setShowPassword(prev => !prev)}>
            {showPassword ? <IoEyeOff /> : <IoEye />}
            </span>
        )}
        </div>
    );
};

export default Input;
