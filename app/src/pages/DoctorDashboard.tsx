import React from 'react';
import styles from './DoctorDashboard.module.css';
import { MoreHorizontal, FileText, Calendar } from 'react-feather';

const UserAvatar = ({ src }: { src?: string }) => (
    <div className={styles.avatar} style={src ? { backgroundImage: `url(${src})` } : {}}></div>
);

const ReminderIcon = ({ icon }: { icon: 'calendar' | 'report' }) => (
    <div className={styles.reminderIcon}>
        {icon === 'calendar' && <Calendar size={18} />}
        {icon === 'report' && <FileText size={18} />}
    </div>
);

const DoctorDashboard: React.FC = () => {
    return (
        <div className={styles.dashboardGrid}>

            <div className={styles.mainColumn}>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Today's Appointments</h2>
                        <a href="#">View all &gt;</a>
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
                            <tr>
                                <td>
                                    <div className={styles.tableCellFlex}>
                                        <UserAvatar />
                                        <span>John smith</span>
                                    </div>
                                </td>
                                <td>Muscle pain</td>
                                <td>9:00 AM</td>
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
                                <td>Muscle pain</td>
                                <td>9:00 AM</td>
                                <td><span className={`${styles.statusPill} ${styles.upcoming}`}>● upcoming</span></td>
                                <td><button className={styles.moreButton}><MoreHorizontal size={20} /></button></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={styles.tableCellFlex}>
                                        <UserAvatar />
                                        <span>John smith</span>
                                    </div>
                                </td>
                                <td>Muscle pain</td>
                                <td>9:00 AM</td>
                                <td><span className={`${styles.statusPill} ${styles.upcoming}`}>● upcoming</span></td>
                                <td><button className={styles.moreButton}><MoreHorizontal size={20} /></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.bottomRow}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Monthly Report</h2>
                            <a href="#">View all &gt;</a>
                        </div>
                        <div className={styles.reportGrid}>
                            <div className={styles.reportRow}>
                                <span className={styles.reportLabel}>Total Patients</span>
                                <span className={styles.reportValue}>320</span>
                            </div>
                            <div className={styles.reportRow}>
                                <span className={styles.reportLabel}>Working Hours</span>
                                <span className={styles.reportValue}>140 Hrs.</span>
                            </div>
                            <div className={styles.reportRow}>
                                <span className={styles.reportLabel}>Shifts</span>
                                <span className={styles.reportValue}>12</span>
                            </div>
                            <div className={styles.reportRow}>
                                <span className={styles.reportLabel}>Attendance</span>
                                <span className={styles.reportValue}>20 days</span>
                            </div>
                            <div className={styles.reportRow}>
                                <span className={styles.reportLabel}>Leaves</span>
                                <span className={styles.reportValue}>04 days</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Performance</h2>
                            <a href="#">View all &gt;</a>
                        </div>
                        <div className={styles.performanceGrid}>
                            <div className={styles.performanceItem}>
                                <div className={styles.performanceLabel}>Pending Tasks</div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: '75%' }}></div>
                                </div>
                                <div className={styles.performancePercent}>75%</div>
                            </div>
                            <div className={styles.performanceItem}>
                                <div className={styles.performanceLabel}>Target Revenue</div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: '75%' }}></div>
                                </div>
                                <div className={styles.performancePercent}>75%</div>
                            </div>
                            <div className={styles.performanceItem}>
                                <div className={styles.performanceLabel}>Target Patients</div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: '75%' }}></div>
                                </div>
                                <div className={styles.performancePercent}>75%</div>
                            </div>
                            <div className={styles.performanceItem}>
                                <div className={styles.performanceLabel}>Pending Claims</div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: '75%' }}></div>
                                </div>
                                <div className={styles.performancePercent}>75%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.sidebarColumn}>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Reminder</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <ul className={styles.reminderList}>
                        <li>
                            <ReminderIcon icon="calendar" />
                            <div className={styles.reminderContent}>
                                <p>You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.</p>
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
                        <li>
                            <ReminderIcon icon="calendar" />
                            <div className={styles.reminderContent}>
                                <p>You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.</p>
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
            </div>

        </div>
    );
};

export default DoctorDashboard;
