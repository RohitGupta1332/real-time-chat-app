import Loader from "../components/Loader";
import styles from '../styles/loading.module.css'

const Loading = () => {
    return (
        <div className={styles['loader-overlay']}>
            <Loader />
        </div>
    );
}

export default Loading;