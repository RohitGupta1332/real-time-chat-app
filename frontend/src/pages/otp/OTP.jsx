import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function OTP() {
    const [otp, setOtp] = useState("");
    const { verifyEmail } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log(otp)
        if (otp.length === 6) {
            verifyEmail(otp, navigate);
        }
        else {
            toast.error("Invalid OTP");
        }
    }

    return (
        <div>
            <h1>OTP Verification</h1>
            <input type="text" name="otp" id="" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
            <input type="submit" value="Submit" onClick={handleSubmit} />
            <ToastContainer />
        </div>
    )
}

export default OTP;