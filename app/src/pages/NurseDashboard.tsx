import React, { useState } from 'react';
import { Calendar, FileText, Package, CheckCircle, Activity } from 'react-feather';
import styles from './dashboard.module.css'; // Generic styles
import nurseStyles from './NurseDashboard.module.css'; // Specific styles
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updatePatientVitals, addPatientNote, logInventoryUsage } from '../store/slices/patientSlice';

const NurseDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    // Access global patient state
    const { patients } = useAppSelector(state => state.patients);

    // Workflow State
    const [selectedPatientId, setSelectedPatientId] = useState<string>("");
    const [currentStep, setCurrentStep] = useState<'select' | 'vitals' | 'notes' | 'inventory' | 'done'>('select');

    // Form States - Expanded to match Profile fields
    const [vitals, setVitals] = useState({ 
        bp: '', 
        temp: '', 
        hr: '', 
        spo2: '', 
        glucose: '', 
        pain: '', 
        respiratory: '' 
    });
    const [note, setNote] = useState('');
    const [inventoryItem, setInventoryItem] = useState('');

    // Handle Patient Selection
    const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPatientId(e.target.value);
        if (e.target.value) setCurrentStep('vitals');
    };

    // Handle Vitals Submission
    const handleVitalsSubmit = () => {
        if (selectedPatientId) {
            // Dispatch to Redux: Update vital signs for this patient
            dispatch(updatePatientVitals({
                id: selectedPatientId,
                vitals: { 
                    bp: vitals.bp || '--',
                    temp: vitals.temp || '--',
                    hr: vitals.hr || '--',
                    spo2: vitals.spo2 || '--',
                    glucose: vitals.glucose || '--',
                    pain: vitals.pain || '--',
                    respiratory: vitals.respiratory || '--'
                } 
            }));
            setCurrentStep('notes');
        }
    };

    // Handle Note Submission
    const handleNoteSubmit = () => {
        if (selectedPatientId && note) {
            dispatch(addPatientNote({ id: selectedPatientId, note }));
            setCurrentStep('inventory');
        }
    };

    // Handle Inventory Submission & Reset
    const handleInventorySubmit = () => {
        if (selectedPatientId && inventoryItem) {
            dispatch(logInventoryUsage({ id: selectedPatientId, item: inventoryItem }));
            setCurrentStep('done');
            
            // Reset form after 2 seconds
            setTimeout(() => {
                setCurrentStep('select');
                setSelectedPatientId('');
                setVitals({ bp: '', temp: '', hr: '', spo2: '', glucose: '', pain: '', respiratory: '' });
                setNote('');
                setInventoryItem('');
            }, 2000);
        }
    };

    return (
        <div className={nurseStyles.dashboardGrid}>
            {/* LEFT COLUMN */}
            <div className={nurseStyles.leftCol}>
                
                {/* 1. Today's Progress Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Today's Progress <span style={{fontSize:'12px', fontWeight:400, color:'#888'}}>(Last updated: 12:32 PM)</span></h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <div className={nurseStyles.progressRow}>
                        <div className={nurseStyles.progressCard}>
                            <div className={nurseStyles.iconBox}><Calendar size={20}/></div>
                            <div className={nurseStyles.progressInfo}><span>Appointment</span><h3>6/14</h3></div>
                        </div>
                        <div className={nurseStyles.progressCard}>
                            <div className={nurseStyles.iconBox}><Activity size={20}/></div>
                            <div className={nurseStyles.progressInfo}><span>Vitals added</span><h3>4/6</h3></div>
                        </div>
                        <div className={nurseStyles.progressCard}>
                            <div className={nurseStyles.iconBox}><Package size={20}/></div>
                            <div className={nurseStyles.progressInfo}><span>Inventory log</span><h3>6/6</h3></div>
                        </div>
                    </div>
                </div>

                {/* 2. Today's Appointments (Read Only View) */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Today's Appointments</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr><th>Patient Name</th><th>Visit Reason</th><th>Time</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {patients.slice(0, 2).map(p => (
                                <tr key={p.id}>
                                    <td><div className={styles.tableCellFlex}><div className={styles.avatar}></div>{p.name}</div></td>
                                    <td>{p.diagnosis}</td>
                                    <td>9:00 AM</td>
                                    <td><span className={`${styles.statusPill} ${styles.upcoming}`}>● Upcoming</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Interactive Patient Records (The Sequence) */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Patient Records</h2>
                    </div>
                    
                    {/* Step 0: Select Patient */}
                    <select 
                        className={nurseStyles.selectPatient} 
                        value={selectedPatientId} 
                        onChange={handlePatientSelect}
                        disabled={currentStep !== 'select'}
                    >
                        <option value="">Select a Patient to update record...</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>)}
                    </select>

                    {/* Step 1: Vitals Form (Updated with all fields) */}
                    {currentStep === 'vitals' && (
                        <div className={nurseStyles.recordContainer}>
                            <div className={nurseStyles.recordStepTitle}><Activity size={16}/> Step 1: Enter Vitals</div>
                            <div className={nurseStyles.vitalsGrid}>
                                <input placeholder="BP (e.g. 120/80)" className={nurseStyles.inputField} value={vitals.bp} onChange={e=>setVitals({...vitals, bp:e.target.value})} />
                                <input placeholder="Heart Rate (e.g. 72)" className={nurseStyles.inputField} value={vitals.hr} onChange={e=>setVitals({...vitals, hr:e.target.value})} />
                                <input placeholder="Glucose (e.g. 140)" className={nurseStyles.inputField} value={vitals.glucose} onChange={e=>setVitals({...vitals, glucose:e.target.value})} />
                                <input placeholder="SpO2 (e.g. 98)" className={nurseStyles.inputField} value={vitals.spo2} onChange={e=>setVitals({...vitals, spo2:e.target.value})} />
                                <input placeholder="Pain Level (0-10)" className={nurseStyles.inputField} value={vitals.pain} onChange={e=>setVitals({...vitals, pain:e.target.value})} />
                                <input placeholder="Resp. Rate (e.g. 16)" className={nurseStyles.inputField} value={vitals.respiratory} onChange={e=>setVitals({...vitals, respiratory:e.target.value})} />
                                <input placeholder="Temp (°C)" className={nurseStyles.inputField} value={vitals.temp} onChange={e=>setVitals({...vitals, temp:e.target.value})} />
                            </div>
                            <button className={nurseStyles.actionButton} onClick={handleVitalsSubmit}>Next: Add Notes &gt;</button>
                            <div style={{clear:'both'}}></div>
                        </div>
                    )}

                    {/* Step 2: Notes */}
                    {currentStep === 'notes' && (
                        <div className={nurseStyles.recordContainer}>
                            <div className={nurseStyles.recordStepTitle}><FileText size={16}/> Step 2: Nurse Notes</div>
                            <textarea 
                                placeholder="Add observation or patient feedback..." 
                                className={nurseStyles.inputField} 
                                style={{height: '80px', resize:'none', marginBottom:'12px'}}
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            ></textarea>
                            <button className={nurseStyles.actionButton} onClick={handleNoteSubmit}>Next: Inventory &gt;</button>
                            <div style={{clear:'both'}}></div>
                        </div>
                    )}

                    {/* Step 3: Inventory */}
                    {currentStep === 'inventory' && (
                        <div className={nurseStyles.recordContainer}>
                            <div className={nurseStyles.recordStepTitle}><Package size={16}/> Step 3: Inventory Used</div>
                            <input 
                                placeholder="E.g., Syringes (2), IV Fluids (1)" 
                                className={nurseStyles.inputField} 
                                style={{marginBottom:'12px'}}
                                value={inventoryItem}
                                onChange={e => setInventoryItem(e.target.value)}
                            />
                            <button className={nurseStyles.actionButton} onClick={handleInventorySubmit}>Finish Record</button>
                            <div style={{clear:'both'}}></div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {currentStep === 'done' && (
                        <div className={nurseStyles.recordContainer} style={{textAlign:'center', color:'#2D706E'}}>
                            <CheckCircle size={48} style={{marginBottom:'10px'}}/>
                            <h3>Record Updated Successfully!</h3>
                            <p style={{color:'#666', fontSize:'14px'}}>Redirecting to start...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: Reminders */}
            <div className={nurseStyles.rightCol}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Reminder</h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <ul className={nurseStyles.reminderList}>
                        {[1,2,3,4].map(i => (
                            <li key={i}>
                                <div className={nurseStyles.reminderIcon}><FileText size={16}/></div>
                                <div>
                                    <p style={{fontSize:'13px', fontWeight:600, margin:'0 0 4px 0'}}>You have an appointment with Dr. Arjun Mehta.</p>
                                    <span style={{fontSize:'12px', color:'#888'}}>07:42</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NurseDashboard;