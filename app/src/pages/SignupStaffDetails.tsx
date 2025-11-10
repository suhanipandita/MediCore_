import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import styles from './SignupStaffDetails.module.css'; // We will create this
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
const ProgressBar = ({ currentStep, isComplete = false }: { currentStep: number, isComplete?: boolean }) => (
    <div className={styles.progressContainer}>
        <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''}`}></div>
        <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''}`}></div>
        <div className={`${styles.progressStep} ${currentStep >= 3 || isComplete ? styles.active : ''}`}></div>
    </div>
);
const EmailIcon = () => (
    <svg className={styles.emailIcon} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="32" fill="#E3F9F7"/>
        <path d="M43.3337 21.3333H20.667C19.1939 21.3333 18.0003 22.527 18.0003 24V40C18.0003 41.473 19.1939 42.6666 20.667 42.6666H43.3337C44.8068 42.6666 46.0003 41.473 46.0003 40V24C46.0003 22.527 44.8068 21.3333 43.3337 21.3333ZM43.3337 24V26.3133L32.0003 34.48L20.667 26.3133V24H43.3337ZM43.3337 40H20.667V28.6866L32.0003 36.8533L43.3337 28.6866V40Z" fill="#2D706E"/>
    </svg>
);

// --- Main Component ---
function SignupStaffDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const password = location.state?.password;

    if (!email || !password) {
        React.useEffect(() => { navigate('/signup-staff'); }, [navigate]);
        return <div>Redirecting...</div>;
    }

    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState(""); // 'Doctor' or 'Nurse'
    const [speciality, setSpeciality] = useState("");

    const [fullNameError, setFullNameError] = useState("");
    const [roleError, setRoleError] = useState("");
    const [specialityError, setSpecialityError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Validation Handler ---
    const validateDetails = (): boolean => {
        let isValid = true;
        if (!fullName.trim()) { setFullNameError("Full name is required."); isValid = false; } else { setFullNameError(""); }
        if (!role) { setRoleError("Please select a role."); isValid = false; } else { setRoleError(""); }
        if (role === 'Doctor' && !speciality.trim()) {
            setSpecialityError("Speciality is required for doctors."); isValid = false;
        } else { setSpecialityError(""); }
        return isValid;
    };

    // --- Final Signup Handler ---
    const handleFullSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");
        setSuccessMessage("");
        if (!validateDetails()) return;

        setLoading(true);
        try {
            // @ts-ignore
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        role: role, // 'Doctor' or 'Nurse'
                        full_name: fullName.trim(),
                        speciality: role === 'Doctor' ? speciality.trim() : null
                    }
                }
            });

            if (error) throw error;

            if (data.user && data.user.identities?.length === 0) {
                 setGeneralError("This email is already in use. Please log in.");
            } else if (data.user) {
                setSuccessMessage("Account created! Please check your email for verification.");
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

    // --- RENDER FUNCTIONS ---
    const renderSuccess = () => (
        <div className={styles.successContainer}>
            <button onClick={() => navigate('/login-staff')} className={styles.backLink}>
                <BackIcon /> Go to Login
            </button>
            <ProgressBar currentStep={3} isComplete={true} />
            <EmailIcon />
            <h2 className={styles.successTitle}>Email Sent</h2>
            <p className={styles.successSubheading}>
                An email with verification link has been sent to <span className={styles.successEmail}>{email}</span>. Open it to verify your account.
            </p>
            <button type="button" className={styles.button} onClick={() => navigate('/login-staff')}>
                Go to Login
            </button>
        </div>
    );

    const renderForm = () => (
        <div className={styles.formContainer}>
            <button onClick={() => navigate('/signup-staff-password', { state: { email } })} className={styles.backLink}>
                <BackIcon /> Go Back
            </button>
            
            <ProgressBar currentStep={3} />
            <h2 className={styles.title}>Complete your profile</h2>
            <p className={styles.subheading}>Add your professional details to set up your account.</p>

            {generalError && <p className={styles.errorGlobal}>{generalError}</p>}
            
            <form className={styles.form} onSubmit={handleFullSignup} noValidate>
                <div className={styles.inputGroup}>
                    <label htmlFor="signup-name" className={styles.label}>Full Name</label>
                    <input
                        id="signup-name" type="text" placeholder="Dr. John Doe"
                        value={fullName}
                        className={`${styles.input} ${fullNameError ? styles.inputError : ''}`}
                        onChange={handleInputChange(setFullName, setFullNameError)}
                        required disabled={loading}
                    />
                    {fullNameError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{fullNameError}</p> </div> )}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Role</label>
                    <div className={styles.radioGroup} role="radiogroup">
                        <label className={styles.radioLabel}>
                            <input type="radio" name="role" value="Doctor"
                                checked={role === 'Doctor'}
                                onChange={handleInputChange(setRole, setRoleError)}
                                disabled={loading}
                            />
                            <span className={styles.customRadio}></span>
                            <span>Doctor</span>
                        </label>
                        <label className={styles.radioLabel}>
                            <input type="radio" name="role" value="Nurse"
                                checked={role === 'Nurse'}
                                onChange={handleInputChange(setRole, setRoleError)}
                                disabled={loading}
                            />
                            <span className={styles.customRadio}></span>
                            <span>Nurse</span>
                        </label>
                    </div>
                    {roleError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{roleError}</p> </div> )}
                </div>

                {/* Conditional Field for Doctors */}
                {role === 'Doctor' && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="signup-speciality" className={styles.label}>Speciality</label>
                        <input
                            id="signup-speciality" type="text" placeholder="e.g., Cardiologist"
                            value={speciality}
                            className={`${styles.input} ${specialityError ? styles.inputError : ''}`}
                            onChange={handleInputChange(setSpeciality, setSpecialityError)}
                            required={role === 'Doctor'} disabled={loading}
                        />
                        {specialityError && ( <div className={styles.errorContainer}> <ErrorIcon /> <p className={styles.errorText}>{specialityError}</p> </div> )}
                    </div>
                )}

                <button className={styles.button} type="submit" disabled={loading || !!successMessage}>
                    {loading ? 'Creating Account...' : 'Continue'}
                </button>
            </form>

            <p className={styles.footerText}>
                Already have an account?{" "}
                <Link to="/login-staff" className={styles.link}>Log in</Link>
            </p>
        </div>
    );

    return (
        <div className={styles.container}>
            <AuthGraphic 
                heading="Manage Your Workflow"
                description="Access patient records, manage appointments, and streamline your day."
                activeDotIndex={1}
            />
            <div className={styles.right}>
                {successMessage ? renderSuccess() : renderForm()}
            </div>
        </div>
    );
}

export default SignupStaffDetails;