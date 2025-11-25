import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './PasswordReset.module.css';
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic';

// --- Icons ---

const LinkInvalidIcon = () => (
    <svg className={styles.statusIcon} width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#E3F9F7"/>
        <circle cx="40" cy="40" r="20" fill="#2D706E"/>
        <path d="M38 28H42V44H38V28ZM38 48H42V52H38V48Z" fill="white"/>
    </svg>
);

const ShieldCheckIcon = () => (
    <svg className={styles.statusIcon} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="32" fill="#E3F9F7"/>
        <path d="M32 18C35.9466 18 39.1866 20.3016 40.597 23.6334L40.6667 23.8219L40.769 24.1614C41.7481 27.2764 42 29.8166 42 32C42 37.1554 39.5269 41.8108 36.1953 45.1098L32.6667 48.601L32 49.2598L31.3333 48.601L27.8047 45.1098C24.4731 41.8108 22 37.1554 22 32C22 29.8166 22.2519 27.2764 23.231 24.1614L23.3333 23.8219L23.403 23.6334C24.8134 20.3016 28.0534 18 32 18ZM32 21C29.421 21 27.2505 22.6186 26.2483 24.965C25.3787 27.7663 25 30.1066 25 32C25 36.136 26.9859 40.0163 29.7431 42.7441L32 45.0252L34.2569 42.7441C37.0141 40.0163 39 36.136 39 32C39 30.1066 38.6213 27.7663 37.7517 24.965C36.7495 22.6186 34.579 21 32 21ZM30.1667 33.5118L28 31.3451L29.4142 29.9309L30.1667 30.6834L34.5858 26.2642L36 27.6801L30.1667 33.5118Z" fill="#2D706E"/>
    </svg>
);

const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D94C4C" />
    </svg>
);

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0C3.58187 0 0 3.58187 0 8C0 12.4181 3.58187 16 8 16C12.4181 16 16 12.4181 16 8C16 3.58187 12.4181 0 8 0ZM7.0625 12.1812L3.64375 8.7625L5.05625 7.35L7.0625 9.35625L10.9437 5.475L12.3562 6.8875L7.0625 12.1812Z" fill="#2D706E" />
    </svg>
);

const RadioIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 0C12.4181 0 16 3.58187 16 8C16 12.4181 12.4181 16 8 16C3.58187 16 0 12.4181 0 8C0 3.58187 3.58187 0 8 0Z" fill="#E0E0E0" />
    </svg>
);

interface ValidationState {
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    has8Chars: boolean;
}

const PasswordChecklist = ({ validation }: { validation: ValidationState }) => {
    return (
        <div className={styles.passwordChecklist}>
            <p>Your password must contain atleast</p>
            <ul>
                <li className={validation.hasLetter ? styles.valid : ''}>
                    {validation.hasLetter ? <CheckIcon /> : <RadioIcon />}
                    <span>1 letter</span>
                </li>
                <li className={validation.hasNumber ? styles.valid : ''}>
                    {validation.hasNumber ? <CheckIcon /> : <RadioIcon />}
                    <span>1 number</span>
                </li>
                <li className={validation.hasSpecialChar ? styles.valid : ''}>
                    {validation.hasSpecialChar ? <CheckIcon /> : <RadioIcon />}
                    <span>1 Special character</span>
                </li>
                <li className={validation.has8Chars ? styles.valid : ''}>
                    {validation.has8Chars ? <CheckIcon /> : <RadioIcon />}
                    <span>8 characters</span>
                </li>
            </ul>
        </div>
    );
};

function PasswordReset() {
    const navigate = useNavigate();
    const [pageState, setPageState] = useState<'loading' | 'form' | 'success' | 'invalid'>('loading');
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(false);

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('error_description')) {
            setPageState('invalid');
            return;
        }

        if (hash.includes('type=recovery') || hash.includes('access_token')) {
            setPageState('form');
        } else {
            supabase.auth.getSession().then(({ data }) => {
                if (data.session) {
                    setPageState('form');
                } else {
                    setPageState(prev => prev === 'form' ? 'form' : 'invalid');
                }
            });
        }
    }, []);

    // --- Real-time Validation Logic ---
    const validationState = useMemo((): ValidationState => {
        return {
            hasLetter: /[a-zA-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            has8Chars: password.length >= 8,
        };
    }, [password]);

    const validatePasswordStep = (): boolean => {
        let isValid = true;
        if (!Object.values(validationState).every(Boolean)) {
            setPasswordError("Password does not meet all requirements.");
            isValid = false;
        } else {
            setPasswordError("");
        }
        
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }
        return isValid;
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        
        // Just in case the checklist didn't show
        setIsPasswordActive(true);

        if (!validatePasswordStep()) return;

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password 
            });
            if (error) throw error;
            setPageState('success');
        } catch (error: any) {
            console.error("Password update failed:", error);
            if (error.message.includes("Token has expired") || error.message.includes("Invalid")) {
                setPageState('invalid');
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
        if (errorSetter === setConfirmPasswordError) {
            setConfirmPasswordError("");
        }
    };

    // --- RENDER FUNCTIONS ---

    const renderLoading = () => (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Verifying Link...</h2>
        </div>
    );

    const renderInvalid = () => (
        <div className={styles.invalidContainer}>
            <LinkInvalidIcon />
            <h2 className={styles.statusTitle}>Link Not Valid</h2>
            <p className={styles.statusSubheading}>
                The password reset link has expired or already been used. Request a new password reset link.
            </p>
            <button className={styles.button} onClick={() => navigate('/forgot-password')}>
                Request new link
            </button>
            <button className={styles.buttonSecondary} onClick={() => navigate('/login-patient')}>
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
            <button className={styles.button} onClick={() => navigate('/login-patient')}>
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
                {/* New Password */}
                <div className={styles.inputGroup}>
                    <div className={styles.passwordWrapper}>
                        <input
                            id="new-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={password}
                            className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                            onFocus={() => setIsPasswordActive(true)}
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
                    {passwordError && !isPasswordActive && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{passwordError}</p> </div> )}
                </div>

                {/* --- CHECKLIST APPEARS HERE --- */}
                {isPasswordActive && <PasswordChecklist validation={validationState} />}

                {/* Confirm Password */}
                <div className={styles.inputGroup}>
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

    const renderContent = () => {
        switch (pageState) {
            case 'loading': return renderLoading();
            case 'form': return renderForm();
            case 'success': return renderSuccess();
            case 'invalid': return renderInvalid();
            default: return renderInvalid();
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