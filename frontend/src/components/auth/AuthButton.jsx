import React from "react";
import "./style.css";

function AuthButton({ text1, text2, text3 }) {
    return (
        <div className="auth-button">
            <button>{text1}</button>
            <p>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯{text2}? <a href="">{text3}</a>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</p>
        </div>
    )
}
export default AuthButton;