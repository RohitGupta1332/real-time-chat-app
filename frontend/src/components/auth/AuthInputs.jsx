import React from "react";
import "boxicons";

function AuthInputs() {
    return (
        <div className="auth-inputs">
            <div className="input-group">
                <box-icon name="user" class="input-icon"></box-icon>
                <input type="email" name="email" placeholder="Email ID" />
            </div>
            <div className="input-group">
                <box-icon name="lock" class="input-icon"></box-icon>
                <input type="password" name="password" placeholder="Password" />
            </div>
        </div>
    );
}

export default AuthInputs;
