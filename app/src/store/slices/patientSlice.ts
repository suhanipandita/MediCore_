import { createSlice } from '@reduxjs/toolkit';
import type{ PayloadAction } from '@reduxjs/toolkit';

export interface VitalsData {
    bp: string;       // Blood Pressure
    hr: string;       // Heart Rate
    glucose: string;  // Blood Glucose
    spo2: string;     // Oxygen Saturation
    pain: string;     // Pain Scale
    respiratory: string; // Respiratory Rate
    temp: string;     // Temperature (kept for dashboard logic)
}

export interface Patient {
    id: string;
    name: string;
    gender: string;
    dob: string; 
    diagnosis: string;
    status: 'Critical' | 'Examining' | 'Stable';
    treatment: string;
    avatarUrl?: string;
    doctor: string;
    lastVisit: string;
    upcomingVisit: string;
    vitals?: VitalsData;
    notes?: { text: string; date: string }[];
    inventoryUsed?: string[];
}

const initialState: { patients: Patient[] } = {
    patients: [
        { 
            id: 'P001', name: 'John Smith', gender: 'Male', dob: '12/05/1980', 
            diagnosis: 'Diabetes Type 2', status: 'Critical', treatment: 'Blood Sugar', 
            doctor: 'Dr. A. Mehta', lastVisit: '12/09/2023', upcomingVisit: '14/09/2023',
            vitals: { bp: '140/90', hr: '98', glucose: '180', spo2: '96', pain: '2', respiratory: '18', temp: '37.5' } 
        },
        { 
            id: 'P002', name: 'Arbaz', gender: 'Male', dob: '20/04/2000', 
            diagnosis: 'Hypertension', status: 'Examining', treatment: 'Blood Glucose', 
            doctor: 'Dr. Subham', lastVisit: '12/09/2023', upcomingVisit: '12/09/2024' 
        },
        { 
            id: 'P003', name: 'Max Black', gender: 'Female', dob: '15/08/1992', 
            diagnosis: 'Anemia', status: 'Examining', treatment: 'Blood Cancer', 
            doctor: 'Dr. Strange', lastVisit: '10/09/2023', upcomingVisit: '15/09/2023' 
        },
        { 
            id: 'P004', name: 'Becky White', gender: 'Female', dob: '01/01/1985', 
            diagnosis: 'Muscle Spasm', status: 'Stable', treatment: 'Muscle Pain', 
            doctor: 'Dr. House', lastVisit: '11/09/2023', upcomingVisit: '20/09/2023' 
        },
        { 
            id: 'P005', name: 'Sarah Johnson', gender: 'Female', dob: '20/04/2000', 
            diagnosis: 'Coronary Artery', status: 'Stable', treatment: 'Shoulder Pain', 
            doctor: 'Subham Gupta', lastVisit: '12/09/2023', upcomingVisit: '12/09/2024',
            avatarUrl: 'https://placehold.co/100x100/2A7B72/ffffff?text=SJ',
            vitals: { bp: '120/80', hr: '72', glucose: '146', spo2: '98', pain: '0', respiratory: '16', temp: '36.8' }
        },
    ]
};

const patientSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        updatePatientVitals: (state, action: PayloadAction<{ id: string; vitals: Partial<VitalsData> }>) => {
            const patient = state.patients.find(p => p.id === action.payload.id);
            if (patient) {
                // Merge existing vitals with updates
                patient.vitals = { 
                    ...(patient.vitals || { bp: '--', hr: '--', glucose: '--', spo2: '--', pain: '--', respiratory: '--', temp: '--' }), 
                    ...action.payload.vitals 
                };
            }
        },
        addPatientNote: (state, action: PayloadAction<{ id: string; note: string }>) => {
            const patient = state.patients.find(p => p.id === action.payload.id);
            if (patient) {
                patient.notes = [
                    { text: action.payload.note, date: new Date().toLocaleDateString('en-GB') }, 
                    ...(patient.notes || [])
                ];
            }
        },
        logInventoryUsage: (state, action: PayloadAction<{ id: string; item: string }>) => {
            const patient = state.patients.find(p => p.id === action.payload.id);
            if (patient) {
                patient.inventoryUsed = [...(patient.inventoryUsed || []), action.payload.item];
            }
        }
    }
});

export const { updatePatientVitals, addPatientNote, logInventoryUsage } = patientSlice.actions;
export default patientSlice.reducer;