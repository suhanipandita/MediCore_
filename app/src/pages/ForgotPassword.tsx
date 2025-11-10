import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './ForgotPassword.module.css'; // We will update this
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic';

// --- Reusable Components ---

const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D94C4C" />
    </svg>
);

const EmailIcon = () => (
    <svg className={styles.emailIcon} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="32" fill="#E3F9F7"/>
        <path d="M43.3337 21.3333H20.667C19.1939 21.3333 18.0003 22.527 18.0003 24V40C18.0003 41.473 19.1939 42.6666 20.667 42.6666H43.3337C44.8068 42.6666 46.0003 41.473 46.0003 40V24C46.0003 22.527 44.8068 21.3333 43.3337 21.3333ZM43.3337 24V26.3133L32.0003 34.48L20.667 26.3133V24H43.3337ZM43.3337 40H20.667V28.6866L32.0003 36.8533L43.3337 28.6866V40Z" fill="#2D706E"/>
    </svg>
);

// --- Main Component ---

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // This will be our flag
    const [loading, setLoading] = useState(false);

    // --- Validation ---
    const validateEmail = (): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) { setEmailError("Email address is required."); return false; }
        if (!emailRegex.test(email.trim())) { setEmailError("Invalid email format."); return false; }
        setEmailError(""); return true;
    };

    // --- Event Handlers ---
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError("");
        setGeneralError("");
        setSuccessMessage("");
        if (!validateEmail()) return;

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/password-reset`,
            });
            if (error) throw error;
            // Set success message to trigger UI change
            setSuccessMessage("Email sent!"); 
        } catch (error: any) {
            console.error("Password reset failed:", error);
            setGeneralError(error.message || "Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            setGeneralError("No email found to resend verification.");
            return;
        }
        setLoading(true);
        setGeneralError("");
        try {
             const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/password-reset`,
            });
            if (error) throw error;
            // Just provide feedback, no need to change success message
            alert("A new reset link has been sent.");
        } catch (error: any) {
            setGeneralError(error.message || "Failed to resend email.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenEmail = () => {
        const emailDomain = email.split('@')[1] || 'mail.google.com';
        const url = `https://${emailDomain}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        // Unlike signup, we'll stay on this page
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) setEmailError("");
        if (generalError) setGeneralError("");
        if (successMessage) setSuccessMessage(""); // Reset on new typing
    };

    // --- RENDER FUNCTIONS ---

    const renderForm = () => (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Reset Password</h2>
            <p className={styles.subheading}>Enter your email to receive a password reset link</p>

            {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

            <form className={styles.form} onSubmit={handleResetPassword} noValidate>
                <div className={styles.inputGroup}>
                    <label htmlFor="reset-email" className={styles.label}>Email</label>
                    <input
                        id="reset-email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        className={`${styles.input} ${emailError || generalError ? styles.inputError : ''}`}
                        onChange={handleInputChange}
                        required
                        aria-label="Email"
                        disabled={loading}
                    />
                    {emailError && (
                        <div className={styles.errorContainer}>
                            <ErrorIcon />
                            <p className={styles.errorText}>{emailError}</p>
                        </div>
                    )}
                </div>
                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Link'}
                </button>
            </form>

            <Link to="/login-patient" className={`${styles.link} ${styles.backToLogin}`}>
                Back to Login
            </Link>

            <p className={styles.footerText}>
                Don’t have an account?{" "}
                <Link to="/signup-patient" className={styles.link}>create one now</Link>
            </p>
        </div>
    );

    const renderSuccess = () => (
        <div className={styles.successContainer}>
            <EmailIcon />
            <h2 className={styles.successTitle}>Email Sent</h2>
            <p className={styles.successSubheading}>
                An email with password reset link has been sent to <span className={styles.successEmail}>{email}</span>. Open it to reset your password.
            </p>
            
            <button 
                type="button"
                className={styles.button}
                onClick={handleOpenEmail}
            >
                Open Email
            </button>
            
            {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

            <p className={styles.footerText}>
                Didn't receive email?{" "}
                <button onClick={handleResendEmail} className={styles.linkButton} disabled={loading}>
                    {loading ? "Resending..." : "Resend Email"}
                </button>
            </p>
        </div>
    );

    return (
        <div className={styles.container}>
            <AuthGraphic />
            <div className={styles.right}>
                {successMessage ? renderSuccess() : renderForm()}
            </div>
        </div>
    );
}

export default ForgotPassword;