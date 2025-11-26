import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setAuth, setProfile, setLoading } from './store/slices/authSlice';
import type { UserProfile } from './store/slices/authSlice';

// --- Layouts ---
import MainLayout from './layouts/MainLayout';
import DashboardLayout from '../src/components/layouts/DashboardLayout';

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
import NurseDashboard from './pages/NurseDashboard'; // Nurse (Placeholder)
import AdminDashboard from './pages/AdminDashboard';

// --- Patient Signup ---
import SignupPatient from './pages/SignupPatient';
import SignupPassword from './pages/SignupPassword';
import SignupDetails from './pages/SignupDetails';

// --- Staff Signup ---
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
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));
      if (currentSession?.user?.id) {
          fetchProfile(currentSession.user.id, true); 
      } else {
          dispatch(setLoading(false));
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        const userChanged = session?.user?.id !== currentSession?.user?.id;
        dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));

        if (currentSession?.user?.id && userChanged) {
          await fetchProfile(currentSession.user.id, false);
        } else if (!currentSession && userChanged) {
          dispatch(setProfile(null));
          // If logging out, go to role selection
          if (window.location.pathname.includes('dashboard')) {
            navigate('/select-role', { replace: true });
          }
        }
      }
    );
     return () => { authListener.subscription.unsubscribe(); };
     
  }, [dispatch, navigate]);

  const fetchProfile = async (userId: string, isInitialLoad: boolean) => {
    if (!userId) { 
      dispatch(setLoading(false));
      return;
    }
    if (isInitialLoad) {
      dispatch(setLoading(true));
    }
    try {
      const { data, error, status } = await supabase.from('users').select('id, role').eq('id', userId).single();
      if (error && status !== 406) console.error('Supabase error fetching profile:', error);
      dispatch(setProfile(data as UserProfile | null));
    } catch (error) {
      console.error('Error in fetchProfile function:', error);
      dispatch(setProfile(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (isLoading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Routes>
      {/* --- Group 1: Public-Facing Routes --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* --- Group 2: Auth Routes --- */}
      {/* Removed the !session guard here. We let the Login pages handle redirects internally 
          so they can perform role checks before redirecting. */}
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/find-doctor" element={<Placeholder title="Find Doctor" />} />
        <Route path="/appointments" element={<Placeholder title="Appointments" />} />
        <Route path="/medical-records" element={<Placeholder title="Medical Records" />} />
        <Route path="/billing" element={<Placeholder title="Bills & Payments" />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;