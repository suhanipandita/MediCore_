import React from 'react';
import { MoreHorizontal, X, Check, Calendar } from 'react-feather';
import styles from './dashboard.module.css'; // Reusing general card/table styles
import apptStyles from './Appointments.module.css'; // New styles for layout and specifics

// --- Mock Data Structures & Data ---
interface Appointment {
    id: number;
    patientName: string;
    visitReason: string;
    time: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled';
}

interface Request {
    id: number;
    patientName: string;
    time: string;
    session: string;
    date: string;
    status: 'pending' | 'accepted' | 'rejected';
}

const mockAppointments: Appointment[] = [
    { id: 1, patientName: "John Smith", visitReason: "Muscle pain", time: "9:00 AM", status: "Upcoming" },
    { id: 2, patientName: "John Smith", visitReason: "Muscle pain", time: "9:00 AM", status: "Upcoming" },
    { id: 3, patientName: "John Smith", visitReason: "Muscle pain", time: "9:00 AM", status: "Completed" },
    { id: 4, patientName: "John Smith", visitReason: "Muscle pain", time: "9:00 AM", status: "Completed" },
    { id: 5, patientName: "John Smith", visitReason: "Muscle pain", time: "9:00 AM", status: "Cancelled" },
    { id: 6, patientName: "John Smith", visitReason: "Muscle pain", time: "9:00 AM", status: "Completed" },
];

const mockRequests: Request[] = [
    { id: 101, patientName: "Mickel Howard", time: "10:00 AM", session: "Regular Checkup", date: "12 September", status: "pending" },
    { id: 102, patientName: "Mickel Howard", time: "10:00 AM", session: "Regular Checkup", date: "12 September", status: "pending" },
    { id: 103, patientName: "Mickel Howard", time: "10:00 AM", session: "Regular Checkup", date: "12 September", status: "accepted" },
    { id: 104, patientName: "Mickel Howard", time: "10:00 AM", session: "Regular Checkup", date: "13 September", status: "pending" },
    { id: 105, patientName: "Mickel Howard", time: "10:00 AM", session: "Regular Checkup", date: "13 September", status: "accepted" },
    { id: 106, patientName: "Mickel Howard", time: "10:00 AM", session: "Regular Checkup", date: "13 September", status: "pending" },
];

// --- Reusable Components ---
const UserAvatar = ({ src }: { src?: string }) => (
    <div className={styles.avatar} style={src ? { backgroundImage: `url(${src})` } : {}}></div>
);

const getStatusPillClass = (status: Appointment['status']) => {
    switch (status) {
        case 'Upcoming': return apptStyles.upcoming;
        case 'Completed': return apptStyles.completed;
        case 'Cancelled': return apptStyles.cancelled;
        default: return '';
    }
};

const AppointmentRequestSection: React.FC = () => {
    const groupedRequests = mockRequests.reduce((acc, req) => {
        (acc[req.date] = acc[req.date] || []).push(req);
        return acc;
    }, {} as { [key: string]: Request[] });
    
    // Calculate total requests per date for the heading
    const requestsCount = Object.entries(groupedRequests).map(([date, reqs]) => ({
        date,
        count: reqs.length,
        requests: reqs
    }));

    // Placeholder actions
    const handleAccept = (id: number) => console.log(`Accepted request ${id}`);
    const handleReject = (id: number) => console.log(`Rejected request ${id}`);

    return (
        <div className={`${styles.card} ${apptStyles.requestCard}`}>
            <div className={styles.cardHeader}>
                <h2>Appointment Request</h2>
                <a href="#">View all &gt;</a>
            </div>
            
            <div className={apptStyles.requestList}>
                {requestsCount.map(group => (
                    <div key={group.date} className={apptStyles.requestGroup}>
                        <div className={apptStyles.requestGroupHeader}>
                            <h3 className={apptStyles.requestDate}>{group.date}</h3>
                            <span className={apptStyles.requestCount}>{group.count} Requests</span>
                        </div>
                        
                        {group.requests.map(req => (
                            <div key={req.id} className={apptStyles.requestItem}>
                                <UserAvatar />
                                <div className={apptStyles.requestInfo}>
                                    <h4 className={apptStyles.requestName}>{req.patientName}</h4>
                                    <span className={apptStyles.requestTime}>{req.time} - {req.date.split(' ')[0]} / 1Hr</span>
                                    <span className={apptStyles.requestSession}>Session - {req.session}</span>
                                </div>
                                <div className={apptStyles.requestActions}>
                                    <button 
                                        className={`${apptStyles.requestButton} ${req.status === 'accepted' ? apptStyles.accepted : ''}`} 
                                        onClick={() => handleAccept(req.id)}
                                        disabled={req.status !== 'pending'}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button 
                                        className={`${apptStyles.requestButton} ${req.status === 'rejected' ? apptStyles.rejected : ''}`} 
                                        onClick={() => handleReject(req.id)}
                                        disabled={req.status !== 'pending'}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};


const Appointments: React.FC = () => {
    return (
        <div className={apptStyles.appointmentsGrid}>
            <div className={apptStyles.appointmentsMainColumn}>
                
                {/* Today's Appointments Updates - Top Cards */}
                <div className={`${styles.card} ${apptStyles.statsHeaderCard}`}>
                    <div className={styles.cardHeader} style={{marginBottom: '0'}}>
                        <h2>Today's Appointments Updates</h2>
                        <a href="#">Show All &gt;</a>
                    </div>
                    <div className={apptStyles.statsContainer}>
                        <div className={apptStyles.statCard}>
                            <div className={apptStyles.statIcon}><Calendar size={20} /></div>
                            <div>
                                <span className={apptStyles.statLabel}>Total</span>
                                <span className={apptStyles.statValue}>400</span>
                            </div>
                        </div>
                        <div className={apptStyles.statCard}>
                            <div className={apptStyles.statIcon}><Calendar size={20} /></div>
                            <div>
                                <span className={apptStyles.statLabel}>Pending</span>
                                <span className={apptStyles.statValue}>250</span>
                            </div>
                        </div>
                        <div className={apptStyles.statCard}>
                            <div className={apptStyles.statIcon}><Calendar size={20} /></div>
                            <div>
                                <span className={apptStyles.statLabel}>Completed</span>
                                <span className={apptStyles.statValue}>150</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointment List Table */}
                <div className={`${styles.card} ${apptStyles.appointmentsTableCard}`}>
                    <div className={styles.cardHeader} style={{marginBottom: '16px'}}>
                        <h2>Sunday, 14th September 2025</h2>
                        <Calendar size={20} color="#2A7B72" />
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
                            {mockAppointments.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <div className={styles.tableCellFlex}>
                                            <UserAvatar />
                                            <span>{app.patientName}</span>
                                        </div>
                                    </td>
                                    <td>{app.visitReason}</td>
                                    <td>{app.time}</td>
                                    <td><span className={`${apptStyles.statusPill} ${getStatusPillClass(app.status)}`}>● {app.status}</span></td>
                                    <td><button className={styles.moreButton}><MoreHorizontal size={20} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Right Column (Appointment Requests) --- */}
            <AppointmentRequestSection />
        </div>
    );
};

export default Appointments;