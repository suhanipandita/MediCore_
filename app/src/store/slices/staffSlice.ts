import { createSlice,} from '@reduxjs/toolkit';
import type{ PayloadAction } from '@reduxjs/toolkit';

export interface StaffMember {
    id: string;
    name: string;
    role: 'Doctor' | 'Nurse';
    department: string;
    status: 'Active' | 'Inactive';
    email: string;
    phone: string;
    avatarUrl?: string;
    joinDate: string;
}

// Initial Mock Data matching your image
const initialState: { staff: StaffMember[] } = {
    staff: [
        { id: 'DOC-104234', name: 'Sarah Johnson', role: 'Doctor', department: 'Cardiology', status: 'Active', email: 'sarah.j@medicore.com', phone: '+1 555-0101', joinDate: '12 Jan 2022' },
        { id: 'DOC-104235', name: 'Sneha Rathore', role: 'Nurse', department: 'Physiology', status: 'Inactive', email: 'sneha.r@medicore.com', phone: '+1 555-0102', joinDate: '15 Mar 2023' },
        { id: 'DOC-104236', name: 'William Deck', role: 'Nurse', department: 'Ophthalmology', status: 'Active', email: 'will.d@medicore.com', phone: '+1 555-0103', joinDate: '20 Feb 2021' },
        { id: 'NUR-104234', name: 'Ruby Sus', role: 'Doctor', department: 'Ophthalmology', status: 'Active', email: 'ruby.s@medicore.com', phone: '+1 555-0104', joinDate: '10 Dec 2022' },
        { id: 'NUR-104235', name: 'Manva Singh', role: 'Doctor', department: 'Cardiology', status: 'Inactive', email: 'manva.s@medicore.com', phone: '+1 555-0105', joinDate: '05 Jun 2023' },
        { id: 'DOC-104237', name: 'Sasy Monty', role: 'Doctor', department: 'Cardiology', status: 'Active', email: 'sasy.m@medicore.com', phone: '+1 555-0106', joinDate: '01 Aug 2021' },
        { id: 'NUR-104236', name: 'Mark Deckburg', role: 'Nurse', department: 'Physiology', status: 'Inactive', email: 'mark.d@medicore.com', phone: '+1 555-0107', joinDate: '11 Nov 2022' },
        { id: 'NUR-104237', name: 'Sam Manthwell', role: 'Doctor', department: 'Dermatology', status: 'Active', email: 'sam.m@medicore.com', phone: '+1 555-0108', joinDate: '22 Apr 2020' },
        { id: 'DOC-104238', name: 'Jordan', role: 'Nurse', department: 'Physiology', status: 'Active', email: 'jordan@medicore.com', phone: '+1 555-0109', joinDate: '30 Sep 2023' },
        { id: 'NUR-104238', name: 'Jody Noona', role: 'Doctor', department: 'Cardiology', status: 'Active', email: 'jody.n@medicore.com', phone: '+1 555-0110', joinDate: '14 Jul 2022' },
    ]
};

const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        addStaffMember: (state, action: PayloadAction<Omit<StaffMember, 'id' | 'status' | 'joinDate' | 'avatarUrl' | 'email' | 'phone'>>) => {
            const newId = `${action.payload.role === 'Doctor' ? 'DOC' : 'NUR'}-${Math.floor(100000 + Math.random() * 900000)}`;
            const newMember: StaffMember = {
                id: newId,
                ...action.payload,
                status: 'Active',
                joinDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                email: `${action.payload.name.toLowerCase().replace(' ', '.')}@medicore.com`, // Auto-generate dummy email
                phone: '+1 555-0000' // Dummy phone
            };
            state.staff.unshift(newMember); // Add to top of list
        }
    }
});

export const { addStaffMember } = staffSlice.actions;
export default staffSlice.reducer;