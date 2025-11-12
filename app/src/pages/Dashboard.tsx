import React from 'react';
import styles from './dashboard.module.css'; // We will create this
import { 
    MoreHorizontal,
    Download,
    FileText,
    Calendar,
    AlertCircle,
    Droplet,
    File,
} from 'react-feather';

// --- Placeholder Components ---
// These are styled to match your design
const UserAvatar = ({ src }: { src?: string }) => (
    <div className={styles.avatar} style={src ? { backgroundImage: `url(${src})` } : {}}></div>
);
const DocAvatar = ({ src }: { src?: string }) => (
    <div className={styles.docAvatar} style={src ? { backgroundImage: `url(${src})` } : {}}></div>
);
// Health Stat Icon
const StatIcon = ({ icon }: { icon: 'bp' | 'bmi' | 'sugar' }) => (
    <div className={styles.statIcon}>
        {icon === 'bp' && <AlertCircle size={20} />}
        {icon === 'bmi' && <FileText size={20} />}
        {icon === 'sugar' && <Droplet size={20} />}
    </div>
);
// Reminder Icon
const ReminderIcon = ({ icon }: { icon: 'calendar' | 'report' }) => (
    <div className={styles.reminderIcon}>
        {icon === 'calendar' && <Calendar size={18} />}
        {icon === 'report' && <FileText size={18} />}
    </div>
);
// Record Icon
const RecordIcon = () => (
    <div className={styles.recordIcon}>
        <File size={20} />
    </div>
);

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
    return (
        <div className={styles.dashboardGrid}>
            
            {/* --- Main Column --- */}
            <div className={styles.mainColumn}>
                
                {/* Upcoming Appointments */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Upcoming Appointments</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Doctor Name</th>
                                <th>Speciality</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className={styles.tableCellFlex}>
                                        <UserAvatar />
                                        <span>John smith</span>
                                    </div>
                                </td>
                                <td>Cardiologist</td>
                                <td>12 Sep</td>
                                <td><span className={`${styles.statusPill} ${styles.upcoming}`}>● Upcoming</span></td>
                                <td><button className={styles.moreButton}><MoreHorizontal size={20} /></button></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={styles.tableCellFlex}>
                                        <UserAvatar />
                                        <span>John smith</span>
                                    </div>
                                </td>
                                <td>Cardiologist</td>
                                <td>12 Sep</td>
                                <td><span className={`${styles.statusPill} ${styles.upcoming}`}>● Upcoming</span></td>
                                <td><button className={styles.moreButton}><MoreHorizontal size={20} /></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Health Stats */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Health Stats</h2>
                        <span className={styles.headerSubtitle}>(Last updated: 08 Sep, 13:04)</span>
                        <a href="#">View all &gt;</a>
                    </div>
                    <div className={styles.statsGrid}>
                        <div className={styles.statBox}>
                            <StatIcon icon="bp" />
                            <div>
                                <span className={styles.statLabel}>BP (mmHg)</span>
                                <span className={styles.statValue}>120/80</span>
                            </div>
                        </div>
                        <div className={styles.statBox}>
                            <StatIcon icon="bmi" />
                            <div>
                                <span className={styles.statLabel}>BMI</span>
                                <span className={styles.statValue}>22.5</span>
                            </div>
                        </div>
                        <div className={styles.statBox}>
                            <StatIcon icon="sugar" />
                            <div>
                                <span className={styles.statLabel}>Sugar (mg/dl)</span>
                                <span className={styles.statValue}>92</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={styles.bottomRow}>
                    {/* Recent Records */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Recent Records</h2>
                            <div className={styles.headerActions}>
                                <a href="#">View all &gt;</a>
                                <a href="#" className={styles.downloadLink}>Download</a>
                            </div>
                        </div>
                        <ul className={styles.recordList}>
                            <li>
                                <RecordIcon />
                                <span>Blood report</span>
                                <button className={styles.recordButton}><Download size={18} /></button>
                            </li>
                            <li>
                                <RecordIcon />
                                <span>Hand X-ray scan</span>
                                <button className={styles.recordButton}><Download size={18} /></button>
                            </li>
                        </ul>
                    </div>

                    {/* Billing History */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Billing History</h2>
                             <div className={styles.headerActions}>
                                <a href="#">View all &gt;</a>
                                <a href="#" className={styles.downloadLink}>View</a>
                            </div>
                        </div>
                         <ul className={styles.recordList}>
                            <li>
                                <RecordIcon />
                                <span>Invoice #1023</span>
                                <button className={styles.recordButton}><MoreHorizontal size={18} /></button>
                            </li>
                            <li>
                                <RecordIcon />
                                <span>Invoice #1024</span>
                                <button className={styles.recordButton}><MoreHorizontal size={18} /></button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* --- Right Sidebar Column --- */}
            <div className={styles.sidebarColumn}>
                
                {/* Reminders */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Reminders</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <ul className={styles.reminderList}>
                        <li>
                            <ReminderIcon icon="calendar" />
                            <div className={styles.reminderContent}>
                                <p>You have an appointment with Dr. Arjun tomorrow at 10:30 AM.</p>
                                <span>07:42</span>
                            </div>
                        </li>
                        <li>
                            <ReminderIcon icon="report" />
                            <div className={styles.reminderContent}>
                                <p>Blood Test report is out.</p>
                                <span>07:42</span>
                            </div>
                        </li>
                        <li>
                            <ReminderIcon icon="calendar" />
                            <div className={styles.reminderContent}>
                                <p>You have an appointment with Dr. Arjun tomorrow at 10:30 AM.</p>
                                <span>07:42</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Book Appointments */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Book Appointments</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <ul className={styles.docList}>
                        <li>
                            <DocAvatar />
                            <div className={styles.docInfo}>
                                <h3>Salazar Slytherin</h3>
                                <span>Cardiologist</span>
                            </div>
                            <button className={styles.bookButton}>Book Now</button>
                        </li>
                         <li>
                            <DocAvatar />
                            <div className={styles.docInfo}>
                                <h3>Godric Gryffindor</h3>
                                <span>Cardiologist</span>
                            </div>
                            <button className={`${styles.bookButton} ${styles.bookIconButton}`}><Calendar size={16}/></button>
                        </li>
                         <li>
                            <DocAvatar />
                            <div className={styles.docInfo}>
                                <h3>Rowena Ravenclaw</h3>
                                <span>Cardiologist</span>
                            </div>
                            <button className={`${styles.bookButton} ${styles.bookIconButton}`}><Calendar size={16}/></button>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;