import React from "react";

function AuthHeading({ heading }) {
    return (
        <div className="auth-heading">
            <h1>{heading}</h1>
            <p>Fast. Simple. Secure</p>
        </div>
    )
}

export default AuthHeading;