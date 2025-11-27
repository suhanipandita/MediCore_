import { supabase } from './supabaseClient';
import type{ DBDoctor } from '../types/db';
import defaultDoctorImg from '../assets/images/doctor-hero.png'; 

export interface UIDoctor {
  id: string;
  name: string;
  speciality: string;
  imageSrc: string;
  rating: number;
  reviews: number;
  experience: number;
  consultationFee: number;
  location: string;
  gender: string;
  availability: any[]; 
}

const mapDoctorData = (doc: DBDoctor): UIDoctor => ({
  id: doc.id,
  name: doc.name,
  speciality: doc.speciality || 'General Physician',
  imageSrc: doc.image_src || defaultDoctorImg,
  rating: Number(doc.rating) || 0,
  reviews: doc.reviews || 0,
  experience: doc.experience || 0,
  consultationFee: doc.consultation_fee || 0,
  location: doc.location || 'Unknown',
  gender: doc.gender || 'Unknown',
  availability: Array.isArray(doc.availability) ? doc.availability : []
});

export const fetchDoctors = async (): Promise<UIDoctor[]> => {
  // DEBUG: Log that we are starting the fetch
  console.log("Fetching doctors from Supabase...");

  const { data, error } = await supabase.from('doctors').select('*');

  if (error) {
    // DEBUG: Log any error from Supabase
    console.error('Error fetching doctors:', error);
    return [];
  }

  // DEBUG: Log the raw data returned
  console.log("Raw Supabase Data:", data);

  return (data as DBDoctor[]).map(mapDoctorData);
};

export const fetchDoctorById = async (id: string): Promise<UIDoctor | null> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching doctor:', error);
    return null;
  }
  return mapDoctorData(data as DBDoctor);
};