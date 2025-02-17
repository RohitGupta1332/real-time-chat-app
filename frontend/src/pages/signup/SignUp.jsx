import React from "react";
import "../login/style.css";
import AuthHeading from "../../components/auth/AuthHeading";
import AuthInputs from "../../components/auth/AuthInputs";
import AuthButton from "../../components/auth/AuthButton";

function SignUp() {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <AuthHeading heading="Sign Up"></AuthHeading>
                <AuthInputs></AuthInputs>
                <AuthButton text1="Sign Up Now" text2="Already Registered" text3="Login"></AuthButton>
            </div>
            <img src="./public/images/Rectangle 4.jpg" alt="" />
        </div>
    )
}

export default SignUp;