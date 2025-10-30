import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use Link for navigation
import { supabase } from '../services/supabaseClient'; // Adjust path if needed
import styles from './PatientLogin.module.css'; // Import CSS Module

// Import assets (UPDATE PATHS AS NEEDED)
import graphicImage from "../assets/images/role-selection-graphic.png"; // Stethoscope graphic
import googleIcon from '../assets/icons/google-logo.svg';     // Google icon
import facebookIcon from '../assets/icons/facebook-logo.svg'; // Facebook icon
import appleIcon from '../assets/icons/apple-logo.svg';       // Apple icon
import microsoftIcon from '../assets/icons/microsoft-logo.svg'; // Microsoft icon


// Import Error Icon Component
const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D94C4C" />
    </svg>
);

/**
 * PatientLogin Component: Renders the initial login screen with email/password and social options.
 */
function PatientLogin() {
    const navigate = useNavigate();

    // State for login form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false); // Loading for email/password login
    const [socialLoading, setSocialLoading] = useState<string | null>(null); // Track which social provider is loading


    // --- Validation ---
    const validateEmail = (): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmedEmail = email.trim();
        if (trimmedEmail === "") { setEmailError("Email address is required."); return false; }
        if (!emailRegex.test(trimmedEmail)) { setEmailError("Invalid email format."); return false; }
        setEmailError(""); return true;
    };
    const validatePassword = (): boolean => {
        if (password.trim() === "") { setPasswordError("Password is required."); return false; }
        setPasswordError(""); return true;
    };

    // --- Event Handlers ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(""); setPasswordError(""); setGeneralError("");
        if (!validateEmail() || !validatePassword()) return;

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
            if (error) throw error;
            // App.tsx listener handles navigation
        } catch (error: any) {
            console.error("Login failed:", error);
            setGeneralError(error.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    /**
    * Handles initiating OAuth login.
    */
    const handleSocialLogin = async (provider: 'google' | 'apple' | 'microsoft' | 'facebook') => {
        setGeneralError(""); // Clear general errors before attempting social login
        setSocialLoading(provider); // Indicate which provider is loading
        try {
            // Use 'azure' for Microsoft provider in Supabase OAuth
            const supabaseProvider = provider === 'microsoft' ? 'azure' : provider;
            const { error: socialError } = await supabase.auth.signInWithOAuth({
                provider: supabaseProvider
                // options: { redirectTo: window.location.origin + '/dashboard' } // Optional redirect target
            });
            if (socialError) throw socialError;
            // Supabase handles the redirect flow. Loading state persists until redirect.
        } catch (err: any) {
            console.error(`${provider} login error:`, err);
            setGeneralError(`Failed to initiate login with ${provider}.`); // Show error globally
            setSocialLoading(null); // Stop loading only if initiation failed
        }
    };


    // Clear errors on input change
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, errorSetter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (errorSetter) errorSetter(""); // Clear specific field error
        if (generalError) setGeneralError(""); // Clear general error
    };

    // --- Render ---
    return (
        <div className={styles.container}>
            {/* LEFT SIDE */}
            <div className={styles.leftSection}>
                <h1 className={styles.leftTitle}>Medicore</h1>
                <img
                    src={graphicImage} // Use the imported image
                    alt="Healthcare illustration"
                    className={styles.image}
                />
                <h2 className={styles.leftSubtitle}>Smarter Care Starts Here</h2>
                <p className={styles.leftText}>
                    MediCore unites patients and professionals — simplifying care, records, and billing.
                </p>
                {/* Carousel dots (optional visual element) */}
                <div className={styles.carouselDots}>
                    <div className={`${styles.dot} ${styles.activeDot}`}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                </div>
            </div>

            {/* RIGHT SIDE - Login View */}
            <div className={styles.right}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Log in to Patient Portal</h2>
                    <p className={styles.subheading}>One portal for all your healthcare needs.</p>

                    {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

                    <form className={styles.form} onSubmit={handleLogin} noValidate>
                        {/* Email Input */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="login-email" className={styles.label}></label>
                            <input
                                id="login-email" type="email" placeholder="Email" value={email}
                                className={`${styles.input} ${emailError || generalError ? styles.inputError : ''}`}
                                onChange={handleInputChange(setEmail, setEmailError)}
                                required aria-label="Email" aria-invalid={!!emailError || !!generalError}
                                disabled={!!socialLoading} // Disable if social login is in progress
                            />
                            {emailError && (<div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{emailError}</p> </div>)}
                        </div>
                        {/* Password Input */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="login-password" className={styles.label}></label>
                            <input
                                id="login-password" type="password" placeholder="Password" value={password}
                                className={`${styles.input} ${passwordError || generalError ? styles.inputError : ''}`}
                                onChange={handleInputChange(setPassword, setPasswordError)}
                                required aria-label="Password" aria-invalid={!!passwordError || !!generalError}
                                disabled={!!socialLoading} // Disable if social login is in progress
                            />
                            {passwordError && (<div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{passwordError}</p> </div>)}
                        </div>
                        {/* Login Button */}
                        <button className={styles.button} type="submit" disabled={loading || !!socialLoading}>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    {/* --- DIVIDER AND SOCIAL LOGINS --- */}
                    <div className={styles.separator}> {/* Matches reference style */}
                        <div className={styles.line}></div> <br></br>
                        <span style={{ padding: '10px 10px', color: '#2D706E', fontSize: '15px', fontWeight: '500' }}>Log in with</span>
                        <div className={styles.line}></div> <br></br>
                    </div>

                    {/* Matches reference style */}
                    <div className={styles.socialLoginContainer}>
                        <button onClick={() => handleSocialLogin('google')} className={styles.socialButton} disabled={loading || !!socialLoading} aria-label="Login with Google">
                            <img src={googleIcon} alt="Google" />
                        </button>
                        <button onClick={() => handleSocialLogin('facebook')} className={styles.socialButton} disabled={loading || !!socialLoading} aria-label="Login with Facebook">
                            <img src={facebookIcon} alt="Facebook" />
                        </button>
                        <button onClick={() => handleSocialLogin('apple')} className={styles.socialButton} disabled={loading || !!socialLoading} aria-label="Login with Apple">
                            <img src={appleIcon} alt="Apple" />
                        </button>
                        <button onClick={() => handleSocialLogin('microsoft')} className={styles.socialButton} disabled={loading || !!socialLoading} aria-label="Login with Microsoft">
                            <img src={microsoftIcon} alt="Microsoft" />
                        </button>
                    </div>
                    {/* --- END SOCIAL LOGIN SECTION --- */}

                    <Link to="/forgot-password" style={{ color: '#2D706E', fontSize: '15px', fontWeight: '500' }} className={styles.link}>Forgot Password?</Link>

                    {/* Signup Link */}
                    <p style={{ fontSize: '15px', fontWeight: '500px' }} className={styles.footerText}>Don’t have an account?{" "}
                        <Link to="/signup-patient" style={{ color: '#2D706E', fontSize: '15px', fontWeight: 'bold' }} className={styles.link}>create one now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PatientLogin;