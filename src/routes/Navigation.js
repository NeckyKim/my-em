import React from "react";
import { Link } from "react-router-dom";

import styles from "./Navigation.module.css";



function Navigation() {
    return (
        <div className={styles.navigationContainer}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <span className={styles.title}>
                    my:em
                </span>
            </Link>

            <Link to="/profile" style={{ textDecoration: 'none' }}>
                <span className={styles.profile}>
                    profile
                </span>
            </Link>
        </div>
    )
}

export default Navigation;