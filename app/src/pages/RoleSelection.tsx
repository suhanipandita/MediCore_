import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RoleSelection.module.css"; 

import AuthGraphic from "../components/shared/AuthGraphic/AuthGraphic";

const RoleSelection: React.FC = () => {
    const navigate = useNavigate();

    // Function to handle navigation based on role button click
    const handleRoleSelect = (rolePath: string) => {
        navigate(rolePath);
    };

    return (
        <div className={styles.pageContainer}>
            {/* Left Section (Green Background) */}
            <AuthGraphic/>

            {/* Right Section (White Background) */}
            <div className={styles.rightSection}>
                <div className={styles.rightContentWrapper}> {/* Wrapper for alignment */}
                    <h1 className={styles.rightTitle}>Welcome to MediCore</h1>
                    <p className={styles.rightText}>
                        Select your role below to access your secure healthcare dashboard.
                    </p>
                    {/* Role selection buttons */}
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.roleButton}
                            onClick={() => handleRoleSelect("/login-patient")} // Navigate to Patient login
                        >
                            I’m Patient
                        </button>
                        <button
                            className={styles.roleButton}
                            onClick={() => handleRoleSelect("/login-staff")} // Navigate to Staff login
                        >
                            I’m Staff
                        </button>
                        <button
                            className={styles.roleButton}
                            onClick={() => handleRoleSelect("/login-admin")} // Navigate to Admin login
                        >
                            I’m Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;