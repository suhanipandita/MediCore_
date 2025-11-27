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
import FindDoctors from './pages/FindDoctors';
import ScheduleAppointment from './pages/ScheduleAppointment';
import ReviewConfirm from './pages/ReviewConfirm';
import MedicalRecords from './pages/MedicalRecords';
import Inventory from './pages/Inventory'; // Nurse Inventory
import AdminInventory from './pages/AdminInventory'; // Admin Inventory
import InventoryItemDetail from './pages/InventoryItemDetail'; // Admin Item Detail

// --- Dashboards ---
import Dashboard from './pages/Dashboard'; // Patient
import DoctorDashboard from './pages/DoctorDashboard'; // Doctor
import NurseDashboard from './pages/NurseDashboard'; // Nurse
import AdminDashboard from './pages/AdminDashboard';
import Billing from './pages/Billing';
import NewInvoice from './pages/Newinvoice';

// --- Features ---
import PatientAppointments from './pages/PatientAppointments';
import Appointments from './pages/Appointments';
import PatientList from './pages/PatientList';
import PatientProfile from './pages/PatientProfile';
import StaffManagement from './pages/StaffManagement';
import StaffProfile from './pages/StaffProfile';

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
  const { session, isLoading, profile } = useAppSelector((state) => state.auth);

  // --- FIX: robust role detection ---
  // Uses profile if available, otherwise falls back to session metadata
  const userRole = (profile?.role || session?.user?.user_metadata?.role || '').toLowerCase();

  useEffect(() => {
    let mounted = true;

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

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));

          if (currentSession?.user) {
            const profileData = await fetchProfile(currentSession.user.id);
            if (mounted) dispatch(setProfile(profileData));
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        if (mounted) {
          dispatch(setLoading(false));
        }
      }
    };

    initializeAuth();

    const timeoutId = setTimeout(() => {
      if (mounted) dispatch(setLoading(false));
    }, 5000);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!mounted) return;

        const userId = currentSession?.user?.id;
        dispatch(setAuth({ session: currentSession, user: currentSession?.user ?? null }));

        if (userId) {
          fetchProfile(userId).then(profile => {
            if (mounted) dispatch(setProfile(profile));
          });
        } else {
          dispatch(setProfile(null));
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
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route element={<Outlet />}>
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/login-patient" element={<PatientLogin />} />
        <Route path="/signup-patient" element={<SignupPatient />} />
        <Route path="/signup-password" element={<SignupPassword />} />
        <Route path="/signup-details" element={<SignupDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login-staff" element={<StaffLogin />} />
        <Route path="/signup-staff" element={<SignupStaff />} />
        <Route path="/signup-staff-password" element={<SignupStaffPassword />} />
        <Route path="/signup-staff-details" element={<SignupStaffDetails />} />
        <Route path="/forgot-password-staff" element={<Placeholder title="Staff Forgot Password" />} />
        <Route path="/login-admin" element={<AdminLogin />} />
        <Route path="/signup-admin" element={<Placeholder title="Admin Signup" />} />
        <Route path="/forgot-password-admin" element={<Placeholder title="Admin Forgot Password" />} />
      </Route>

      <Route path="/password-reset" element={<PasswordReset />} />

      <Route element={session ? <DashboardLayout /> : <Navigate to="/select-role" replace />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/staff/:staffId" element={<StaffProfile />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/billing/new" element={<NewInvoice />} />
        
        {/* --- FIX: Use the robust 'userRole' variable here --- */}
        <Route 
          path="/inventory" 
          element={userRole === 'admin' ? <AdminInventory /> : <Inventory />} 
        />
        <Route path="/inventory/:itemId" element={<InventoryItemDetail />} />

        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patient-list" element={<PatientList />} />
        <Route path="/patient-profile/:patientId" element={<PatientProfile />} />
        <Route path="/my-appointments" element={<PatientAppointments />} />
        <Route path="/find-doctors" element={<FindDoctors />} />
        <Route path="/schedule-appointment/:doctorId" element={<ScheduleAppointment />} />
        <Route path="/review-confirm/:doctorId" element={<ReviewConfirm />} />
        <Route path="/medical-records" element={<Placeholder title="Medical Records" />} />
        <Route path="/staff-management" element={<Placeholder title="Staff Management" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;