import { useState } from "react";

import Login from "./Login";
import Signup from "./Signup";

import styles from '../styles/auth.module.css';

import AuthImg from '../assets/AuthImg.png'

function AuthPage() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className={styles.authPage}>
      {showSignup ? (
        <div className={styles.left}>
          <Signup />
          <div className={styles.dividerText}>
            <span>Already Registered ?{" "}<a onClick={() => setShowSignup(false)}>Login</a></span>
          </div>
        </div>
      ) : (
        <div className={styles.left}>
          <Login />
          <div className={styles.dividerText}>
            <span>New User ?{" "}<a onClick={() => setShowSignup(true)}>Signup</a></span>
          </div>
        </div>
      )}
      <div className={styles.right}>
        <img src={AuthImg} alt="Smiling woman using a tablet with text 'Fast. Simple. Secure.'" />
      </div>
    </div>
  );
}

export default AuthPage;
