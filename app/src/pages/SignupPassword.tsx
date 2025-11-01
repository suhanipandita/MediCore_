import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './SignupPassword.module.css';
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic';

// --- Reusable Components (from the screenshot) ---

const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#6c757d" />
    </svg>
);

const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D94C4C" />
    </svg>
);

const ProgressBar = ({ currentStep }: { currentStep: number }) => (
    <div className={styles.progressContainer}>
        <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''}`}></div>
        <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''}`}></div>
        <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}></div>
    </div>
);

// --- New Password Checklist Component ---
interface ValidationState {
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    has8Chars: boolean;
}

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


const PasswordChecklist = ({ validation }: { validation: ValidationState }) => {
    return (
        <div className={styles.passwordChecklist}>
            <p>Your password must contain atleast:</p>
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


// --- Main Component ---

function SignupPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    if (!email) {
        React.useEffect(() => {
            navigate('/signup-patient');
        }, [navigate]);
        return <div>Redirecting...</div>;
    }

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(false); // <-- NEW STATE

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Real-time Validation Logic ---
    const validationState = useMemo((): ValidationState => {
        return {
            hasLetter: /[a-zA-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            has8Chars: password.length >= 8,
        };
    }, [password]);

    // --- Form Validation ---
    const validatePasswordStep = (): boolean => {
        let isValid = true;

        // Check all password requirements
        if (!Object.values(validationState).every(Boolean)) {
            setPasswordError("Password does not meet all requirements.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        return isValid;
    };

    const handlePasswordContinue = (e: React.FormEvent) => {
        e.preventDefault();
        // Also activate checklist on submit if user just clicks 'Continue'
        setIsPasswordActive(true);

        if (validatePasswordStep()) {
            navigate('/signup-details', {
                state: {
                    email: email,
                    password: password
                }
            });
        }
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, errorSetter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (errorSetter) errorSetter("");
        if (errorSetter === setConfirmPasswordError) {
            setConfirmPasswordError("");
        }
    };

    return (
        <div className={styles.container}>
            <AuthGraphic />
            <div className={styles.right}>
                <div className={styles.formContainer}>
                    <button onClick={() => navigate('/signup-patient')} className={styles.backLink}>
                        <BackIcon /> Go Back
                    </button>

                    <ProgressBar currentStep={2} />
                    <h2 className={styles.title}>Create an account</h2>
                    <p className={styles.subheading}>Set a secure password for your Patient Portal.</p>

                    <form className={styles.form} onSubmit={handlePasswordContinue} noValidate>
                        {/* Password Input */}
                        <div className={styles.inputGroup}>
                            <div className={styles.passwordWrapper}>
                                <input
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                                    onFocus={() => setIsPasswordActive(true)} // <-- SHOWS CHECKLIST
                                    onChange={(e) => handleInputChange(setPassword, setPasswordError)(e)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.showPasswordButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {/* --- Conditionally render checklist --- */}
                            {isPasswordActive && <PasswordChecklist validation={validationState} />}

                            {/* --- Conditionally render error message --- */}
                            {isPasswordActive && passwordError && !Object.values(validationState).every(Boolean) && (
                                <div className={styles.errorContainer}>
                                    <ErrorIcon /> <p className={styles.errorText}>{passwordError}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className={styles.inputGroup}>
                            <div className={styles.passwordWrapper}>
                                <input
                                    id="signup-confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    className={`${styles.input} ${confirmPasswordError ? styles.inputError : ''}`}
                                    onChange={(e) => handleInputChange(setConfirmPassword, setConfirmPasswordError)(e)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.showPasswordButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {confirmPasswordError && (<div className={styles.errorContainer}> <ErrorIcon /> <p className
                                ={styles.errorText}>{confirmPasswordError}</p> </div>)}
                        </div>

                        <button className={styles.button} type="submit" disabled={loading}>
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupPassword;