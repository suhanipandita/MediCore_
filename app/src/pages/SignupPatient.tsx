import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './SignupPatient.module.css'; // Use the new CSS module
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic'; // The reusable component

// Import icons
import googleIcon from '../assets/icons/google-logo.svg';
import facebookIcon from '../assets/icons/facebook-logo.svg';
import appleIcon from '../assets/icons/apple-logo.svg';
import microsoftIcon from '../assets/icons/microsoft-logo.svg';

// Reusable Error Icon
const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D94C4C" />
    </svg>
);

function SignupPatient() {
    const navigate = useNavigate();

    // --- State Management ---
    const [email, setEmail] = useState("");

    // Error & Loading States
    const [emailError, setEmailError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const [loading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    // --- Validation ---
    const validateEmail = (): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) { setEmailError("Email address is required."); return false; }
        if (!emailRegex.test(email.trim())) { setEmailError("Invalid email format."); return false; }
        setEmailError(""); return true;
    };

    // --- Handlers ---
    const handleEmailContinue = (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        if (validateEmail()) {
            // This is the new navigation logic
            navigate('/signup-password', {
                state: { email: email.trim() }
            });
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'apple' | 'microsoft' | 'facebook') => {
        setGeneralError("");
        setSocialLoading(provider);
        try {
            const supabaseProvider = provider === 'microsoft' ? 'azure' : provider;
            const { error } = await supabase.auth.signInWithOAuth({
                provider: supabaseProvider,
                options: {
                    data: {
                        role: 'patient'
                    }
                }
            } as any);
            if (error) throw error;
        } catch (err: any) {
            console.error(`${provider} login error:`, err);
            setGeneralError(`Failed to initiate login with ${provider}.`);
            setSocialLoading(null);
        }
    };

    // Clear errors on input change
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, errorSetter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setter(e.target.value);
        if (errorSetter) errorSetter("");
        if (generalError) setGeneralError("");
    };

    // --- Render Sub-Components ---

    const renderStep1 = () => (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Create an account</h2>
            <p className={styles.subheading}>Enter your email address to create your account and start your journey with MediCore.</p>

            {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

            <form className={styles.form} onSubmit={handleEmailContinue} noValidate>
                <div className={styles.inputGroup}>
                    <label htmlFor="signup-email" className={styles.label}>Email</label>
                    <input
                        id="signup-email" type="email" placeholder="abc@gmail.com" value={email}
                        className={`${styles.input} ${emailError ? styles.inputError : ''}`}
                        onChange={handleInputChange(setEmail, setEmailError)}
                        required aria-label="Email"
                        disabled={!!socialLoading}
                    />
                    {emailError && (<div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{emailError}</p> </div>)}
                </div>
                <button className={styles.button} type="submit" disabled={loading || !!socialLoading}>
                    Continue
                </button>
            </form>

            <div className={styles.separator}>
                <div className={styles.line}></div>
                <span>Continue with</span>
                <div className={styles.line}></div>
            </div>

            <div className={styles.socialLoginContainer}>
                <button onClick={() => handleSocialLogin('google')} className={styles.socialButton} disabled={!!socialLoading} aria-label="Sign up with Google">
                    <img src={googleIcon} alt="Google" />
                </button>
                <button onClick={() => handleSocialLogin('facebook')} className={styles.socialButton} disabled={!!socialLoading} aria-label="Sign up with Facebook">
                    <img src={facebookIcon} alt="Facebook" />
                </button>
                <button onClick={() => handleSocialLogin('apple')} className={styles.socialButton} disabled={!!socialLoading} aria-label="Sign up with Apple">
                    <img src={appleIcon} alt="Apple" />
                </button>
                <button onClick={() => handleSocialLogin('microsoft')} className={styles.socialButton} disabled={!!socialLoading} aria-label="Sign up with Microsoft">
                    <img src={microsoftIcon} alt="Microsoft" />
                </button>
            </div>

            <p className={styles.legalText}>
                By continuing you agree to Medicore’s <Link to="/terms" className={styles.link}>Terms of Service</Link> and
                acknowledge you’ve read our <Link to="/privacy" className={styles.link}>Privacy Policy</Link>.
            </p>

            <p className={styles.footerText}>
                Already have an account?{" "}
                <Link to="/login-patient" className={styles.link}>Log in</Link>
            </p>
        </div>
    );

    // --- Main Render ---
    return (
    <div className={styles.container}>
        {/* Left side is our reusable component */}
        <AuthGraphic />

        {/* Right side renders Step 1 */}
        <div className={styles.right}>
            {renderStep1()}
        </div>
    </div>
);
}

export default SignupPatient;