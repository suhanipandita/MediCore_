import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, Clock, Calendar, FileText, Activity } from 'react-feather';
import styles from './dashboard.module.css';
import profileStyles from './PatientProfile.module.css'; // Reusing layout styles
import { useAppSelector } from '../store/hooks';

const StaffProfile: React.FC = () => {
    const { staffId } = useParams();
    const navigate = useNavigate();
    const member = useAppSelector(state => state.staff.staff.find(s => s.id === staffId));

    if (!member) return <div>Staff member not found</div>;

    return (
        <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
            {/* Header */}
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <button onClick={()=>navigate(-1)} style={{border:'none', background:'none', cursor:'pointer'}}><ChevronLeft size={20}/></button>
                <h1 style={{margin:0, fontSize:'24px'}}>Staff Profile</h1>
            </div>

            <div className={profileStyles.mainGrid}> {/* Reusing existing grid layout */}
                {/* LEFT COLUMN */}
                <div className={profileStyles.leftColumn}>
                    
                    {/* 1. Profile Card */}
                    <div className={`${styles.card} ${profileStyles.profileCard}`}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
                            <h2 style={{margin:0}}>Profile</h2>
                            <button style={{color:'#3A6E6A', background:'none', border:'none', fontWeight:600}}>+ Update Profile</button>
                        </div>
                        <div className={profileStyles.profileContent}>
                            <div className={profileStyles.avatarLarge} style={{backgroundImage: member.avatarUrl ? `url(${member.avatarUrl})` : undefined}}></div>
                            <div className={profileStyles.profileDetails}>
                                <div className={profileStyles.detailRow}><span>Name</span><strong>{member.name}</strong></div>
                                <div className={profileStyles.detailRow}><span>Role Badge</span><strong>{member.role}</strong></div>
                                <div className={profileStyles.detailRow}><span>Department</span><strong>{member.department}</strong></div>
                                <div className={profileStyles.detailRow}><span>Joined</span><strong>{member.joinDate}</strong></div>
                            </div>
                        </div>
                        <div style={{marginTop:'20px', display:'flex', gap:'24px', color:'#666', fontSize:'13px'}}>
                             <div style={{display:'flex', gap:'8px'}}><Mail size={14}/> {member.email}</div>
                             <div style={{display:'flex', gap:'8px'}}><Phone size={14}/> {member.phone}</div>
                        </div>
                    </div>

                    {/* 2. Today's Schedule */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}><h2>Today's Schedule</h2> <a href="#">View all &gt;</a></div>
                        <table className={styles.table} style={{marginTop:'0'}}>
                            <thead>
                                <tr><th>Patients</th><th>Diagnosis</th><th>Date</th><th>Status</th><th></th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><div className={styles.tableCellFlex}><div className={styles.avatar}></div> John Smith</div></td>
                                    <td>Heart Surgery</td>
                                    <td>12 Sep</td>
                                    <td><span style={{color:'#2A7B72', fontWeight:600}}>● Stable</span></td>
                                    <td>...</td>
                                </tr>
                                <tr>
                                    <td><div className={styles.tableCellFlex}><div className={styles.avatar}></div> Sneha Sharma</div></td>
                                    <td>Muscle Pain</td>
                                    <td>13 Sep</td>
                                    <td><span style={{color:'#2A7B72', fontWeight:600}}>● Stable</span></td>
                                    <td>...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className={profileStyles.rightColumn}>
                    
                    {/* 3. Profile Settings */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}><h2>Profile Settings</h2> <a href="#">View all &gt;</a></div>
                        <div style={{display:'flex', gap:'12px'}}>
                            <SettingsBtn icon={<UserIcon/>} label="Account" />
                            <SettingsBtn icon={<Activity/>} label="Activity Logs" />
                            <SettingsBtn icon={<Clock/>} label="History" />
                        </div>
                    </div>

                    {/* 4. Status / Activity Stream */}
                    <div className={styles.card} style={{flex:1}}>
                        <div className={styles.cardHeader}><h2>Status</h2> <a href="#">View all &gt;</a></div>
                        <ul style={{listStyle:'none', padding:0, margin:0}}>
                            {[1,2,3,4].map(i => (
                                <li key={i} style={{display:'flex', gap:'12px', marginBottom:'16px', alignItems:'flex-start'}}>
                                    <div style={{width:'32px', height:'32px', background:'#E3F9F7', color:'#2A7B72', borderRadius:'8px', display:'grid', placeItems:'center', flexShrink:0}}><FileText size={14}/></div>
                                    <div>
                                        <p style={{fontSize:'13px', fontWeight:600, margin:'0 0 4px 0'}}>Added vitals for patient Sneha</p>
                                        <span style={{fontSize:'11px', color:'#888'}}>07:42</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsBtn = ({icon, label}: any) => (
    <div style={{flex:1, background:'#F9F9F9', padding:'16px', borderRadius:'12px', display:'flex', alignItems:'center', gap:'8px', border:'1px solid #EEE', cursor:'pointer'}}>
        <div style={{color:'#2A7B72'}}>{icon}</div>
        <span style={{fontSize:'13px', fontWeight:600}}>{label}</span>
    </div>
);

const UserIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

export default StaffProfile;