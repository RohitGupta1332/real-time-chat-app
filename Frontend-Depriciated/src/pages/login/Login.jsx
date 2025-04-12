import React, { useState } from "react";
import "./style.css";
import AuthHeading from "../../components/auth/AuthHeading";
import AuthInputs from "../../components/auth/AuthInputs";
import AuthButton from "../../components/auth/AuthButton";
import { useAuthStore } from "../../store/useAuthStore";
import { ToastContainer, toast } from 'react-toastify';


function Login() {
    const { login } = useAuthStore();
    const [formDetails, setFormDetails] = useState({
        email: "",
        password: ""
    });

    const handleLogin = (e) => {
        e.preventDefault();
        if (formDetails.email === "" || formDetails.password === "") {
            toast.error("Please fill all the fields");
            return
        }
        login(formDetails);
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <AuthHeading heading="Login"></AuthHeading>
                <AuthInputs setFormDetails={setFormDetails}></AuthInputs>
                <AuthButton text1="Login Now" text2="New User" text3="Sign up" handleSubmit={handleLogin}></AuthButton>
            </div>
            <img src="/images/Rectangle 4.jpg" alt="" />
            <ToastContainer />

        </div>
    )
}

export default Login;