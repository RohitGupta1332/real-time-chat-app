import React, { useState } from "react";
import "../login/style.css";
import AuthHeading from "../../components/auth/AuthHeading";
import AuthInputs from "../../components/auth/AuthInputs";
import AuthButton from "../../components/auth/AuthButton";
import { ToastContainer, toast } from 'react-toastify';
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";


function SignUp() {

    const navigate = useNavigate();
    const { signup } = useAuthStore();
    const [formDetails, setFormDetails] = useState({
        email: "",
        password: ""
    });

    const validateForm = () => {
        if (formDetails.email === "") {
            toast.error("Email is required");
            return false;
        }
        if (formDetails.password === "") {
            toast.error("Password is required");
            return false;
        }
        if (formDetails.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }
        return true;
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const res = signup(formDetails, navigate);
        }
    }
    return (
        <div className="auth-page">
            <div className="auth-container">
                <AuthHeading heading="Sign Up"></AuthHeading>
                <AuthInputs setFormDetails={setFormDetails}></AuthInputs>
                <AuthButton text1="Sign Up Now" text2="Already Registered" text3="Login" handleSubmit={handleSignUp}></AuthButton>
            </div>
            <img src="/images/Rectangle 4.jpg" alt="" />
            <ToastContainer />
        </div>
    )
}

export default SignUp;