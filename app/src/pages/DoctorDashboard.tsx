import React from 'react';
import { MoreVertical, FileText, Calendar } from 'react-feather';
import styles from './dashboard.module.css'; // Generic styles
import docStyles from './DoctorDashboard.module.css'; // Specific styles

// --- Mock Data ---
const todayAppointments = [
    { id: 1, name: "John smith", reason: "Muscle pain", time: "9:00 AM", status: "Upcoming" },
    { id: 2, name: "John smith", reason: "Muscle pain", time: "9:00 AM", status: "Upcoming" },
    { id: 3, name: "John smith", reason: "Muscle pain", time: "9:00 AM", status: "Upcoming" },
];

const monthlyReport = [
    { label: "Matrix", value: "Value" },
    { label: "Total Patients", value: "320" },
    { label: "Working Hours", value: "140 Hrs." },
    { label: "Shifts", value: "12" },
    { label: "Attendance", value: "20 days" },
    { label: "Leaves", value: "04 days" },
];

const reminders = [
    { id: 1, text: "You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.", time: "07:42" },
    { id: 2, text: "You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.", time: "07:42" },
    { id: 3, text: "You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.", time: "07:42" },
    { id: 4, text: "Blood Test report is out.", time: "07:42" },
    { id: 5, text: "You have an appointment with Dr. Arjun tomorrow at 10:30 AM", time: "07:42" },
    { id: 6, text: "You have an appointment with Dr. Arjun tomorrow at 10:30 AM", time: "07:42" },
    { id: 7, text: "You have an appointment with Dr. Arjun tomorrow at 10:30 AM", time: "07:42" },
    { id: 8, text: "You have an appointment with Dr. Arjun tomorrow at 10:30 AM", time: "07:42" },
];

const UserAvatar = ({ src }: { src?: string }) => (
    <div className={styles.avatar} style={src ? { backgroundImage: `url(${src})` } : {}}></div>
);

const DoctorDashboard: React.FC = () => {
    return (
        <div className={docStyles.doctorGrid}>
            
            {/* --- Main Column --- */}
            <div className={docStyles.mainColumn}>
                
                {/* 1. Today's Appointments */}
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
                            {todayAppointments.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div className={styles.tableCellFlex}>
                                            <UserAvatar />
                                            <span>{app.name}</span>
                                        </div>
                                    </td>
                                    <td>{app.reason}</td>
                                    <td>{app.time}</td>
                                    <td>
                                        <span className={`${docStyles.statusDot} ${docStyles.upcoming}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td><button className={styles.moreButton}><MoreVertical size={18} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 2. Split Row: Monthly Report & Performance */}
                <div className={docStyles.splitRow}>
                    
                    {/* Monthly Report */}
                    <div className={docStyles.reportCard}>
                        <div className={styles.cardHeader}>
                            <h2>Monthly Report</h2>
                            <a href="#">View all &gt;</a>
                        </div>
                        <div className={docStyles.reportContent}>
                            {monthlyReport.map((item, idx) => (
                                <div key={idx} className={docStyles.statRow}>
                                    <span className={docStyles.statLabel}>{item.label}</span>
                                    <span className={docStyles.statValue}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance */}
                    <div className={docStyles.performanceCard}>
                        <div className={styles.cardHeader}>
                            <h2>Performance</h2>
                            <a href="#">View all &gt;</a>
                        </div>
                        <div className={docStyles.performanceContent}>
                            {['Pending Tasks', 'Target Revenue', 'Target Patients', 'Pending Claims'].map((label, idx) => (
                                <div key={idx} className={docStyles.progressGroup}>
                                    <div className={docStyles.progressHeader}>
                                        <span>{label}</span>
                                        <span className={docStyles.progressPercent}>75%</span>
                                    </div>
                                    <div className={docStyles.progressBarBg}>
                                        <div className={docStyles.progressBarFill} style={{width: '75%'}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Right Sidebar: Reminders --- */}
            <div className={docStyles.sidebarColumn}>
                <div className={docStyles.reminderCard}>
                    <div className={styles.cardHeader}>
                        <h2>Reminder</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <ul className={styles.reminderList}>
                        {reminders.map((item, index) => (
                            <li key={index}>
                                <div className={styles.reminderIcon} style={{width:'32px', height:'32px'}}>
                                    {item.text.includes("Blood") ? <FileText size={16} /> : <Calendar size={16} />}
                                </div>
                                <div className={styles.reminderContent}>
                                    <p style={{fontSize: '13px'}}>{item.text}</p>
                                    <span style={{fontSize: '11px'}}>{item.time}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;