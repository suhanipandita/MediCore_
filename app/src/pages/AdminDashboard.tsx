import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Package, Zap, File, CreditCard } from 'react-feather';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import styles from './dashboard.module.css';
import adminStyles from './AdminDashboard.module.css';

const visitData = [
    { day: 'Mon', val: 15 }, { day: 'Tue', val: 30 }, { day: 'Wed', val: 20 },
    { day: 'Thu', val: 27 }, { day: 'Fri', val: 45 }, { day: 'Sat', val: 35 }, { day: 'Sun', val: 40 }
];

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={adminStyles.dashboardGrid}>
            <div className={adminStyles.mainSection}>
                {/* Analytics */}
                <div className={`${styles.card}`}>
                    <div className={styles.cardHeader}><h2>Analytics</h2> <a href="#">View all &gt;</a></div>
                    <div className={adminStyles.analyticsRow}>
                        <div className={adminStyles.statCard}>
                            <div className={adminStyles.iconBox}><FileText size={20}/></div>
                            <div className={adminStyles.statInfo}><h3>Doctors</h3><p>2,212</p></div>
                        </div>
                        <div className={adminStyles.statCard}>
                            <div className={adminStyles.iconBox}><Users size={20}/></div>
                            <div className={adminStyles.statInfo}><h3>Patients</h3><p>41,232</p></div>
                        </div>
                        <div className={adminStyles.statCard}>
                            <div className={adminStyles.iconBox}><Package size={20}/></div>
                            <div className={adminStyles.statInfo}><h3>Inventory</h3><p>71,212</p></div>
                        </div>
                    </div>
                </div>

                <div className={adminStyles.middleRow}>
                    {/* Inventory Usage - Click to Open Inventory Page */}
                    <div className={adminStyles.usageCard} onClick={() => navigate('/inventory')}>
                        <div className={styles.cardHeader}><h2>Inventory Usage</h2> <a href="#">&gt;</a></div>
                        <div className={adminStyles.progressBarContainer}>
                            <div>
                                <div className={adminStyles.progressLabel}><span>Expiring Soon</span> <span>20%</span></div>
                                <div className={adminStyles.progressTrack}><div className={adminStyles.progressFill} style={{width:'20%', background:'#2A7B72'}}></div></div>
                            </div>
                            <div>
                                <div className={adminStyles.progressLabel}><span>Moderate Usage</span> <span>40%</span></div>
                                <div className={adminStyles.progressTrack}><div className={adminStyles.progressFill} style={{width:'40%', background:'#A0CFC8'}}></div></div>
                            </div>
                            <div>
                                <div className={adminStyles.progressLabel}><span>High Demand</span> <span>40%</span></div>
                                <div className={adminStyles.progressTrack}><div className={adminStyles.progressFill} style={{width:'40%', background:'#1B3B38'}}></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Patient Visits Chart */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div><h2>Patient Visits</h2><span style={{fontSize:'20px', fontWeight:700}}>21,322 Visits</span></div>
                            <a href="#">View all &gt;</a>
                        </div>
                        <div style={{height: '150px', width: '100%'}}>
                            <ResponsiveContainer>
                                <BarChart data={visitData}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                    <Bar dataKey="val" radius={[4,4,4,4]}>
                                        {visitData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.day === 'Fri' ? '#1B3B38' : '#E3F9F7'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Quick Access */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}><h2>Quick Access</h2> <a href="#">View all &gt;</a></div>
                    <div className={adminStyles.quickAccessRow}>
                        <div className={adminStyles.quickCard}><div className={adminStyles.iconBox}><Zap size={20}/></div><div><h4>Requests</h4><span>213 Available</span></div></div>
                        <div className={adminStyles.quickCard}><div className={adminStyles.iconBox} style={{background:'#F5F5F5', color:'#666'}}><File size={20}/></div><div><h4>Records</h4><span>24K Available</span></div></div>
                        <div className={adminStyles.quickCard}><div className={adminStyles.iconBox} style={{background:'#F5F5F5', color:'#666'}}><CreditCard size={20}/></div><div><h4>Invoice</h4><span>20K Available</span></div></div>
                    </div>
                </div>
            </div>

            {/* Reminder Sidebar */}
            <div className={styles.card}>
                <div className={styles.cardHeader}><h2>Reminder</h2><a href="#">View all &gt;</a></div>
                <ul className={styles.reminderList}>
                    {[1,2,3,4,5].map(i => (
                        <li key={i}>
                            <div className={styles.reminderIcon}><FileText size={16}/></div>
                            <div className={styles.reminderContent}><p>You have an appointment with Dr. Arjun tomorrow.</p><span>07:42</span></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;