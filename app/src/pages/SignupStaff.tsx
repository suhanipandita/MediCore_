import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignupStaff.module.css'; // We will create this
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic';
import { supabase } from '../services/supabaseClient';

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

function SignupStaff() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    const validateEmail = (): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) { setEmailError("Email address is required."); return false; }
        if (!emailRegex.test(email.trim())) { setEmailError("Invalid email format."); return false; }
        setEmailError(""); return true;
    };

    const handleEmailContinue = (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        if (validateEmail()) {
            navigate('/signup-staff-password', {
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
                    data: { role: 'doctor' }
                }
            } as any);
            if (error) throw error;
        } catch (err: any) {
            console.error(`${provider} login error:`, err);
            setGeneralError(`Failed to initiate login with ${provider}.`);
            setSocialLoading(null);
        }
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, errorSetter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (errorSetter) errorSetter("");
        if (generalError) setGeneralError("");
    };

    return (
        <div className={styles.container}>
            <AuthGraphic
                heading="Manage Your Workflow"
                description="Access patient records, manage appointments, and streamline your day."
                activeDotIndex={1}
            />
            <div className={styles.right}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Create a Staff Account</h2>
                    <p className={styles.subheading}>Enter your work email to create your staff account.</p>

                    {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

                    <form className={styles.form} onSubmit={handleEmailContinue} noValidate>
                        <div className={styles.inputGroup}>
                            <label htmlFor="signup-email" className={styles.label}>Work Email</label>
                            <input
                                id="signup-email" type="email" placeholder="abc@work.com" value={email}
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
                        <span>Continue with work account</span>
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
                        <Link to="/privacy" className={styles.link}> Privacy Policy</Link>.
                    </p>

                    <p className={styles.footerText}>
                        Already have an account?{" "}
                        <Link to="/login-staff" className={styles.link}>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupStaff;