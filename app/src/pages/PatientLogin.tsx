import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
// 1. Import useAppDispatch and setAuth
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setAuth } from '../store/slices/authSlice';

import styles from './PatientLogin.module.css';
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic'; 

import googleIcon from '../assets/icons/google-logo.svg';
import facebookIcon from '../assets/icons/facebook-logo.svg';
import appleIcon from '../assets/icons/apple-logo.svg';
import microsoftIcon from '../assets/icons/microsoft-logo.svg';

const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D94C4C" />
    </svg>
);

function PatientLogin() {
    const navigate = useNavigate();
    // 2. Initialize dispatch
    const dispatch = useAppDispatch();
    const { session, profile } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);

    useEffect(() => {
        if (session && profile?.role === 'Patient') {
            navigate('/dashboard', { replace: true });
        }
    }, [session, profile, navigate]);

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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(""); setPasswordError(""); setGeneralError("");
        if (!validateEmail() || !validatePassword()) return;

        setLoading(true);
        try {
            // 1. Sign in
            const { data, error: signInError } = await supabase.auth.signInWithPassword({ 
                email: email.trim(), 
                password 
            });
            
            if (signInError) throw signInError;
            if (!data.user || !data.session) throw new Error("No user found");

            // 2. Security Check
            const role = data.user.user_metadata?.role?.toLowerCase();

            if (role !== 'patient') {
                await supabase.auth.signOut();
                throw new Error("Access Denied. This account is not registered as a Patient.");
            }
            
            // 3. CRITICAL FIX: Update Redux Store synchronously BEFORE navigating
            dispatch(setAuth({ session: data.session, user: data.user }));

            // 4. Navigate
            navigate('/dashboard', { replace: true });

        } catch (error: any) {
            console.error("Login failed:", error);
            const msg = error.message === "Invalid login credentials" 
                ? "Invalid email or password." 
                : error.message;
            setGeneralError(msg);
        } finally {
            setLoading(false);
        }
    };

    // ... (social login and rest of the component remains the same) ...
    const handleSocialLogin = async (provider: 'google' | 'apple' | 'microsoft' | 'facebook') => {
        setGeneralError("");
        setSocialLoading(provider);
        try {
            const supabaseProvider = provider === 'microsoft' ? 'azure' : provider;
            const { error: socialError } = await supabase.auth.signInWithOAuth({
                 provider: supabaseProvider,
            });
            if (socialError) throw socialError;
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
            <AuthGraphic />
            <div className={styles.right}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Log in to Patient Portal</h2>
                    <p className={styles.subheading}>One portal for all your healthcare needs.</p>

                    {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

                    <form className={styles.form} onSubmit={handleLogin} noValidate>
                        <div className={styles.inputGroup}>
                             <label htmlFor="login-email" className={styles.label}></label>
                            <input
                                id="login-email" type="email" placeholder="Email" value={email}
                                className={`${styles.input} ${emailError || generalError ? styles.inputError : ''}`}
                                onChange={handleInputChange(setEmail, setEmailError)}
                                required aria-label="Email" aria-invalid={!!emailError || !!generalError}
                                disabled={!!socialLoading}
                            />
                            {emailError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{emailError}</p> </div> )}
                        </div>
                        <div className={styles.inputGroup}>
                             <label htmlFor="login-password" className={styles.label}></label>
                            <input
                                id="login-password" type="password" placeholder="Password" value={password}
                                className={`${styles.input} ${passwordError || generalError ? styles.inputError : ''}`}
                                onChange={handleInputChange(setPassword, setPasswordError)}
                                required aria-label="Password" aria-invalid={!!passwordError || !!generalError}
                                disabled={!!socialLoading}
                            />
                            {passwordError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{passwordError}</p> </div> )}
                        </div>
                        <button className={styles.button} type="submit" disabled={loading || !!socialLoading}>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className={styles.separator}>
                       <div className={styles.line}></div> <br></br>
                       <span style={{ padding: '10px 10px', color: '#2D706E', fontSize: '15px', fontWeight: '500' }}>Log in with</span>
                       <div className={styles.line}></div> <br></br>
                    </div>

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

                    <Link to="/forgot-password" style={{ color: '#2D706E', fontSize: '15px', fontWeight: '500' }} className={styles.link}>Forgot Password?</Link>

                    <p style={{ fontSize: '15px', fontWeight: '500px' }}className={styles.footerText}>Don’t have an account?{" "}
                        <Link to="/signup-patient" style={{ color: '#2D706E', fontSize: '15px', fontWeight: 'bold' }} className={styles.link}>create one now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PatientLogin;