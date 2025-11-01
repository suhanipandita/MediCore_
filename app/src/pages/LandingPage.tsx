import React, { useEffect } from 'react';
import Hero from '../components/features/LandingPage/Hero';
import styles from './LandingPage.module.css'; 

// --- Add these imports ---
import { supabase } from '../services/supabaseClient';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setAuth, setProfile, setLoading } from '../store/slices/authSlice';

const LandingPage: React.FC = () => {
  // --- This is the new logic ---
  const dispatch = useAppDispatch();
  const { session } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If the user lands on this page AND they are logged in...
    if (session) {
      // ...log them out.
      supabase.auth.signOut().then(() => {
        // Clear the user's state in Redux
        dispatch(setAuth({ session: null, user: null }));
        dispatch(setProfile(null));
        // Set loading to false just in case
        dispatch(setLoading(false));
      });
    }
    // Run this effect if the session object changes
  }, [session, dispatch]);
  // --- End of new logic ---

  return (
    <div className={styles.landingPageContainer}>
      <Hero />
      {/* Render other sections below the Hero */}
      {/* <HowItWorks /> */}
      {/* <Testimonials /> */}
    </div>
  );
};

export default LandingPage;