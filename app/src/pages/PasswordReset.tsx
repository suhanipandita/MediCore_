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

const SuccessShieldIcon = () => (
    <svg className={styles.statusIcon} width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#E3F9F7" />
        <path d="M40 22C35.5 22 31.5 20.5 28 18V32C28 42 33 51 40 54C47 51 52 42 52 32V18C48.5 20.5 44.5 22 40 22Z" fill="#2D706E" transform="scale(1.5) translate(-13, -8)"/> 
        <path d="M34 38L38 42L46 34" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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

    // IMPORTANT: Empty dependency array [] ensures this ONLY runs on first load
    useEffect(() => {
        const hash = window.location.hash;
        
        if (hash.includes('error_description')) {
            setPageState('invalid');
            return;
        }

        // Optimistic check
        if (hash.includes('type=recovery') || hash.includes('access_token')) {
            setPageState('form');
        } else {
            // Session check
            supabase.auth.getSession().then(({ data }) => {
                if (data.session) {
                    setPageState('form');
                } else {
                    // Wait a brief moment before declaring invalid to prevent flicker
                    setTimeout(() => {
                        setPageState(prev => prev === 'form' ? 'form' : 'invalid');
                    }, 500);
                }
            });
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setPageState('form');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []); // <--- Empty array means: DO NOT re-run when I change pageState to 'success'

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
        setIsPasswordActive(true);

        if (!validatePasswordStep()) return;

        setLoading(true);

        try {
            // 1. Update the password
            const { error } = await supabase.auth.updateUser({
                password: password 
            });
            if (error) throw error;
            
            // 2. Set Success State
            setPageState('success');

        } catch (error: any) {
            console.error("Password update failed:", error);
            if (error.message.includes("Token has expired") || error.message.includes("Invalid")) {
                setPageState('invalid');
            } else {
                setGeneralError(error.message || "Failed to update password.");
            }
        } finally {
            // 3. Always stop loading
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
            <SuccessShieldIcon />
            <h2 className={styles.statusTitle}>Password Reset Successful</h2>
            <p className={styles.statusSubheading}>
                Your password has been successfully reset. Click below to log in magically.
            </p>
            <button className={styles.button} onClick={() => navigate('/login-patient')}>
                Back to Login
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

                {/* Checklist */}
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