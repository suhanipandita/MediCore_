import React, { useState } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    ResponsiveContainer, 
    Cell,
    Tooltip
} from 'recharts';
import { 
    FileText, 
    Users, 
    Clipboard, 
    Zap, 
    File, 
    CreditCard
} from 'react-feather';

import styles from './dashboard.module.css'; 
import adminStyles from './AdminDashboard.module.css'; 

// --- Mock Data ---
const chartData = [
    { day: 'Mon', visits: 15000 },
    { day: 'Tue', visits: 28000 },
    { day: 'Wed', visits: 20000 },
    { day: 'Thu', visits: 18000 },
    { day: 'Fri', visits: 42000 }, // Highest
    { day: 'Sat', visits: 35000 },
    { day: 'Sun', visits: 45000 },
];

const reminders = [
    { id: 1, text: "You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.", time: "07:42" },
    { id: 2, text: "You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.", time: "07:42" },
    { id: 3, text: "You have an appointment with Dr. Arjun Mehta tomorrow at 10:30 AM.", time: "10:30 AM" },
    { id: 4, text: "Blood Test report is out.", time: "07:42" },
    { id: 5, text: "You have an appointment with Dr. Arjun tomorrow at 10:30 AM", time: "07:42" },
    { id: 6, text: "You have an appointment with Dr. Arjun tomorrow at 10:30 AM", time: "07:42" },
    { id: 7, text: "You have an appointment with Dr. Arjun tomorrow at 10:30 AM", time: "07:42" },
];

// --- Custom Tooltip for Recharts ---
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ 
                backgroundColor: '#2D706E', 
                color: '#fff', 
                padding: '6px 10px', 
                borderRadius: '8px', 
                fontSize: '12px',
                fontWeight: 'bold'
            }}>
                {payload[0].value.toLocaleString()} {/* Use actual value */}
            </div>
        );
    }
    return null;
};

const AdminDashboard: React.FC = () => {
    // State to track hovered bar index
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className={styles.dashboardGrid}>
            
            {/* --- Main Column (Left) --- */}
            <div className={styles.mainColumn}>
                
                {/* 1. Analytics Section */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Analytics</h2>
                        <span className={styles.headerSubtitle}>(Last updated: 08 Sep, 13:04)</span>
                        <a href="#">View all &gt;</a>
                    </div>
                    <div className={adminStyles.analyticsGrid}>
                        <div className={adminStyles.statCard}>
                            <div className={adminStyles.statIconBox}><FileText size={20} /></div>
                            <div className={adminStyles.statInfo}>
                                <h3>Doctors</h3>
                                <p>2,212</p>
                            </div>
                        </div>
                        <div className={adminStyles.statCard}>
                            <div className={adminStyles.statIconBox}><Users size={20} /></div>
                            <div className={adminStyles.statInfo}>
                                <h3>Patients</h3>
                                <p>41,232</p>
                            </div>
                        </div>
                        <div className={adminStyles.statCard}>
                            <div className={adminStyles.statIconBox}><Clipboard size={20} /></div>
                            <div className={adminStyles.statInfo}>
                                <h3>Inventory</h3>
                                <p>71,212</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Middle Row: Inventory & Visits */}
                <div className={adminStyles.middleRow}>
                    
                    {/* Inventory Usage */}
                    <div className={adminStyles.inventoryCard}>
                        <h2 style={{fontSize: '18px', margin: 0}}>Inventory Usage</h2>
                        
                        {/* Visual Progress Bar */}
                        <div className={adminStyles.inventoryProgressBar}>
                            <div className={adminStyles.inventoryProgressFill} style={{width: '35%'}}></div>
                        </div>

                        <div className={adminStyles.inventoryList}>
                            <div className={adminStyles.inventoryItem}>
                                <div><span className={`${adminStyles.dot} ${adminStyles.dotLow}`}></span><span style={{color: '#6c757d'}}>Expiring Soon</span></div>
                                <div className={adminStyles.inventoryLabel}>20% &gt;</div>
                            </div>
                            <div className={adminStyles.inventoryItem}>
                                <div><span className={`${adminStyles.dot} ${adminStyles.dotMed}`}></span><span style={{color: '#6c757d'}}>Moderate Usage</span></div>
                                <div className={adminStyles.inventoryLabel}>40% &gt;</div>
                            </div>
                            <div className={adminStyles.inventoryItem}>
                                <div><span className={`${adminStyles.dot} ${adminStyles.dotHigh}`}></span><span style={{color: '#6c757d'}}>High Demand</span></div>
                                <div className={adminStyles.inventoryLabel}>40% &gt;</div>
                            </div>
                        </div>
                    </div>

                    {/* Patient Visits Chart */}
                    <div className={adminStyles.chartCard}>
                        <div className={adminStyles.chartHeader}>
                            <div>
                                <h2 style={{fontSize: '18px', margin: 0}}>Patient Visits</h2>
                                <span className={adminStyles.visitCount}>21,322 Visits</span>
                            </div>
                            <a href="#" style={{color: '#2D706E', fontSize: '14px', fontWeight: '600', textDecoration: 'none'}}>View all &gt;</a>
                        </div>
                        
                        <div className={adminStyles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barSize={16}>
                                    <XAxis 
                                        dataKey="day" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#888', fontSize: 12}}
                                        dy={10}
                                    />
                                    <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                                    <Bar 
                                        dataKey="visits" 
                                        radius={[10, 10, 10, 10]}
                                        // Update state on hover
                                        onMouseEnter={(_, index) => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell 
                                                cursor="pointer"
                                                key={`cell-${index}`} 
                                                // Fill is green if hovered OR if it's Friday (default highlight)
                                                fill={index === activeIndex || entry.day === '' ? '#2A7B72' : '#F0F8F7'} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. Quick Access */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Quick Access</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <div className={adminStyles.quickAccessGrid}>
                        <div className={adminStyles.quickCard}>
                            <div className={`${adminStyles.quickIcon} ${adminStyles.bgGreen}`}><Zap size={20} /></div>
                            <div className={adminStyles.quickInfo}>
                                <h4>Requests</h4>
                                <span>213 Available</span>
                            </div>
                        </div>
                        <div className={adminStyles.quickCard}>
                            <div className={`${adminStyles.quickIcon} ${adminStyles.bgGray}`}><File size={20} style={{color: '#2A7B72'}} /></div>
                            <div className={adminStyles.quickInfo}>
                                <h4>Records</h4>
                                <span>24K Available</span>
                            </div>
                        </div>
                        <div className={adminStyles.quickCard}>
                            <div className={`${adminStyles.quickIcon} ${adminStyles.bgGray}`}><CreditCard size={20} style={{color: '#2A7B72'}} /></div>
                            <div className={adminStyles.quickInfo}>
                                <h4>Invoice</h4>
                                <span>20K Available</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- Sidebar Column (Right) --- */}
            <div className={styles.sidebarColumn}>
                
                {/* Reminder Section */}
                <div className={`${styles.card} ${adminStyles.reminderSection}`}>
                    <div className={styles.cardHeader}>
                        <h2>Reminder</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <ul className={styles.reminderList}>
                        {reminders.map((item, index) => (
                            <li key={index}>
                                <div className={styles.reminderIcon}>
                                    <FileText size={18} />
                                </div>
                                <div className={styles.reminderContent}>
                                    <p>{item.text}</p>
                                    <span>{item.time}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;