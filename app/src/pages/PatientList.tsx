import React, { useState } from 'react';
import { MoreHorizontal, Search, Download } from 'react-feather';
import styles from './dashboard.module.css'; // Reusing general table/card styles
import listStyles from './PatientList.module.css'; // New styles for list specifics

// --- Mock Data Structures ---
interface Patient {
    id: number;
    patientId: string;
    fullName: string;
    dob: string;
    lastVisit: string;
    status: 'Active' | 'Discharged' | 'Pending';
}

// --- Mock Data ---
const mockPatientList: Patient[] = [
    { id: 1, patientId: 'P00123', fullName: "John Smith", dob: "1985-05-15", lastVisit: "2025-09-14", status: "Active" },
    { id: 2, patientId: 'P00124', fullName: "Mickel Howard", dob: "2001-11-20", lastVisit: "2025-09-12", status: "Active" },
    { id: 3, patientId: 'P00125', fullName: "Sara Connor", dob: "1972-01-01", lastVisit: "2025-08-01", status: "Discharged" },
    { id: 4, patientId: 'P00126', fullName: "Tony Stark", dob: "1970-05-29", lastVisit: "2025-09-10", status: "Active" },
    { id: 5, patientId: 'P00127', fullName: "Jane Doe", dob: "1995-02-28", lastVisit: "2025-09-05", status: "Pending" },
    { id: 6, patientId: 'P00128', fullName: "Peter Parker", dob: "2000-08-10", lastVisit: "2025-09-20", status: "Active" },
];

// --- Reusable Components ---
const UserAvatar = ({ src }: { src?: string }) => (
    <div className={styles.avatar} style={src ? { backgroundImage: `url(${src})` } : {}}></div>
);

const getStatusPillClass = (status: Patient['status']) => {
    switch (status) {
        case 'Active': return listStyles.active; 
        case 'Discharged': return listStyles.discharged; 
        case 'Pending': return listStyles.pending;
        default: return '';
    }
};

const PatientList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredPatients = mockPatientList.filter(patient => {
        const matchesSearch = patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || patient.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className={listStyles.patientListContainer}>
            <div className={`${styles.card} ${listStyles.fullWidthCard}`}>
                <div className={styles.cardHeader} style={{ flexWrap: 'wrap' }}>
                    <h2>My Assigned Patients</h2>
                    <span className={styles.headerSubtitle} style={{ marginRight: 'auto' }}>({filteredPatients.length} patients listed)</span>
                    
                    <div className={listStyles.filterControls}>
                        {/* Status Filter */}
                        <select 
                            className={listStyles.selectInput}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as Patient['status'] | 'All')}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Discharged">Discharged</option>
                            <option value="Pending">Pending</option>
                        </select>
                        
                        {/* Search Input (Reusing DashboardLayout Search styling) */}
                        <div className={styles.searchWrapper}>
                            <Search size={18} className={styles.searchIcon} />
                            {/* Using the same class names from DashboardLayout.module.css for consistency */}
                            <input 
                                type="text" 
                                placeholder="Search by Name or ID" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput} 
                                style={{ width: '250px', paddingLeft: '44px' }}
                            />
                        </div>

                        <button className={listStyles.exportButton}><Download size={18} /> Export</button>
                    </div>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Patient ID</th>
                            <th>Date of Birth</th>
                            <th>Last Visit</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(patient => (
                            <tr key={patient.id}>
                                <td>
                                    <div className={styles.tableCellFlex}>
                                        <UserAvatar />
                                        <span>{patient.fullName}</span>
                                    </div>
                                </td>
                                <td>{patient.patientId}</td>
                                <td>{patient.dob}</td>
                                <td>{patient.lastVisit}</td>
                                <td><span className={`${styles.statusPill} ${getStatusPillClass(patient.status)}`}>● {patient.status}</span></td>
                                <td><button className={styles.moreButton}><MoreHorizontal size={20} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientList;