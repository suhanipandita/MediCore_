import { supabase } from './supabaseClient';

// Helper to convert "2025-10-10" and "09:00 AM" into a PostgreSQL timestamp
const convertToISO = (dateStr: string, timeStr: string): string => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const createAppointment = async (
  authUserId: string,
  doctorId: string,
  dateStr: string,
  timeStr: string,
  reason: string
) => {
  // 1. Get the 'public.patients' ID for this authenticated user
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', authUserId)
    .single();

  if (patientError || !patient) {
    throw new Error('Could not find patient profile for this user.');
  }

  // 2. Calculate Start and End times
  // Assuming a default duration of 1 hour
  const startTime = convertToISO(dateStr, timeStr);
  const endDate = new Date(startTime);
  endDate.setHours(endDate.getHours() + 1);
  const endTime = endDate.toISOString();

  // 3. Insert the appointment
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: patient.id,
      doctor_id: doctorId,
      start_time: startTime,
      end_time: endTime,
      status: 'Upcoming', // Default status
      // You could also store 'reason' if you add a column for it in your DB
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};