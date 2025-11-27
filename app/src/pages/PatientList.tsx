import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders } from 'react-feather';
import styles from './dashboard.module.css'; // Common card styles
import listStyles from './PatientList.module.css';
import { useAppSelector } from '../store/hooks';

const PatientList: React.FC = () => {
    const navigate = useNavigate();
    const { patients } = useAppSelector(state => state.patients);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Critical' | 'Examining' | 'Stable'>('All');

    const filteredPatients = patients.filter(p => {
        return activeFilter === 'All' || p.status === activeFilter;
    });

    const getStatusClass = (status: string) => {
        switch(status) {
            case 'Critical': return listStyles.critical;
            case 'Examining': return listStyles.examining;
            case 'Stable': return listStyles.stable;
            default: return '';
        }
    };

    const getDotClass = (status: string) => {
        switch(status) {
            case 'Critical': return listStyles.dotCritical;
            case 'Examining': return listStyles.dotExamining;
            case 'Stable': return listStyles.dotStable;
            default: return '';
        }
    };

    return (
        <div className={listStyles.container}>
            {/* Filter Section */}
            <div className={listStyles.filterContainer}>
                <button className={listStyles.filterChip}><Sliders size={14}/> Filters</button>
                
                {['Critical', 'Examining', 'Stable'].map((status) => (
                    <button 
                        key={status}
                        className={`${listStyles.filterChip} ${activeFilter === status ? listStyles.active : ''}`}
                        onClick={() => setActiveFilter(activeFilter === status ? 'All' : status as any)}
                    >
                        {status} 
                        {activeFilter === status ? <span className={listStyles.closeIcon}>&times;</span> : null}
                    </button>
                ))}
            </div>

            {/* Patient Table */}
            <div className={styles.card}>
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
                                className={listStyles.rowLink}
                                onClick={() => navigate(`/patient-profile/${patient.id}`)}
                            >
                                <td>
                                    <div className={styles.tableCellFlex}>
                                        <div className={styles.avatar} style={{backgroundImage: patient.avatarUrl ? `url(${patient.avatarUrl})` : undefined}}></div>
                                        <span>{patient.name}</span>
                                    </div>
                                </td>
                                <td>{patient.id}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.treatment}</td>
                                <td>
                                    <div className={`${listStyles.statusCell} ${getStatusClass(patient.status)}`}>
                                        <div className={`${listStyles.dot} ${getDotClass(patient.status)}`}></div>
                                        {patient.status}
                                    </div>
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