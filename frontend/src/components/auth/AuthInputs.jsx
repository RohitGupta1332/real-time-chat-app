import React from "react";
import "boxicons";

function AuthInputs({ setFormDetails }) {
    return (
        <div className="auth-inputs">
            <div className="input-group">
                <box-icon name="user" class="input-icon"></box-icon>
                <input type="email" name="email" placeholder="Email ID"
                    onChange={(e) => setFormDetails(prev => ({ ...prev, email: e.target.value }))}
                />
            </div>
            <div className="input-group">
                <box-icon name="lock" class="input-icon"></box-icon>
                <input type="password" name="password" placeholder="Password"
                    onChange={(e) => setFormDetails(prev => ({ ...prev, password: e.target.value }))}
                />
            </div>
        </div>
    );
}

export default AuthInputs;
