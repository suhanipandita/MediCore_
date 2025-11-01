import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './SignupDetails.module.css'; // We will update this
import AuthGraphic from '../components/shared/AuthGraphic/AuthGraphic';

// --- Reusable Components ---

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

// UPDATED ProgressBar to handle 'isComplete'
const ProgressBar = ({ currentStep, isComplete = false }: { currentStep: number, isComplete?: boolean }) => (
    <div className={styles.progressContainer}>
        <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''}`}></div>
        <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''}`}></div>
        <div className={`${styles.progressStep} ${currentStep >= 3 || isComplete ? styles.active : ''}`}></div>
    </div>
);

// --- NEW Email Icon Component ---
const EmailIcon = () => (
    <svg className={styles.emailIcon} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="32" fill="#E3F9F7"/>
        <path d="M43.3337 21.3333H20.667C19.1939 21.3333 18.0003 22.527 18.0003 24V40C18.0003 41.473 19.1939 42.6666 20.667 42.6666H43.3337C44.8068 42.6666 46.0003 41.473 46.0003 40V24C46.0003 22.527 44.8068 21.3333 43.3337 21.3333ZM43.3337 24V26.3133L32.0003 34.48L20.667 26.3133V24H43.3337ZM43.3337 40H20.667V28.6866L32.0003 36.8533L43.3337 28.6866V40Z" fill="#2D706E"/>
    </svg>
);


// --- Main Component ---

function SignupDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const password = location.state?.password;

    if (!email || !password) {
        React.useEffect(() => {
            navigate('/signup-patient');
        }, [navigate]);
        return <div>Redirecting...</div>;
    }

    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");

    const [fullNameError, setFullNameError] = useState("");
    const [dobError, setDobError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    const [loading, setLoading] = useState(false);

    // --- Validation Handler ---
    const validateDetails = (): boolean => {
        let isValid = true;
        if (!fullName.trim()) { setFullNameError("Full name is required."); isValid = false; } else { setFullNameError(""); }
        if (!dob) { setDobError("Date of birth is required."); isValid = false; } else { setDobError(""); }
        if (!gender) { setGenderError("Please select a gender."); isValid = false; } else { setGenderError(""); }
        return isValid;
    };

    // --- Resend Email Handler (NEW) ---
    const handleResendEmail = async () => {
        if (!email) {
            setGeneralError("No email found to resend verification.");
            return;
        }
        setLoading(true);
        setGeneralError("");
        setSuccessMessage(""); // Clear old message
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });
            if (error) throw error;
            // Update success message to show feedback
            setSuccessMessage(`A new verification email has been sent to ${email}.`);
        } catch (error: any) {
            setGeneralError(error.message || "Failed to resend email.");
        } finally {
            setLoading(false);
        }
    };

    // --- Final Signup Handler ---
    const handleFullSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        setSuccessMessage("");
        if (!validateDetails()) return;

        setLoading(true);
        try {
            // @ts-ignore - Supabase types can be out of sync with { data }
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        role: 'patient',
                        full_name: fullName.trim(),
                        date_of_birth: dob,
                        gender: gender
                    }
                }
            });

            if (error) throw error;

            if (data.user && data.user.identities?.length === 0) {
                 setGeneralError("This email is already in use. Please log in.");
            } else if (data.user) {
                // This message will trigger the new UI
                setSuccessMessage(`An email with verification link has been sent to ${email}. Open it to verify your email.`);
                // Clear form
                setFullName("");
                setDob("");
                setGender("");
            }
            
        } catch (error: any) {
            console.error("Signup failed:", error);
            if (error.message.includes("already registered")) {
                setGeneralError("This email is already in use. Please log in.");
            } else {
                setGeneralError(error.message || "Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, errorSetter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setter(e.target.value);
        if (errorSetter) errorSetter("");
        if (generalError) setGeneralError("");
    };

    // --- NEW Success Screen Renderer ---
    const renderSuccess = () => (
        <div className={styles.successContainer}>
            {/* The "Back" button now clears the success message, returning to the form */}
            <button 
                onClick={() => {
                    setSuccessMessage("");
                    // Go back to step 2 (password)
                    navigate('/signup-password', { state: { email: email } });
                }} 
                className={styles.backLink}
            >
                <BackIcon /> Go Back
            </button>
            <ProgressBar currentStep={3} isComplete={true} />

            <h2 className={styles.title}>Create an account</h2>
            <p className={styles.subheading}>Check your inbox and complete the verification</p>

            <EmailIcon />
            <h2 className={styles.successTitle}>Email Sent</h2>
            <p className={styles.successSubheading}>
                An email with verification link has been sent to <span className={styles.successEmail}>{email}</span>. Open it to verify your email.
            </p>

            {/* This is a smart link to the user's email provider */}
            <a href={`https://${email.split('@')[1] || 'mail.google.com'}`} target="_blank" rel="noopener noreferrer" className={styles.button}>
                Open Email
            </a>
            
            {generalError && <p className={styles.errorGlobal}>{generalError}</p>}

            <p className={styles.footerText}>
                Didn't receive email?{" "}
                <button onClick={handleResendEmail} className={styles.linkButton} disabled={loading}>
                    {loading ? "Resending..." : "Resend Email"}
                </button>
            </p>
        </div>
    );

    // --- Form Renderer ---
    const renderForm = () => (
        <div className={styles.formContainer}>
            <button onClick={() => navigate('/signup-password', { state: { email: email } })} className={styles.backLink}>
                <BackIcon /> Go Back
            </button>
            
            <ProgressBar currentStep={3} />
            <h2 className={styles.title}>Create an account</h2>
            <p className={styles.subheading}>Add your details to customize your Patient Portal.</p>

            {generalError && <p className={styles.errorGlobal}>{generalError}</p>}
            
            <form className={styles.form} onSubmit={handleFullSignup} noValidate>
                {/* Full Name */}
                <div className={styles.inputGroup}>
                    <label htmlFor="signup-name" className={styles.label}>Full Name</label>
                    <input
                        id="signup-name" type="text" placeholder="Full Name"
                        value={fullName}
                        className={`${styles.input} ${fullNameError ? styles.inputError : ''}`}
                        onChange={handleInputChange(setFullName, setFullNameError)}
                        required disabled={loading}
                    />
                    {fullNameError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{fullNameError}</p> </div> )}
                </div>

                {/* Date of Birth */}
                <div className={styles.inputGroup}>
                    <label htmlFor="signup-dob" className={styles.label}>Date of Birth</label>
                    <input
                        id="signup-dob" type="date" value={dob}
                        className={`${styles.input} ${dobError ? styles.inputError : ''}`}
                        onChange={handleInputChange(setDob, setDobError)}
                        required disabled={loading}
                    />
                    {dobError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{dobError}</p> </div> )}
                </div>

                {/* Gender */}
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Gender</label>
                    <div className={styles.radioGroup} role="radiogroup">
                        <label className={styles.radioLabel}>
                            <input
                                type="radio" name="gender" value="Male"
                                checked={gender === 'Male'}
                                onChange={handleInputChange(setGender, setGenderError)}
                                disabled={loading}
                            />
                            <span className={styles.customRadio}></span>
                            <span>Male</span>
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio" name="gender" value="Female"
                                checked={gender === 'Female'}
                                onChange={handleInputChange(setGender, setGenderError)}
                                disabled={loading}
                            />
                            <span className={styles.customRadio}></span>
                            <span>Female</span>
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio" name="gender" value="Other"
                                checked={gender === 'Other'}
                                onChange={handleInputChange(setGender, setGenderError)}
                                disabled={loading}
                            />
                            <span className={styles.customRadio}></span>
                            <span>Other</span>
                        </label>
                    </div>
                    {genderError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{genderError}</p> </div> )}
                </div>

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Continue'}
                </button>
            </form>

            <p className={styles.footerText}>
                Already have an account?{" "}
                <Link to="/login-patient" className={styles.link}>Log in</Link>
            </p>
        </div>
    );

    // --- Main Render (UPDATED) ---
    return (
        <div className={styles.container}>
            <AuthGraphic />
            <div className={styles.right}>
                {/* Conditionally render success screen or form */}
                {successMessage ? renderSuccess() : renderForm()}
            </div>
        </div>
    );
}

export default SignupDetails;