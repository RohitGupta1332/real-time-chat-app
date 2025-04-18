import styles from '../styles/notFound.module.css'

import Error from '../assets/404.svg'
import MaleSocket from '../assets/Male.svg'
import FemaleSocket from '../assets/Female.svg'

import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.images}>
        <img src={FemaleSocket} alt="FemaleSocket" />
        <img src={Error} alt="Error 404 | Page Not Found" />
        <img src={MaleSocket} alt="MaleSocket" />
      </div>
      <h3>Page Not Found</h3>
      <button className={styles.button} onClick={() => navigate('/')}>Go To Homepage</button>
    </div>
  )
}

export default NotFound