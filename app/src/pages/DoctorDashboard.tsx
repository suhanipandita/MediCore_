import React from 'react';
import styles from './dashboard.module.css';
import { 
    MoreHorizontal,
    User,
    FileText,
    Calendar,
} from 'react-feather';

// --- Mock Data Structures (Doctor View) ---
interface TodayAppointment {
    id: number;
    patientName: string;
    visitReason: string;
    time: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
}

interface Patient {
    id: number;
    name: string;
    speciality: string; // Used for doctor, reusing for patient data consistency
}

// --- Mock Data ---
const mockTodayAppointments: TodayAppointment[] = [
    { id: 1, patientName: "John Smith", visitReason: "Muscle pain", time: "9:00 AM", status: "Upcoming" },
    { id: 2, patientName: "Jane Doe", visitReason: "Annual Checkup", time: "11:00 AM", status: "Completed" },
];

const mockRecentPatients: Patient[] = [
    { id: 1, name: "Harold Finch", speciality: "P00123" },
    { id: 2, name: "Sameen Shaw", speciality: "P00124" },
    { id: 3, name: "Root Groves", speciality: "P00125" },
];

const mockReminders = [
    { id: 1, type: 'calendar', message: "Review patient records for John Smith.", time: "10:00" },
    { id: 2, type: 'report', message: "Blood test result available for Jane Doe.", time: "14:30" },
];


// --- Placeholder Components ---
const UserAvatar = ({ src }: { src?: string }) => (
    <div className={styles.avatar} style={src ? { backgroundImage: `url(${src})` } : {}}></div>
);
const ReminderIcon = ({ icon }: { icon: 'calendar' | 'report' }) => (
    <div className={styles.reminderIcon}>
        {icon === 'calendar' && <Calendar size={18} />}
        {icon === 'report' && <FileText size={18} />}
    </div>
);

const getStatusPillClass = (status: TodayAppointment['status']) => {
    switch (status) {
        case 'Upcoming': return styles.upcoming;
        case 'Completed': return styles.completed;
        case 'Cancelled': return styles.cancelled;
        default: return '';
    }
};


// --- Doctor Dashboard Component ---
const DoctorDashboard: React.FC = () => {
    return (
        <div className={styles.dashboardGrid}>
            
            {/* --- Main Column (2/3 width) --- */}
            <div className={styles.mainColumn}>
                
                {/* Dashboard Metrics (Appointments Stats) - Mimicking the image's overall style for doctor view */}
                <div className={`${styles.card} ${styles.statsContainer}`}>
                    <div className={styles.cardHeader}>
                        <h2>Appointment Statistics</h2>
                    </div>
                    <div className={styles.statsGrid}>
                        <div className={styles.statBox}>
                            <div className={styles.statIcon}><Calendar size={20} /></div>
                            <div>
                                <span className={styles.statLabel}>Total Appointments</span>
                                <span className={styles.statValue}>40</span>
                            </div>
                        </div>
                        <div className={styles.statBox}>
                            <div className={styles.statIcon}><User size={20} /></div>
                            <div>
                                <span className={styles.statLabel}>Active Patients</span>
                                <span className={styles.statValue}>22</span>
                            </div>
                        </div>
                        <div className={styles.statBox}>
                            <div className={styles.statIcon}><FileText size={20} /></div>
                            <div>
                                <span className={styles.statLabel}>Records Reviewed</span>
                                <span className={styles.statValue}>15</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Appointments List */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Today's Appointments</h2>
                        <a href="/appointments">View all &gt;</a>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Visit Reason</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockTodayAppointments.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div className={styles.tableCellFlex}>
                                            <UserAvatar />
                                            <span>{app.patientName}</span>
                                        </div>
                                    </td>
                                    <td>{app.visitReason}</td>
                                    <td>{app.time}</td>
                                    <td><span className={`${styles.statusPill} ${getStatusPillClass(app.status)}`}>● {app.status}</span></td>
                                    <td><button className={styles.moreButton}><MoreHorizontal size={20} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Right Sidebar Column (1/3 width) --- */}
            <div className={styles.sidebarColumn}>
                
                {/* Reminders (Reusing structure from Patient Dashboard) */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Reminders</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <ul className={styles.reminderList}>
                        {mockReminders.map(r => (
                            <li key={r.id}>
                                <ReminderIcon icon={r.type as 'calendar' | 'report'} />
                                <div className={styles.reminderContent}>
                                    <p>{r.message}</p>
                                    <span>{r.time}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recent Patient Records (Reusing structure from Patient Dashboard) */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Recent Patients</h2>
                        <a href="/patient-list">View all &gt;</a>
                    </div>
                    <ul className={styles.docList}> {/* Reusing docList styling for patient list */}
                        {mockRecentPatients.map(p => (
                             <li key={p.id}>
                                <UserAvatar />
                                <div className={styles.docInfo}>
                                    <h3>{p.name}</h3>
                                    <span>ID: {p.speciality}</span>
                                </div>
                                <button className={styles.bookButton}>View Records</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;