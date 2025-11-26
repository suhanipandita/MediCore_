import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setAuth, setProfile, setLoading } from './store/slices/authSlice';
import type { UserProfile } from './store/slices/authSlice';

// --- Layouts ---
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// --- Pages ---
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import PatientLogin from './pages/PatientLogin';
import StaffLogin from './pages/StaffLogin';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import PasswordReset from './pages/PasswordReset';

// --- Dashboards ---
import Dashboard from './pages/Dashboard'; // Patient
import DoctorDashboard from './pages/DoctorDashboard'; // Doctor
import NurseDashboard from './pages/NurseDashboard'; // Nurse
import AdminDashboard from './pages/AdminDashboard';

// --- Features ---
import Appointments from './pages/Appointments';
import PatientList from './pages/PatientList';
import PatientProfile from './pages/PatientProfile';

// --- Signups ---
import SignupPatient from './pages/SignupPatient';
import SignupPassword from './pages/SignupPassword';
import SignupDetails from './pages/SignupDetails';
import SignupStaff from './pages/SignupStaff';
import SignupStaffPassword from './pages/SignupStaffPassword';
import SignupStaffDetails from './pages/SignupStaffDetails';

// Placeholder components
const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem', textAlign: 'center', flexGrow: 1 }}>
    <h2>{title} Page</h2>
    <p>Content coming soon...</p>
  </div>
);

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { session, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let mounted = true;

    // Helper to fetch profile
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
        return data as UserProfile;
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        return null;
      }
    };

    // Main Initialization Logic
    const initializeAuth = async () => {
      try {
        // 1. Check current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (mounted) {
          // Update basic auth state
          dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));

          // 2. If logged in, fetch profile details
          if (currentSession?.user) {
            const profileData = await fetchProfile(currentSession.user.id);
            if (mounted) dispatch(setProfile(profileData));
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        // CRITICAL: Always turn off loading when done to prevent white screen
        if (mounted) {
          dispatch(setLoading(false));
        }
      }
    };

    // Start initialization
    initializeAuth();

    // Safety Timeout: Force loading to false after 5 seconds if Supabase hangs
    const timeoutId = setTimeout(() => {
      if (mounted) dispatch(setLoading(false));
    }, 5000);

    // 3. Listen for realtime auth changes (Login, Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!mounted) return;

        const userId = currentSession?.user?.id;
        
        dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));

        if (userId) {
           // Fetch profile in background
           fetchProfile(userId).then(profile => {
             if(mounted) dispatch(setProfile(profile));
           });
        } else {
           dispatch(setProfile(null));
           // Handle Logout Redirect
           if (window.location.pathname.includes('dashboard')) {
             navigate('/select-role', { replace: true });
           }
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, [dispatch, navigate]);

  if (isLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          color: '#2D706E',
          fontFamily: 'sans-serif' 
        }}>
          <h3>Loading MediCore...</h3>
        </div>
      );
  }

  return (
    <Routes>
      {/* --- Group 1: Public-Facing Routes --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* --- Group 2: Auth Routes --- */}
      <Route element={<Outlet />}>
        <Route path="/select-role" element={<RoleSelection />} />
        
        {/* Patient Flow */}
        <Route path="/login-patient" element={<PatientLogin />} />
        <Route path="/signup-patient" element={<SignupPatient />} />
        <Route path="/signup-password" element={<SignupPassword />} />
        <Route path="/signup-details" element={<SignupDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Staff Flow */}
        <Route path="/login-staff" element={<StaffLogin />} />
        <Route path="/signup-staff" element={<SignupStaff />} />
        <Route path="/signup-staff-password" element={<SignupStaffPassword />} />
        <Route path="/signup-staff-details" element={<SignupStaffDetails />} />
        <Route path="/forgot-password-staff" element={<Placeholder title="Staff Forgot Password" />} />

        {/* Admin Flow */}
        <Route path="/login-admin" element={<AdminLogin />} />
        <Route path="/signup-admin" element={<Placeholder title="Admin Signup" />} />
        <Route path="/forgot-password-admin" element={<Placeholder title="Admin Forgot Password" />} />
      </Route>

      <Route path="/password-reset" element={<PasswordReset />} />

      {/* --- Group 3: Protected Routes --- */}
      <Route element={session ? <DashboardLayout /> : <Navigate to="/select-role" replace />}>
        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Features */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patient-list" element={<PatientList />} />
        <Route path="/patient-profile/:patientId" element={<PatientProfile />} />

        <Route path="/find-doctor" element={<Placeholder title="Find Doctor" />} />
        <Route path="/medical-records" element={<Placeholder title="Medical Records" />} />
        <Route path="/billing" element={<Placeholder title="Bills & Payments" />} />
        <Route path="/staff-management" element={<Placeholder title="Staff Management" />} />
        <Route path="/inventory" element={<Placeholder title="Inventory" />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;