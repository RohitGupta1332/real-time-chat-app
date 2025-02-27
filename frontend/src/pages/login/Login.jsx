import React from "react";
import "./style.css";
import AuthHeading from "../../components/auth/AuthHeading";
import AuthInputs from "../../components/auth/AuthInputs";
import AuthButton from "../../components/auth/AuthButton";

function Login() {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <AuthHeading heading="Login"></AuthHeading>
                <AuthInputs></AuthInputs>
                <AuthButton text1="Login Now" text2="New User" text3="Sign up"></AuthButton>
            </div>
            <img src="/images/Rectangle 4.jpg" alt="" />
        </div>
    )
}

export default Login;