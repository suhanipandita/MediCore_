//
import userProfileIcon from '../assets/icons/user-profile.png';

// Define a type for a single time slot
export interface TimeSlot {
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
}

// Define a type for a single day's availability
export interface DayAvailability {
  date: string;
  slots: TimeSlot[]; // This is now an array of TimeSlot objects
}

// Define the type for the mock doctor
export type MockDoctor = {
  id: number;
  name: string;
  gender: string;
  speciality: string;
  rating: number;
  reviews: number;
  experience: number;
  consultationFee: number;
  location: string;
  imageSrc: string;
  availability: DayAvailability[];
};

export const mockDoctors: MockDoctor[] = [
  {
    id: 1,
    name: 'Dr. Alessandro Rossi, MD',
    gender: 'Male' ,
    speciality: 'Cardiology & Electrophysiology',
    rating: 4.6,
    reviews: 198,
    experience: 16,
    consultationFee: 1000,
    location: 'Heart Institute, Brooklyn, NY',
    imageSrc: userProfileIcon,
    availability: [
      {
        date: '10 Sep',
        // Total 8 slots, as requested
        slots: [
          { time: '09:00 AM', period: 'Morning' },
          { time: '09:30 AM', period: 'Morning' },
          { time: '10:00 AM', period: 'Morning' },
          { time: '10:30 AM', period: 'Morning' },
          { time: '11:00 AM', period: 'Morning' },
          { time: '02:00 PM', period: 'Afternoon' },
          { time: '02:30 PM', period: 'Afternoon' },
          { time: '06:00 PM', period: 'Evening' },
        ],
      },
      {
        date: '11 Sep',
        slots: [
          { time: '09:00 AM', period: 'Morning' },
          { time: '10:00 AM', period: 'Morning' },
          { time: '02:30 PM', period: 'Afternoon' },
          { time: '07:00 PM', period: 'Evening' },
          { time: '07:30 PM', period: 'Evening' },
        ],
      },
      { date: '12 Sep', slots: [] }, // 0 appts
      { date: '13 Sep', slots: [] }, // 0 appts
    ],
  },
  {
    id: 2,
    name: 'Dr. Hannah Müller, MD',
    gender: 'Female' ,
    speciality: 'Preventive Cardiology',
    rating: 4.9,
    reviews: 265,
    experience: 20,
    consultationFee: 800,
    location: 'Heart Wellness Clinic, Bronx, NY',
    imageSrc: userProfileIcon,
    availability: [
      {
        date: '10 Sep',
        slots: [{ time: '08:00 PM', period: 'Evening' }],
      },
      {
        date: '11 Sep',
        slots: [
          { time: '09:15 AM', period: 'Morning' },
          { time: '09:45 AM', period: 'Morning' },
        ],
      },
      {
        date: '12 Sep',
        slots: [
          { time: '03:00 PM', period: 'Afternoon' },
          { time: '03:30 PM', period: 'Afternoon' },
        ],
      },
      { date: '13 Sep', slots: [] },
    ],
  },
  {
    id: 3,
    name: 'Dr. Laura Jensen, MD',
    gender: 'Female' ,
    speciality: 'Interventional Cardiology',
    rating: 4.7,
    reviews: 185,
    experience: 14,
    consultationFee: 900,
    location: 'Midtown Clinic, Manhattan, NY',
    imageSrc: userProfileIcon,
    availability: [
      {
        date: '10 Sep',
        slots: [
          { time: '09:00 AM', period: 'Morning' },
          { time: '09:30 AM', period: 'Morning' },
          { time: '10:00 AM', period: 'Morning' },
        ],
      },
      { date: '11 Sep', slots: [] },
      { date: '12 Sep', slots: [] },
      {
        date: '13 Sep',
        slots: [
          { time: '01:00 PM', period: 'Afternoon' },
          { time: '01:30 PM', period: 'Afternoon' },
        ],
      },
    ],
  },
];