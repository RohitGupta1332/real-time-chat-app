import styles from '../styles/button.module.css'

const Button = ({text, disabled = false}) => {
    return <button className={styles.button} disabled={disabled}>{text}</button>
}

export default Button;