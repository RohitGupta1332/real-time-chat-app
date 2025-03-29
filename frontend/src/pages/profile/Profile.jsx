import React, { useState } from "react";
import "./style.css";
import "boxicons";
import { useAuthStore } from "../../store/useAuthStore";
import { toast, ToastContainer } from "react-toastify";


function ProfilePage() {

    const { createProfile } = useAuthStore();
    const [formDetails, setFormDetails] = useState({
        name: "",
        username: "",
        gender: "",
        image: "",
        bio: "",
        instagramUrl: "",
        facebookUrl: "",
        youtubeUrl: "",
        twitterUrl: ""
    });

    const validateForm = () => {
        if (!formDetails.name) {
            toast.error("Please enter your name");
            return false;
        }
        if (!formDetails.username) {
            toast.error("Please enter your username")
            return false;
        }
        if (!formDetails.gender) {
            toast.error("Please select your gender")
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append("name", formDetails.name);
            formData.append("username", formDetails.username);
            formData.append("gender", formDetails.gender);
            formData.append("bio", formDetails.bio);
            formData.append("instagramUrl", formDetails.instagramUrl);
            formData.append("facebookUrl", formDetails.facebookUrl);
            formData.append("youtubeUrl", formDetails.youtubeUrl);
            formData.append("twitterUrl", formDetails.twitterUrl);
            formData.append("image", formDetails.image);
            createProfile(formData);
        }
    }
    return (
        <div className="profile-container">
            <form action="" method="post" encType="multipart/form-data">
                <div className="left-section">
                    <h1>CREATE PROFILE</h1>
                    <div className="profile-image-container">
                        <img src="/images/default-profile.jpg" alt="Profile Picture" className="profile-pic" id="profileImage" />
                        <label htmlFor="file-input" className="upload-icon">
                            <box-icon type='solid' name='camera'></box-icon>
                        </label>
                        <input type="file" name="image" id="file-input" accept="image/*" onChange={(e) => setFormDetails({ ...formDetails, image: e.target.files[0] })} />
                    </div>
                    <div className="profile-info">
                        <textarea name="user-bio" id="" placeholder="Write Bio" onChange={(e) => setFormDetails({ ...formDetails, bio: e.target.value })}></textarea>
                        <button className="submit-button" type="submit" onClick={handleSubmit}>Save & Next</button>
                    </div>
                </div>
                <div className="right-section">
                    <input type="text" name="name" id="" placeholder="Name" onChange={(e) => setFormDetails({ ...formDetails, name: e.target.value })} />
                    <input type="text" name="username" id="" placeholder="Username" onChange={(e) => setFormDetails({ ...formDetails, username: e.target.value })} />
                    <select name="gender" value={formDetails.gender}
                        onChange={(e) => setFormDetails({ ...formDetails, gender: e.target.value })}>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer not to say">Prefer not to say</option>
                    </select>
                    <input type="text" name="instagram" id="" placeholder="Instagram (Optional)" onChange={(e) => setFormDetails({ ...formDetails, instagramUrl: e.target.value })} />
                    <input type="text" name="facebook" id="" placeholder="Facebook (Optional)" onChange={(e) => setFormDetails({ ...formDetails, facebookUrl: e.target.value })} />
                    <input type="text" name="youtube" id="" placeholder="Youtube (Optional)" onChange={(e) => setFormDetails({ ...formDetails, youtubeUrl: e.target.value })} />
                    <input type="text" name="twitter" id="" placeholder="Twitter (Optional)" onChange={(e) => setFormDetails({ ...formDetails, twitterUrl: e.target.value })} />

                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default ProfilePage;