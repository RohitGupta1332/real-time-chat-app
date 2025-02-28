import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

function AuthButton({ text1, text2, text3, handleSubmit }) {
    const link = `/${text3.split(" ").join("").toLowerCase()}`;
    return (
        <div className="auth-button">
            <button onClick={handleSubmit}>{text1}</button>
            <p>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯{text2}? <Link to={link} > {text3} </Link> ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</p>
        </div>
    )
}
export default AuthButton;