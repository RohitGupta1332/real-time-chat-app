import styles from '../styles/button.module.css'

const Button = ({text}) => {
    return <button className={styles.button}>{text}</button>
}

export default Button;