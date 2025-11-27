import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sliders, MoreVertical, FileText, Calendar } from 'react-feather';
import styles from './dashboard.module.css'; // Reusing common dashboard card styles
import listStyles from './PatientList.module.css'; // Reusing list styles for consistency
import { useAppSelector } from '../store/hooks';

// Helper types for our combined view
interface MedicalRecord {
    id: string;
    date: string;
    diagnosis: string; // From appointment/diagnosis
    doctor: string;    // From appointment
    type: string;      // e.g., 'Lab Report', 'Prescription', 'Vitals'
    status: 'Available' | 'Pending' | 'Review';
}

// Mock Data for the logged-in patient
const MOCK_RECORDS: MedicalRecord[] = [
    { id: 'REC-001', date: '12 Sep 2025', diagnosis: 'Heart Surgery', doctor: 'Dr. Sarah Johnson', type: 'Surgical Report', status: 'Available' },
    { id: 'REC-002', date: '10 Aug 2025', diagnosis: 'Muscle Pain', doctor: 'Dr. William Deck', type: 'Prescription', status: 'Available' },
    { id: 'REC-003', date: '05 Jul 2025', diagnosis: 'Routine Checkup', doctor: 'Dr. Ruby Sus', type: 'Vitals Check', status: 'Review' },
    { id: 'REC-004', date: '20 Jun 2025', diagnosis: 'Viral Fever', doctor: 'Dr. Mark Deckburg', type: 'Lab Report', status: 'Available' },
    { id: 'REC-005', date: '15 May 2025', diagnosis: 'Skin Allergy', doctor: 'Dr. Sam Manthwell', type: 'Consultation Note', status: 'Pending' },
];

const MedicalRecords: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.auth);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Filter logic
    const filteredRecords = MOCK_RECORDS.filter(record => {
        const matchesSearch = record.diagnosis.toLowerCase().includes(search.toLowerCase()) || 
                              record.doctor.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'All' || record.type === filterType;
        return matchesSearch && matchesType;
    });

    // Reusing status styles from PatientList for consistency
    const getStatusClass = (status: string) => {
        switch(status) {
            case 'Available': return listStyles.stable; // Greenish
            case 'Pending': return listStyles.examining; // Yellowish
            case 'Review': return listStyles.critical; // Reddish
            default: return '';
        }
    };

    const getDotClass = (status: string) => {
        switch(status) {
            case 'Available': return listStyles.dotStable;
            case 'Pending': return listStyles.dotExamining;
            case 'Review': return listStyles.dotCritical;
            default: return '';
        }
    };

    // Simulating navigation to "My Profile" view
    // We reuse the PatientProfile component but pass the current user's ID logic
    const handleRecordClick = () => {
        // For demo purposes, we assume the patient ID is stored in user metadata or is fixed
        // Redirecting to the profile page. In a real app, you might have a specific /my-profile route
        // or reuse /patient-profile/:id with the logged-in user's ID.
        // Let's use a placeholder ID 'P001' (John Smith from your mocks) for demonstration.
        navigate(`/patient-profile/P001`); 
    };

    return (
        <div className={listStyles.container}>
            
            {/* Header & Search */}
            <div className={styles.cardHeader} style={{marginBottom: '24px'}}>
                <div>
                    <h1 style={{fontSize:'24px', fontWeight:700, margin:0}}>My Medical Records</h1>
                    <p style={{color:'#666', fontSize:'14px', marginTop:'4px'}}>History of your treatments and reports</p>
                </div>
                <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search records..." 
                        className={styles.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className={listStyles.filterContainer}>
                <button className={listStyles.filterChip}><Sliders size={14} style={{marginRight:6}}/> Filters</button>
                {['All', 'Prescription', 'Lab Report', 'Vitals Check'].map(type => (
                    <button 
                        key={type}
                        className={`${listStyles.filterChip} ${filterType === type ? listStyles.active : ''}`}
                        onClick={() => setFilterType(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Records Table */}
            <div className={styles.card} style={{padding:0, overflow:'hidden'}}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Diagnosis / Condition</th>
                            <th>Date</th>
                            <th>Doctor</th>
                            <th>Record Type</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record) => (
                                <tr 
                                    key={record.id} 
                                    className={listStyles.rowLink}
                                    onClick={handleRecordClick}
                                >
                                    <td>
                                        <div className={styles.tableCellFlex}>
                                            <div style={{
                                                width:'36px', height:'36px', borderRadius:'8px', 
                                                background:'#E3F9F7', color:'#2A7B72', display:'grid', placeItems:'center'
                                            }}>
                                                <FileText size={18}/>
                                            </div>
                                            <span style={{fontWeight:600}}>{record.diagnosis}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#555'}}>
                                            <Calendar size={14}/> {record.date}
                                        </div>
                                    </td>
                                    <td>{record.doctor}</td>
                                    <td>{record.type}</td>
                                    <td>
                                        <div className={`${listStyles.statusCell} ${getStatusClass(record.status)}`}>
                                            <div className={`${listStyles.dot} ${getDotClass(record.status)}`}></div>
                                            {record.status}
                                        </div>
                                    </td>
                                    <td><MoreVertical size={16} color="#888"/></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{textAlign:'center', padding:'40px', color:'#888'}}>
                                    No medical records found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MedicalRecords;