import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient'; // Correct path
import { useAppDispatch, useAppSelector } from './store/hooks'; // Correct path
import { setAuth, setProfile, setLoading } from './store/slices/authSlice'; // Correct path

// Layouts
import MainLayout from './layouts/MainLayout'; // Import your layout (will be created next)

// Pages
import LandingPage from './pages/LandingPage'; // Import your landing page (will be created next)
// import Login from './pages/Login'; // Placeholder - Create this page later
// import Dashboard from './pages/Dashboard'; // Placeholder - Create this page later

// Placeholder components for other routes (REMOVE LATER)
const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>{title} Page</h2>
    <p>Content coming soon...</p>
  </div>
);
const Login = () => <Placeholder title="Login" />; // TEMPORARY
const Dashboard = () => <Placeholder title="Dashboard" />; // TEMPORARY


function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { session, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));
      if (currentSession) {
        fetchProfile(currentSession.user.id);
      } else {
        dispatch(setLoading(false)); // Not logged in, stop loading
      }
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        const userChanged = session?.user?.id !== currentSession?.user?.id;
        dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));

        if (currentSession && userChanged) {
           await fetchProfile(currentSession.user.id);
           // Optional: Redirect to dashboard on login
           // if (window.location.pathname === '/login') navigate('/dashboard');
        } else if (!currentSession) {
          dispatch(setProfile(null)); // Clear profile on logout
          // Optional: Redirect to login on logout if user is on a protected page
          // if (window.location.pathname.startsWith('/dashboard')) navigate('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch, navigate, session]); // Added session as dependency as it's used in the effect


  const fetchProfile = async (userId: string) => {
     if (!userId) {
        dispatch(setLoading(false));
        return;
     }
    dispatch(setLoading(true));
    try {
      // **IMPORTANT:** Check YOUR Supabase table/column names in migrations/20251021102306_remote_schema.sql
      // It looks like your table is 'users' and columns are 'id', 'role', maybe 'full_name'? Adjust accordingly.
      const { data, error, status } = await supabase
        .from('users') // *** Verify this table name ***
        .select(`id, role, first_name, last_name`) // *** Verify these column names ***
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406 means no row found, which is okay
        console.error('Error fetching profile:', error);
        // Don't throw here, just log or handle gracefully
      }
      // Cast 'data' to the correct UserProfile type from authSlice
      dispatch(setProfile(data as any)); // Use `as UserProfile` if UserProfile type is defined correctly

    } catch (error) {
      console.error('Error in fetchProfile:', error);
       dispatch(setProfile(null)); // Clear profile on error
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Basic Loading indicator while checking auth
  // You might see "Loading..." briefly before the page renders
  if (isLoading && !session) { // Only show loading if not already logged in/session restored
      return <div>Loading...</div>; // Replace with a proper spinner later
  }

  return (
    <Routes>
      {/* Public routes using MainLayout (Header + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        {/* These placeholders will be replaced later */}
        <Route path="/find-doctors" element={<Placeholder title="Find Doctors" />} />
        <Route path="/appointments" element={<Placeholder title="Appointments" />} />
        <Route path="/my-health" element={<Placeholder title="My Health" />} />
      </Route>

      {/* Auth routes (usually without MainLayout) */}
      {/* If logged in, redirect from /login to /dashboard */}
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" replace />} />
      {/* <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dashboard" replace />} /> */}

      {/* Protected Routes - Render Dashboard only if logged in, else redirect to /login */}
      <Route
        path="/dashboard"
        element={session ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      {/* Fallback route - Redirect unknown paths to home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;