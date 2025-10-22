import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

// Define the shape of your profile data
interface UserProfile {
  id: string;
  role: 'Admin' | 'Doctor' | 'Nurse' | 'Patient' | null;
  first_name?: string;
  last_name?: string;
}

// Define the initial state
interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  isLoading: true, // Start in loading state until auth is checked
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ session: Session | null; user: User | null }>) => {
      state.session = action.payload.session;
      state.user = action.payload.user;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAuth, setProfile, setLoading } = authSlice.actions;
export default authSlice.reducer;