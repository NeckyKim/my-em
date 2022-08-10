import React from "react";
import { authService } from "../FirebaseModules";
import { useNavigate } from "react-router-dom";

import styles from "./Profile.module.css"



function Profile({ userObject }) {
    const navigate = useNavigate();

    function onLogOutClick() {
        authService.signOut();
        navigate("/");
    }



    return (
        <div className={styles.profileContainer}>
            <div className={styles.title}>
                profile
            </div>

            <div className={styles.userEmail}>
                {userObject.email}
            </div>

            <button className={styles.logoutButton} onClick={onLogOutClick}>
                로그아웃
            </button>
        </div>
    )
}

export default Profile;