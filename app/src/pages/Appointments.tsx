import React, { useState, useRef } from 'react';
import { MoreHorizontal, X, Check, Calendar } from 'react-feather';
import styles from './dashboard.module.css';
import apptStyles from './Appointments.module.css';

// --- Interfaces ---
interface Appointment {
    id: number;
    patientName: string;
    visitReason: string;
    time: string;
    date: string; // Added date field for filtering
    status: 'Upcoming' | 'Completed' | 'Cancelled';
}

interface Request {
    id: number;
    patientName: string;
    time: string;
    session: string;
    date: string; // "YYYY-MM-DD" format for logic
    displayDate: string; // "12 September" format for display
    status: 'pending' | 'accepted' | 'rejected';
}

// --- Mock Data ---
// Note: Dates are set to today's date dynamically for demonstration purposes
const today = new Date().toISOString().split('T')[0];

const INITIAL_APPOINTMENTS: Appointment[] = [
    { id: 1, patientName: "John Smith", visitReason: "Muscle pain", time: "09:00 AM", date: today, status: "Upcoming" },
    { id: 2, patientName: "Sarah Conner", visitReason: "Routine Checkup", time: "10:00 AM", date: today, status: "Upcoming" },
    { id: 3, patientName: "Mike Ross", visitReason: "Flu symptoms", time: "11:00 AM", date: '2025-09-15', status: "Completed" }, // Different date
];

const INITIAL_REQUESTS: Request[] = [
    { id: 101, patientName: "Mickel Howard", time: "10:00 AM", session: "Regular Checkup", date: today, displayDate: "12 September", status: "pending" },
    { id: 102, patientName: "Jane Doe", time: "11:30 AM", session: "Blood Test", date: today, displayDate: "12 September", status: "pending" },
    { id: 103, patientName: "Clark Kent", time: "01:00 PM", session: "Eye Exam", date: '2025-09-13', displayDate: "13 September", status: "pending" },
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

const Appointments: React.FC = () => {
    // --- State ---
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
    const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
    
    const dateInputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---

    // 1. Handle Date Change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    // Trigger hidden date input when Calendar icon is clicked
    const triggerDatePicker = () => {
        if (dateInputRef.current) {
            // This opens the native browser date picker
            dateInputRef.current.showPicker(); 
        }
    };

    // Format date for header display (e.g., "Sunday, 14th September 2025")
    const getFormattedHeaderDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    // 2. Handle Request Actions
    const handleAcceptRequest = (req: Request) => {
        // Remove from requests
        setRequests(prev => prev.filter(r => r.id !== req.id));

        // Add to main appointments list
        const newAppointment: Appointment = {
            id: Date.now(), // unique id
            patientName: req.patientName,
            visitReason: req.session,
            time: req.time,
            date: req.date, // Use the request's date
            status: 'Upcoming'
        };
        setAppointments(prev => [...prev, newAppointment]);
    };

    const handleRejectRequest = (id: number) => {
        // Simply remove from requests list
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    // --- Filtering ---
    
    // Filter appointments based on selected date
    const filteredAppointments = appointments.filter(app => app.date === selectedDate);

    // Calculate stats based on current state
    const totalAppts = appointments.length;
    const pendingAppts = appointments.filter(a => a.status === 'Upcoming').length;
    const completedAppts = appointments.filter(a => a.status === 'Completed').length;

    return (
        <div className={apptStyles.appointmentsGrid}>
            <div className={apptStyles.appointmentsMainColumn}>
                
                {/* Top Stats Cards */}
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
                                <span className={apptStyles.statValue}>{totalAppts}</span>
                            </div>
                        </div>
                        <div className={apptStyles.statCard}>
                            <div className={apptStyles.statIcon}><Calendar size={20} /></div>
                            <div>
                                <span className={apptStyles.statLabel}>Pending</span>
                                <span className={apptStyles.statValue}>{pendingAppts}</span>
                            </div>
                        </div>
                        <div className={apptStyles.statCard}>
                            <div className={apptStyles.statIcon}><Calendar size={20} /></div>
                            <div>
                                <span className={apptStyles.statLabel}>Completed</span>
                                <span className={apptStyles.statValue}>{completedAppts}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Appointment List Table */}
                <div className={`${styles.card} ${apptStyles.appointmentsTableCard}`}>
                    <div className={styles.cardHeader} style={{marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
                        <h2>{getFormattedHeaderDate(selectedDate)}</h2>
                        
                        {/* Interactive Date Picker */}
                        <div className={apptStyles.datePickerWrapper} onClick={triggerDatePicker}>
                            <Calendar size={20} color="#2A7B72" style={{cursor: 'pointer'}} />
                            {/* Hidden input that actually controls the date state */}
                            <input 
                                type="date" 
                                ref={dateInputRef}
                                value={selectedDate} 
                                onChange={handleDateChange} 
                                className={apptStyles.hiddenDateInput}
                            />
                        </div>
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
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(app => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{textAlign: 'center', padding: '20px', color: '#888'}}>
                                        No appointments found for this date.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Right Column (Appointment Requests) --- */}
            <div className={`${styles.card} ${apptStyles.requestCard}`}>
                <div className={styles.cardHeader}>
                    <h2>Appointment Request</h2>
                    <span style={{fontSize: '12px', color: '#6c757d', marginLeft: 'auto'}}>{requests.length} Requests</span>
                </div>
                
                <div className={apptStyles.requestList}>
                    {requests.length > 0 ? (
                        requests.map(req => (
                            <div key={req.id} className={apptStyles.requestItem}>
                                <UserAvatar />
                                <div className={apptStyles.requestInfo}>
                                    <h4 className={apptStyles.requestName}>{req.patientName}</h4>
                                    <span className={apptStyles.requestTime}>{req.time} • {req.displayDate}</span>
                                    <span className={apptStyles.requestSession}>Session - {req.session}</span>
                                </div>
                                <div className={apptStyles.requestActions}>
                                    {/* Accept Button */}
                                    <button 
                                        className={`${apptStyles.requestButton} ${apptStyles.acceptedHover}`} 
                                        onClick={() => handleAcceptRequest(req)}
                                        title="Accept"
                                    >
                                        <Check size={18} />
                                    </button>
                                    {/* Reject Button */}
                                    <button 
                                        className={`${apptStyles.requestButton} ${apptStyles.rejectedHover}`} 
                                        onClick={() => handleRejectRequest(req.id)}
                                        title="Reject"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{textAlign: 'center', padding: '20px', color: '#888', fontSize: '14px'}}>
                            No pending requests.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointments;