import React, { useState } from 'react';
import { Search, Filter, X } from 'react-feather';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './dashboard.module.css';
import listStyles from './PatientList.module.css';

// --- Mock Data ---
const patients = [
    { id: 1, name: "John smith", pid: "P001", gender: "Male", treatment: "Blood Sugar", progress: "Critical" },
    { id: 2, name: "Arbaz", pid: "P002", gender: "Male", treatment: "Blood Glucose", progress: "Examining" },
    { id: 3, name: "Max Black", pid: "P003", gender: "Female", treatment: "Blood Cancer", progress: "Examining" },
    { id: 4, name: "Becky White", pid: "P004", gender: "Female", treatment: "Muscle Pain", progress: "Stable" },
    { id: 5, name: "Mahta Bhayankar", pid: "P005", gender: "Female", treatment: "Shoulder Pain", progress: "Stable" },
    { id: 6, name: "Becky Maxwell", pid: "P006", gender: "Female", treatment: "Blood Sugar", progress: "Critical" },
    { id: 7, name: "Lionel Messi", pid: "P007", gender: "Male", treatment: "Blood Sugar", progress: "Critical" },
    { id: 8, name: "Cid Volt", pid: "P008", gender: "Male", treatment: "Blood Cancer", progress: "Examining" },
    { id: 9, name: "James Well", pid: "P009", gender: "Male", treatment: "Blood Glucose", progress: "Stable" },
    { id: 10, name: "Bow Sudde", pid: "P010", gender: "Male", treatment: "Muscle Pain", progress: "Stable" },
];

const UserAvatar = ({ src }: { src?: string }) => (
    <div className={styles.avatar} style={src ? { backgroundImage: `url(${src})` } : {}}></div>
);

const PatientList: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All"); // State for filters

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Critical': return listStyles.critical;
            case 'Examining': return listStyles.examining;
            case 'Stable': return listStyles.stable;
            default: return '';
        }
    };

    // --- Filtering Logic ---
    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.pid.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "All" || p.progress === activeFilter;
        
        return matchesSearch && matchesFilter;
    });

    // Navigate to profile on click
    const handleRowClick = (patientId: string) => {
        navigate(`/patient-profile/${patientId}`);
    };

    return (
        <div className={listStyles.container}>
            
            <div className={listStyles.listCard}>
                
                {/* Filter Row - Now Interactive */}
                <div className={listStyles.filterRow}>
                    <button 
                        className={`${listStyles.filterButton} ${listStyles.filterMain}`}
                        onClick={() => setActiveFilter("All")}
                    >
                        <Filter size={14} /> Filters
                    </button>
                    
                    {/* Individual Filters */}
                    {['Critical', 'Examining', 'Stable'].map(status => (
                        <button 
                            key={status}
                            className={`${listStyles.filterButton} ${activeFilter === status ? listStyles.active : ''}`}
                            onClick={() => setActiveFilter(activeFilter === status ? "All" : status)}
                        >
                            {status} {activeFilter === status && <X size={14} style={{marginLeft: 4}}/>}
                        </button>
                    ))}
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Patient ID</th>
                            <th>Gender</th>
                            <th>Treatment</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(patient => (
                            <tr 
                                key={patient.id} 
                                className={listStyles.tableRow}
                                onClick={() => handleRowClick(patient.pid)} // Make row clickable
                                style={{ cursor: 'pointer' }} 
                            >
                                <td>
                                    <div className={styles.tableCellFlex}>
                                        <UserAvatar />
                                        <span>{patient.name}</span>
                                    </div>
                                </td>
                                <td>{patient.pid}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.treatment}</td>
                                <td>
                                    <span className={`${listStyles.statusDot} ${getStatusClass(patient.progress)}`}>
                                        {patient.progress}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientList;