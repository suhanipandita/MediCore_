import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setAuth, setProfile, setLoading } from './store/slices/authSlice';
import type { UserProfile } from './store/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import PatientLogin from './pages/PatientLogin';
import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Placeholder component (optional, can be removed if not used elsewhere)
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
    // --- Initial Session Check ---
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));
      if (currentSession?.user?.id) {
        fetchProfile(currentSession.user.id);
      } else {
        dispatch(setLoading(false));
      }
    });

    // --- Auth State Change Listener ---
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        const userChanged = session?.user?.id !== currentSession?.user?.id;
        dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));

        if (currentSession?.user?.id && userChanged) {
          await fetchProfile(currentSession.user.id);
          // Redirect to dashboard after login, regardless of previous page
          // Check necessary to prevent redirect loop if already on dashboard
          if (window.location.pathname !== '/dashboard') {
            navigate('/dashboard', { replace: true });
          }
        } else if (!currentSession && userChanged) {
          dispatch(setProfile(null));
          // Redirect to role selection if logged out from protected area
          if (window.location.pathname.startsWith('/dashboard')) {
            navigate('/select-role', { replace: true });
          }
        } else if (!currentSession) {
          dispatch(setLoading(false));
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch, navigate, session]);


  const fetchProfile = async (userId: string) => {
    if (!userId) {
      dispatch(setLoading(false));
      return;
    }
    dispatch(setLoading(true));
    try {
      const { data, error, status } = await supabase
        .from('users') // Verify table name
        .select('id, role') // Verify column names
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        console.error('Supabase error fetching profile:', error);
      }
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
      {/* --- Public Routes --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/find-doctors" element={<Placeholder title="Find Doctors" />} />
        <Route path="/appointments" element={<Placeholder title="Appointments" />} />
        <Route path="/my-health" element={<Placeholder title="My Health" />} />
      </Route>

      {/* --- Authentication Routes --- */}
      {/* Role Selection Page */}
      <Route
        path="/select-role"
        element={!session ? <RoleSelection /> : <Navigate to="/dashboard" replace />}
      />
      {/* Specific Login/Signup Pages (linked from RoleSelection) */}
      <Route
        path="/login-patient"
        element={!session ? <PatientLogin /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/login-staff"
        element={!session ? <StaffLogin /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/login-admin"
        element={!session ? <AdminLogin /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/signup"
        element={!session ? <Signup /> : <Navigate to="/dashboard" replace />}
      />
      {/* Add Forgot Password route if needed */}
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

      {/* --- Protected Routes --- */}
      <Route
        path="/dashboard"
        // If not logged in, redirect to Role Selection page
        element={session ? <Dashboard /> : <Navigate to="/select-role" replace />}
      />

      {/* --- Fallback Route --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;