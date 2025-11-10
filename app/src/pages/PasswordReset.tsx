import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './PasswordReset.module.css'; // We will update this
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic';

// --- Reusable Icons ---

const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D94C4C" />
    </svg>
);

// --- NEW ICONS ---
const ShieldCheckIcon = () => (
    <svg className={styles.statusIcon} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="32" fill="#E3F9F7"/>
        <path d="M32 18C35.9466 18 39.1866 20.3016 40.597 23.6334L40.6667 23.8219L40.769 24.1614C41.7481 27.2764 42 29.8166 42 32C42 37.1554 39.5269 41.8108 36.1953 45.1098L32.6667 48.601L32 49.2598L31.3333 48.601L27.8047 45.1098C24.4731 41.8108 22 37.1554 22 32C22 29.8166 22.2519 27.2764 23.231 24.1614L23.3333 23.8219L23.403 23.6334C24.8134 20.3016 28.0534 18 32 18ZM32 21C29.421 21 27.2505 22.6186 26.2483 24.965C25.3787 27.7663 25 30.1066 25 32C25 36.136 26.9859 40.0163 29.7431 42.7441L32 45.0252L34.2569 42.7441C37.0141 40.0163 39 36.136 39 32C39 30.1066 38.6213 27.7663 37.7517 24.965C36.7495 22.6186 34.579 21 32 21ZM30.1667 33.5118L28 31.3451L29.4142 29.9309L30.1667 30.6834L34.5858 26.2642L36 27.6801L30.1667 33.5118Z" fill="#2D706E"/>
    </svg>
);

const ErrorAlertIcon = () => (
    <svg className={styles.statusIcon} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="32" fill="#FDECEA"/>
        <path d="M32 18C24.268 18 18 24.268 18 32C18 39.732 24.268 46 32 46C39.732 46 46 39.732 46 32C46 24.268 39.732 18 32 18ZM32 21C38.0751 21 43 25.9249 43 32C43 38.0751 38.0751 43 32 43C25.9249 43 21 38.0751 21 32C21 25.9249 25.9249 21 32 21ZM31 27V33H33V27H31ZM31 35V37H33V35H31Z" fill="#D94C4C"/>
    </svg>
);


function PasswordReset() {
    const navigate = useNavigate();
    const [pageState, setPageState] = useState<'loading' | 'form' | 'success' | 'invalid'>('loading');
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

    // This handles the access token from the URL fragment
    useEffect(() => {
        // Set a timer. If no event is heard, the link is invalid.
        const timer = setTimeout(() => {
            if (pageState === 'loading') {
                setPageState('invalid');
            }
        }, 2500); // 2.5 second timeout

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
            // This event fires when the page loads with a valid token
            if (event === 'PASSWORD_RECOVERY') {
                clearTimeout(timer); // Valid token found, cancel the timer
                setPageState('form');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, [pageState]); // Only re-run if pageState changes

    // --- Validation ---
    const validatePassword = (): boolean => {
        if (!password) { setPasswordError("Password is required."); return false; }
        if (password.length < 6) { setPasswordError("Password must be at least 6 characters."); return false; }
        setPasswordError(""); return true;
    };

    const validatePasswordMatch = (): boolean => {
        const isPasswordValid = validatePassword();
        let isConfirmValid = true;
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            isConfirmValid = false;
        } else {
            setConfirmPasswordError("");
        }
        return isPasswordValid && isConfirmValid;
    };

    // --- Event Handler ---
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        if (!validatePasswordMatch()) return;

        setLoading(true);
        try {
            // This function only works if the user arrived from the email link
            const { error } = await supabase.auth.updateUser({
                password: password 
            });
            if (error) throw error;
            
            // On success, change to the success screen
            setPageState('success');

        } catch (error: any) {
            console.error("Password update failed:", error);
            if (error.message.includes("Token has expired") || error.message.includes("Invalid")) {
                setPageState('invalid'); // Token expired, show invalid screen
            } else {
                setGeneralError(error.message || "Failed to update password.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, errorSetter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (errorSetter) errorSetter("");
        if (generalError) setGeneralError("");
        if (errorSetter === setPasswordError || errorSetter === setConfirmPasswordError) {
            setConfirmPasswordError("");
        }
    };

    // --- RENDER FUNCTIONS ---

    const renderLoading = () => (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Verifying Link...</h2>
            <p className={styles.subheading}>Please wait while we check your password reset link.</p>
        </div>
    );

    const renderInvalid = () => (
        <div className={styles.invalidContainer}>
            <ErrorAlertIcon />
            <h2 className={styles.statusTitle}>Link Not Valid</h2>
            <p className={styles.statusSubheading}>
                The password reset link has expired or already been used. Request a new password reset link.
            </p>
            <button
                className={styles.button}
                onClick={() => navigate('/forgot-password')}
            >
                Request new link
            </button>
            <button
                className={styles.buttonSecondary}
                onClick={() => navigate('/login-patient')}
            >
                Back to Log in
            </button>
        </div>
    );
    
    const renderSuccess = () => (
        <div className={styles.successContainer}>
            <ShieldCheckIcon />
            <h2 className={styles.statusTitle}>Password Reset Successful</h2>
            <p className={styles.statusSubheading}>
                Your password has been updated. You can now log in with your new credentials.
            </p>
            <button
                className={styles.button}
                onClick={() => navigate('/login-patient')}
            >
                Go to Login
            </button>
        </div>
    );

    const renderForm = () => (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Create a New Password</h2>
            <p className={styles.subheading}>Enter and confirm your new password to regain access to your Patient Portal.</p>

            {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

            <form className={styles.form} onSubmit={handlePasswordUpdate} noValidate>
                {/* New Password Input */}
                <div className={styles.inputGroup}>
                    <label htmlFor="new-password" className={styles.label}>New Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            id="new-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={password}
                            className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                            onChange={handleInputChange(setPassword, setPasswordError)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className={styles.showPasswordButton}
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {passwordError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{passwordError}</p> </div> )}
                </div>

                {/* Confirm New Password Input */}
                <div className={styles.inputGroup}>
                    <label htmlFor="confirm-new-password" className={styles.label}>Confirm New Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            id="confirm-new-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            className={`${styles.input} ${confirmPasswordError ? styles.inputError : ''}`}
                            onChange={handleInputChange(setConfirmPassword, setConfirmPasswordError)}
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className={styles.showPasswordButton}
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {confirmPasswordError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{confirmPasswordError}</p> </div> )}
                </div>

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );

    // This function decides which screen to show
    const renderContent = () => {
        switch (pageState) {
            case 'loading':
                return renderLoading();
            case 'form':
                return renderForm();
            case 'success':
                return renderSuccess();
            case 'invalid':
                return renderInvalid();
            default:
                return renderInvalid(); // Fallback to invalid
        }
    }

    return (
        <div className={styles.container}>
            <AuthGraphic />
            <div className={styles.right}>
                {renderContent()}
            </div>
        </div>
    );
}

export default PasswordReset;