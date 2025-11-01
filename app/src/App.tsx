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
import Dashboard from './pages/Dashboard';

// Signup Flow
import SignupPatient from './pages/SignupPatient';
import SignupPassword from './pages/SignupPassword';
import SignupDetails from './pages/SignupDetails';


// Placeholder component
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

  // --- UPDATED Auth Listener (Flash Fix) ---
  useEffect(() => {
    // 1. Check for initial session on app load
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));
      if (currentSession?.user?.id) {
          // If session exists, fetch profile. fetchProfile will set isLoading=false
          fetchProfile(currentSession.user.id, true); // Pass true to signal initial load
      } else {
          // No session, so we are done loading
          dispatch(setLoading(false));
      }
    });

    // 2. Listen for *changes* (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        const userChanged = session?.user?.id !== currentSession?.user?.id;
        dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));

        if (currentSession?.user?.id && userChanged) {
          // User just logged in - fetch their profile
          await fetchProfile(currentSession.user.id, false);
          // *** THE FLASH IS FIXED BY REMOVING NAVIGATION FROM HERE ***
        } else if (!currentSession && userChanged) {
          // User just logged out - clear profile
          dispatch(setProfile(null));
          // If they were on a protected page, send them to /select-role
          if (window.location.pathname.startsWith('/dashboard')) {
            navigate('/select-role', { replace: true });
          }
        }
      }
    );
     return () => { authListener.subscription.unsubscribe(); };
     
  }, [dispatch, navigate]);

  // --- UPDATED fetchProfile ---
  const fetchProfile = async (userId: string, isInitialLoad: boolean) => {
    if (!userId) { 
      dispatch(setLoading(false));
      return;
    }
    // Only set loading on initial load
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

  // --- Loading Screen ---
  if (isLoading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // --- CORRECTED ROUTES ---
  // This structure has no conflicts.
  return (
    <Routes>
      {/* --- Group 1: Public-Facing Routes (Visible to ALL) --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        {/* Add other public-for-all pages like /about or /contact here */}
      </Route>

      {/* --- Group 2: Auth Routes (Logged-out users ONLY) --- */}
      {/* If you are logged in and try to visit these, you go to /dashboard */}
      <Route element={!session ? <Outlet /> : <Navigate to="/dashboard" replace />}>
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/login-patient" element={<PatientLogin />} />
        <Route path="/login-staff" element={<StaffLogin />} />
        <Route path="/login-admin" element={<AdminLogin />} />
        <Route path="/signup-patient" element={<SignupPatient />} />
        <Route path="/signup-password" element={<SignupPassword />} />
        <Route path="/signup-details" element={<SignupDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* --- Group 3: Protected Routes (Logged-in users ONLY) --- */}
      {/* If you are logged out and try to visit these, you go to /select-role */}
      <Route 
        element={session ? <DashboardLayout /> : <Navigate to="/select-role" replace />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/find-doctor" element={<Placeholder title="Find Doctor" />} />
        <Route path="/appointments" element={<Placeholder title="Appointments" />} />
        <Route path="/medical-records" element={<Placeholder title="Medical Records" />} />
        <Route path="/billing" element={<Placeholder title="Bills & Payments" />} />
      </Route>
      
      {/* --- Fallback --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;