import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuthStore } from '../store/userAuth.js'

import Button from "../components/Button";

import styles from '../styles/auth.module.css';

import AuthImg from '../assets/AuthImg.png'

const Otp = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const navigate = useNavigate();
    const verifyEmail = useAuthStore((state) => state.verifyEmail);

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = otp.join("");
    
        if (code.length !== 6) {
            toast.error("Please enter a valid 6-digit code.");
            return;
        }
    
        await verifyEmail(code, navigate);
    };
    


    const handleChange = (e, index) => {
        const val = e.target.value.replace(/\D/, "");
        if (!val) return;

        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasteData.length === 6) {
            const newOtp = pasteData.split("");
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    };
    

    const handleKeyDown = (e, index) => {
        if ((e.key === "Backspace" || e.key === "Delete")) {
            e.preventDefault();
            const newOtp = [...otp];
        
            if (otp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0 && e.key === "Backspace") {
                inputRefs.current[index - 1].focus();
                newOtp[index - 1] = "";
                setOtp(newOtp);
            }
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if (e.key === "ArrowRight" && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.left}>
                <form onPaste={handlePaste} onSubmit={handleVerify}>
                    <div className={styles.head}>
                        <h1>OTP</h1>
                        <p style={{
                            margin : "0 50px",
                            color : "#989898"
                        }}>Your One Time Password (OTP) has been sent via SMS to your registered Email ID.</p>
                    </div>
                    <div className={styles.inps}>
                        {otp.map((digit, i) => (
                            <input
                            key={i}
                            ref={(el) => inputRefs.current[i] = el}
                            type="text"
                            inputMode="numeric"
                            pattern="\d"
                            maxLength={1}
                            autoFocus={i === 0}
                            value={digit}
                            required
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className={styles.otpInput}
                            />
                        ))}
                    </div>
                    <Button text="Verify"/>
                </form>
                <p className={styles.dividerText}>Didn’t receive the code ?&nbsp;<a href="#">Resend</a></p>
            </div>
            <div className={styles.right}>
                <img src={AuthImg} alt="Smiling woman using a tablet with text 'Fast. Simple. Secure.'" />
            </div>
        </div>
    );
};

export default Otp;