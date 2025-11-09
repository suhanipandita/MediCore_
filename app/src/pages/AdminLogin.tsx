import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './AdminLogin.module.css';
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic';

const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#D94C4C" />
    </svg>
);

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password
            });
            if (error) throw error;

            // Verify the user is admin
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (userData && userData.role === 'Admin') {
                navigate('/dashboard', { replace: true });
            } else {
                await supabase.auth.signOut();
                setGeneralError("This login is for administrators only. Please use the correct login page.");
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            setGeneralError(error.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
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
                heading="Admin Access Portal"
                description="Secure administrative access to manage the MediCore system."
            />

            <div className={styles.right}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Admin Login</h2>
                    <p className={styles.subheading}>Access the administrative dashboard.</p>

                    {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

                    <form className={styles.form} onSubmit={handleLogin} noValidate>
                        <div className={styles.inputGroup}>
                            <label htmlFor="admin-email" className={styles.label}></label>
                            <input
                                id="admin-email" type="email" placeholder="Email" value={email}
                                className={`${styles.input} ${emailError || generalError ? styles.inputError : ''}`}
                                onChange={handleInputChange(setEmail, setEmailError)}
                                required aria-label="Email" aria-invalid={!!emailError || !!generalError}
                                disabled={loading}
                            />
                            {emailError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{emailError}</p> </div> )}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="admin-password" className={styles.label}></label>
                            <input
                                id="admin-password" type="password" placeholder="Password" value={password}
                                className={`${styles.input} ${passwordError || generalError ? styles.inputError : ''}`}
                                onChange={handleInputChange(setPassword, setPasswordError)}
                                required aria-label="Password" aria-invalid={!!passwordError || !!generalError}
                                disabled={loading}
                            />
                            {passwordError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{passwordError}</p> </div> )}
                        </div>
                        <button className={styles.button} type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <Link to="/forgot-password" style={{ color: '#2D706E', fontSize: '15px', fontWeight: '500', marginTop: '20px', display: 'block' }} className={styles.link}>Forgot Password?</Link>

                    <p style={{ fontSize: '15px', fontWeight: '500px', marginTop: '20px' }}className={styles.footerText}>Not an administrator?{" "}
                        <Link to="/select-role" style={{ color: '#2D706E', fontSize: '15px', fontWeight: 'bold' }} className={styles.link}>Go back</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
