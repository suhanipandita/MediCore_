import { supabase } from './supabaseClient';

// Type definition based on your UI needs
export interface UIPatient {
  id: string; // This is the UUID from the database
  patientId: string; // We'll map 'mrn' to this for display
  name: string;
  dob: string;
  age: number;
  gender: string;
  mrn: string;
  mobile: string;
  email: string;
  status: 'Active' | 'Critical' | 'Stable' | 'Examining' | 'Discharged' | 'Pending';
  avatarUrl: string;
  lastVisit: string; // Placeholder for now
  treatment: string; // Placeholder for now
}

// Helper to calculate age from DOB
const calculateAge = (dob: string) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Helper mapper
const mapPatient = (row: any): UIPatient => ({
  id: row.id,
  patientId: row.mrn || 'N/A', // Using MRN as the display ID
  name: row.full_name || 'Unknown',
  dob: row.date_of_birth || '',
  age: calculateAge(row.date_of_birth),
  gender: row.gender || 'Unknown',
  mrn: row.mrn || 'N/A',
  mobile: row.mobile || '',
  email: row.email || '',
  status: (row.status as UIPatient['status']) || 'Active',
  avatarUrl: row.avatar_url || 'https://placehold.co/100',
  // Mock data for fields not yet in DB
  lastVisit: '2025-09-14',
  treatment: 'Routine Checkup' 
});

export const fetchPatients = async (): Promise<UIPatient[]> => {
  const { data, error } = await supabase
    .from('patients')
    .select('*');
  
  if (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
  return data.map(mapPatient);
};

export const fetchPatientById = async (id: string): Promise<UIPatient | null> => {
  // We search by the 'mrn' (which is used as ID in URL) OR the UUID 'id'
  // Ideally use UUID in URLs, but for now we'll check both or just use UUID if your router passes it.
  // Assuming the router passes the UUID:
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('mrn', id) // Querying by MRN since that is what we displayed in the list
    .single();

  if (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
  return mapPatient(data);
};