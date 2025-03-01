import React from "react";
import "./style.css";
import "boxicons";


function ProfilePage() {
    return (
        <div className="profile-container">
            <div className="left-section">
                <h1>CREATE PROFILE</h1>
                <div class="profile-image-container">
                    <img src="/images/default-profile.jpg" alt="Profile Picture" class="profile-pic" id="profileImage" />
                    <label for="file-input" class="upload-icon">
                        <box-icon type='solid' name='camera'></box-icon>
                    </label>
                    <input type="file" id="file-input" accept="image/*" onchange="previewImage(event)" />
                </div>
                <div className="profile-info">
                    <textarea name="user-bio" id="" placeholder="Write Bio"></textarea>
                    <button type="submit">Save & Next</button>
                </div>
            </div>
            <div className="right-section">
                <input type="text" name="name" id="" placeholder="Name" />
                <input type="text" name="username" id="" placeholder="Username" />
                <select name="gender" id="">
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer not to say">Prefer not to say</option>
                </select>
                <input type="text" name="instagram" id="" placeholder="Instagram (Optional)" />
                <input type="text" name="facebook" id="" placeholder="Facebook (Optional)" />
                <input type="text" name="youtube" id="" placeholder="Youtube (Optional)" />
                <input type="text" name="twitter" id="" placeholder="Twitter (Optional)" />

            </div>
        </div>
    )
}

export default ProfilePage;