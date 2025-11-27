import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Droplet, Heart, Activity, User, Calendar, Clock, Edit2 } from 'react-feather';
import styles from './dashboard.module.css'; 
import profileStyles from './PatientProfile.module.css';
import { useAppSelector } from '../store/hooks';

const PatientProfile: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();
    
    // Retrieve patient data from Redux
    const patient = useAppSelector(state => 
        state.patients.patients.find(p => p.id === patientId)
    );
    
    if (!patient) return <div className={styles.pageContent}>Patient not found.</div>;

    const vitals = patient.vitals || { bp: '--', hr: '--', glucose: '--', spo2: '--', pain: '--', respiratory: '--', temp: '--' };

    return (
        <div className={profileStyles.pageContainer}>
            {/* Top Row: Profile & Appointment Info */}
            <div className={profileStyles.topRow}>
                {/* Profile Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}><h2>Profile</h2></div>
                    <div className={profileStyles.profileCardContent}>
                        <div className={profileStyles.avatarLarge} style={{backgroundImage: patient.avatarUrl ? `url(${patient.avatarUrl})` : undefined}}></div>
                        <div className={profileStyles.profileInfo}>
                            <span className={profileStyles.label}>Name</span> <span className={profileStyles.value}>{patient.name}</span>
                            <span className={profileStyles.label}>Date of birth</span> <span className={profileStyles.value}>{patient.dob}</span>
                            <span className={profileStyles.label}>Gender</span> <span className={profileStyles.value}>{patient.gender}</span>
                            <span className={profileStyles.label}>Diagnosis</span> <span className={profileStyles.value}>{patient.diagnosis}</span>
                        </div>
                    </div>
                </div>

                {/* Appointment Info */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}><h2>Appointment Info</h2> <a href="#">View all &gt;</a></div>
                    <div className={profileStyles.apptGrid}>
                        <div className={profileStyles.miniCard}>
                            <div className={profileStyles.miniIcon}><User size={16}/></div>
                            <span className={profileStyles.miniLabel}>Doctor</span>
                            <span className={profileStyles.miniValue}>{patient.doctor}</span>
                        </div>
                        <div className={profileStyles.miniCard}>
                            <div className={profileStyles.miniIcon}><Calendar size={16}/></div>
                            <span className={profileStyles.miniLabel}>Last Visit</span>
                            <span className={profileStyles.miniValue}>{patient.lastVisit}</span>
                        </div>
                        <div className={profileStyles.miniCard}>
                            <div className={profileStyles.miniIcon}><Clock size={16}/></div>
                            <span className={profileStyles.miniLabel}>Upcoming Visit</span>
                            <span className={profileStyles.miniValue}>{patient.upcomingVisit}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Vital Signs & Nurse Notes */}
            <div className={profileStyles.bottomRow}>
                {/* Vital Signs */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}><h2>Vital Signs</h2> <a href="#">View all &gt;</a></div>
                    <div className={profileStyles.vitalsGrid}>
                        <VitalCard icon={<Droplet size={20}/>} label="Blood Pressure (mmHg)" value={`${vitals.bp} mmHg`} />
                        <VitalCard icon={<Heart size={20}/>} label="Heart Rate (BPM)" value={`${vitals.hr} BPM`} />
                        <VitalCard icon={<Activity size={20}/>} label="Blood Glucose (mm/dL)" value={`${vitals.glucose} mg/dL`} />
                        <VitalCard icon={<Activity size={20}/>} label="Oxygen Saturation (%)" value={`${vitals.spo2}%`} />
                        <VitalCard icon={<Activity size={20}/>} label="Pain Scale (0-10)" value={vitals.pain} />
                        <VitalCard icon={<Activity size={20}/>} label="Respiratory Rate (BPM)" value={`${vitals.respiratory} BPM`} />
                    </div>
                </div>

                {/* Nurse Notes */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}><h2>Nurse Notes</h2> <button style={{border:'none', background:'none', color:'#2A7B72', fontWeight:600}}>+ Add</button></div>
                    <ul className={profileStyles.timeline}>
                        {(patient.notes && patient.notes.length > 0) ? patient.notes.map((note, i) => (
                            <li key={i} className={profileStyles.timelineItem}>
                                <p className={profileStyles.noteText}>{note.text}</p>
                                <span className={profileStyles.noteDate}>{note.date}</span>
                            </li>
                        )) : (
                            <li className={profileStyles.timelineItem}>
                                <p className={profileStyles.noteText}>You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.</p>
                                <span className={profileStyles.noteDate}>12/09/2023</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const VitalCard = ({ icon, label, value }: any) => (
    <div className={profileStyles.vitalCard}>
        <button className={profileStyles.editBtn}>Edit</button>
        <div className={profileStyles.vitalIcon}>{icon}</div>
        <span className={profileStyles.vitalLabel}>{label}</span>
        <span className={profileStyles.vitalValue}>{value}</span>
    </div>
);

export default PatientProfile;