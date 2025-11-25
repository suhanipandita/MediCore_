import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, Upload, Plus, FileText, Calendar, ChevronLeft } from 'react-feather';
import styles from './dashboard.module.css'; // General styles (card, table)
import profileStyles from './PatientProfile.module.css'; // Specific profile layout styles

// --- Mock Data Structures ---
interface PatientDetails {
    id: string;
    name: string;
    age: number;
    gender: string;
    mrn: string;
    mobile: string;
    email: string;
    status: 'Active' | 'Inactive';
    avatarUrl?: string;
}

interface Appointment {
    date: string;
    time: string;
    type: string;
    status: 'Completed' | 'Upcoming';
}

interface Report {
    type: string;
    date: string;
    action: 'Download' | 'View' | 'Delete';
}

// Mock Data
const MOCK_PATIENT_DATA: { [key: string]: PatientDetails } = {
    'P001': {
        id: 'P001', name: "Kate Prokopchuk", age: 45, gender: "Female",
        mrn: "00234-23451", mobile: "+90390341544", email: "katepro@gmail.com",
        status: 'Active', avatarUrl: 'https://placehold.co/100x100/90c7c0/ffffff?text=KP',
    },
    'P002': {
        id: 'P002', name: "Arbaz Khan", age: 32, gender: "Male",
        mrn: "00234-23452", mobile: "+90390341545", email: "arbaz@gmail.com",
        status: 'Active', avatarUrl: 'https://placehold.co/100x100/90c7c0/ffffff?text=AK',
    },
};

const MOCK_APPOINTMENTS: Appointment[] = [
    { date: "05 Nov", time: "4.00 pm", type: "Muscle pain", status: "Completed" },
    { date: "05 Nov", time: "4.00 pm", type: "Muscle pain", status: "Completed" },
    { date: "05 Nov", time: "4.00 pm", type: "Muscle pain", status: "Completed" },
    { date: "05 Nov", time: "4.00 pm", type: "Muscle pain", status: "Completed" },
    { date: "05 Nov", time: "4.00 pm", type: "Muscle pain", status: "Completed" },
    { date: "05 Nov", time: "4.00 pm", type: "Muscle pain", status: "Completed" },
];

const MOCK_REPORTS: Report[] = [
    { type: "Blood report", date: "12 March 2022", action: "Download" },
    { type: "Checkup", date: "12 March 2022", action: "Download" },
    { type: "VIP Test", date: "12 March 2022", action: "Download" },
    { type: "Muscle Pain", date: "12 March 2022", action: "Download" },
    { type: "BP Checkup", date: "12 March 2022", action: "Download" },
    { type: "Blood report", date: "12 March 2022", action: "Download" },
];

// --- Helper Components ---

const UserAvatar = ({ src }: { src: string }) => (
    <div className={profileStyles.avatar} style={{ backgroundImage: `url(${src})` }}></div>
);

const ReportIcon = () => (
    <div className={profileStyles.reportIcon} style={{backgroundColor: '#E3F9F7', color: '#2D706E', borderRadius: '8px'}}>
        <FileText size={18} />
    </div>
);

const getStatusPillClass = (status: Appointment['status']) => {
    switch (status) {
        case 'Completed': return profileStyles.completed;
        case 'Upcoming': return profileStyles.upcoming;
        default: return '';
    }
};

const PatientProfile: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    
    // In a real app, you would fetch data based on patientId
    const patient = MOCK_PATIENT_DATA[patientId || 'P001'];
    
    if (!patient) {
        return <div className={styles.pageContent}>Patient not found for ID: {patientId}.</div>;
    }
    
    // --- Sub-Components ---

    const ProfileCard: React.FC<{ details: PatientDetails }> = ({ details }) => (
        <div className={`${styles.card} ${profileStyles.profileCard}`}>
            <h2>Profile</h2>
            <div className={profileStyles.profileContent}>
                <UserAvatar src={details.avatarUrl || 'https://placehold.co/100x100/90c7c0/ffffff?text=KP'} />
                <div className={profileStyles.profileDetails}>
                    <div className={profileStyles.detailRow}>
                        <span>Name</span>
                        <strong>{details.name}</strong>
                    </div>
                    <div className={profileStyles.detailRow}>
                        <span>Age</span>
                        {/* Displaying age and gender, matching the image format (45y) Female */}
                        <strong>({details.age}y) {details.gender}</strong>
                    </div>
                     <div className={profileStyles.detailRow}>
                        <span>MRN</span>
                        <strong>{details.mrn}</strong>
                    </div>
                    <div className={profileStyles.detailRow}>
                        <span>Mobile Number</span>
                        <strong>{details.mobile}</strong>
                    </div>
                    <div className={profileStyles.detailRow}>
                        <span>Email</span>
                        <strong>{details.email}</strong>
                    </div>
                    <div className={profileStyles.detailRow}>
                        <span>Member Status</span>
                        <strong className={profileStyles.activeStatus}>{details.status}</strong>
                    </div>
                </div>
            </div>
        </div>
    );

    const AppointmentsCard: React.FC = () => (
        <div className={`${styles.card} ${profileStyles.appointmentsCard}`}>
            <div className={styles.cardHeader} style={{ marginBottom: '16px' }}>
                <h2>This Year Appointments</h2>
                <a href="#">View all &gt;</a>
            </div>
            
            <table className={`${styles.table} ${profileStyles.smallTable}`}>
                <thead>
                    <tr>
                        <th className={profileStyles.narrowCol}>Date & Time</th>
                        <th>Treatment Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_APPOINTMENTS.map((app, index) => (
                        <tr key={index} className={profileStyles.highlightRow}>
                            <td>{app.date}/{app.time}</td>
                            <td>{app.type}</td>
                            <td>
                                <span className={`${profileStyles.statusDot} ${getStatusPillClass(app.status)}`}>
                                    ● {app.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const PrescriptionCard: React.FC = () => (
        <div className={`${styles.card} ${profileStyles.prescriptionCard}`}>
            <h2>Prescription</h2>
            <textarea
                className={profileStyles.prescriptionInput}
                placeholder="Type..."
            />
            <button className={profileStyles.prescriptionButton}>
                <Upload size={18} /> Upload Prescription
            </button>
        </div>
    );

    const ReportCard: React.FC = () => (
        <div className={`${styles.card} ${profileStyles.reportCard}`}>
            <div className={styles.cardHeader} style={{ marginBottom: '16px' }}>
                <h2>Report</h2>
                <button className={profileStyles.addReportButton}>
                     <Plus size={18} /> Add Reports
                </button>
            </div>
            <table className={`${styles.table} ${profileStyles.smallTable}`}>
                <thead>
                    <tr>
                        <th>Treatment Type</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_REPORTS.map((report, index) => (
                        <tr key={index}>
                            <td>
                                <div className={styles.tableCellFlex}>
                                    <ReportIcon />
                                    <span>{report.type}</span>
                                </div>
                            </td>
                            <td>{report.date}</td>
                            <td>
                                <button className={profileStyles.reportActionButton}>
                                    <Download size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className={profileStyles.pageContainer}>
            {/* Back Button and Title */}
             <div className={profileStyles.backButtonContainer}>
                <button onClick={() => navigate(-1)} className={profileStyles.backButton}>
                    <ChevronLeft size={20} /> Back to Patient List
                </button>
            </div>
            <h1 className={profileStyles.pageTitle}>Patient Profile: {patient.name}</h1>
            
            {/* Main Content Grid */}
            <div className={profileStyles.mainGrid}>
                {/* Left Column */}
                <div className={profileStyles.leftColumn}>
                    <ProfileCard details={patient} />
                    <AppointmentsCard />
                </div>

                {/* Right Column */}
                <div className={profileStyles.rightColumn}>
                    <PrescriptionCard />
                    <ReportCard />
                </div>
            </div>
        </div>
    );
}

export default PatientProfile;