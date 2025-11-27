import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, Plus, MoreVertical, X, FileText, Clock, AlertCircle, CheckCircle, DollarSign, Calendar } from 'react-feather';
import styles from './dashboard.module.css';
import billStyles from './Billing.module.css';
import { useAppSelector } from '../store/hooks';

const Billing: React.FC = () => {
    const navigate = useNavigate();
    const { invoices } = useAppSelector(state => state.billing);

    // --- Filter States ---
    // Status
    const [activeStatus, setActiveStatus] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Amount
    const [activeAmountRange, setActiveAmountRange] = useState<string>('All');
    const [showAmountDropdown, setShowAmountDropdown] = useState(false);

    // Date
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    // --- Filtering Logic ---
    const filteredInvoices = invoices.filter(inv => {
        // 1. Status Filter
        if (activeStatus !== 'All' && inv.status !== activeStatus) return false;

        // 2. Amount Filter
        if (activeAmountRange !== 'All') {
            const amount = inv.total;
            if (activeAmountRange === '0-1000' && (amount < 0 || amount > 1000)) return false;
            if (activeAmountRange === '1000-5000' && (amount <= 1000 || amount > 5000)) return false;
            if (activeAmountRange === '5000-10000' && (amount <= 5000 || amount > 10000)) return false;
            if (activeAmountRange === '10000+' && amount <= 10000) return false;
        }

        // 3. Date Range Filter
        if (startDate || endDate) {
            // Assuming date format "12 Sep 2025" is parseable by Date()
            // Or parsing manually if format is strictly DD MMM YYYY
            const invDate = new Date(inv.date); 
            
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0,0,0,0);
                if (invDate < start) return false;
            }
            
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23,59,59,999);
                if (invDate > end) return false;
            }
        }

        return true;
    });

    const getStatusUI = (status: string) => {
        switch(status) {
            case 'Paid': return <span className={billStyles.statusPaid}><span className={billStyles.dotPaid}></span> Paid</span>;
            case 'Pending': return <span className={billStyles.statusPending}><span className={billStyles.dotPending}></span> Pending</span>;
            case 'Overdue': return <span className={billStyles.statusOverdue}><span className={billStyles.dotOverdue}></span> Overdue</span>;
            default: return null;
        }
    };

    const clearDateFilter = (e: React.MouseEvent) => {
        e.stopPropagation();
        setStartDate('');
        setEndDate('');
        setShowDateDropdown(false);
    };

    return (
        <div className={billStyles.container}>
            
            {/* 1. Billing Overview */}
            <div className={styles.card}>
                <div className={styles.cardHeader}><h2>Billing Overview</h2></div>
                <div className={billStyles.overviewGrid}>
                    <StatCard icon={<FileText size={20}/>} label="Total Invoices" value="285" sub="+12 this week" trend="up" />
                    <StatCard icon={<Clock size={20}/>} label="Pending Invoices" value="40" sub="1.2M pending" trend="neutral" iconClass={billStyles.iconPending} />
                    <StatCard icon={<AlertCircle size={20}/>} label="Overdue Invoices" value="40" sub="1.1M overdue" trend="down" iconClass={billStyles.iconOverdue} />
                    <StatCard icon={<CheckCircle size={20}/>} label="Paid Invoices" value="180" sub="+8% last month" trend="up" />
                </div>
            </div>

            {/* 2. Filters & Actions */}
            <div className={billStyles.filterBar}>
                <div className={billStyles.filterGroup}>
                    <button className={billStyles.filterChip}><Sliders size={14} /> Filters</button>
                    
                    {/* --- Date Range Filter --- */}
                    <div style={{position: 'relative'}}>
                        <button 
                            className={`${billStyles.filterChip} ${(startDate || endDate) ? billStyles.active : ''}`}
                            onClick={() => setShowDateDropdown(!showDateDropdown)}
                        >
                            Date range {(startDate || endDate) && '•'} 
                            {startDate || endDate ? <X size={12} onClick={clearDateFilter} style={{marginLeft:4}}/> : <Calendar size={12} style={{marginLeft:4}}/>}
                        </button>
                        
                        {showDateDropdown && (
                            <div className={billStyles.dropdownMenu} style={{width: '280px', padding: '16px', cursor: 'default'}}>
                                <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                                    <div>
                                        <label style={{fontSize:'12px', color:'#666', display:'block', marginBottom:'4px'}}>From</label>
                                        <input 
                                            type="date" 
                                            style={{width:'100%', padding:'8px', border:'1px solid #eee', borderRadius:'6px', fontSize:'13px'}}
                                            value={startDate} 
                                            onChange={e => setStartDate(e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{fontSize:'12px', color:'#666', display:'block', marginBottom:'4px'}}>To</label>
                                        <input 
                                            type="date" 
                                            style={{width:'100%', padding:'8px', border:'1px solid #eee', borderRadius:'6px', fontSize:'13px'}}
                                            value={endDate} 
                                            onChange={e => setEndDate(e.target.value)} 
                                        />
                                    </div>
                                    <div style={{fontSize:'11px', color:'#888'}}>
                                        *Select same dates for single day search.
                                    </div>
                                    <button 
                                        style={{padding:'8px', background:'#2A7B72', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:600}}
                                        onClick={() => setShowDateDropdown(false)}
                                    >
                                        Apply Filter
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- Amount Filter --- */}
                    <div style={{position: 'relative'}}>
                        <button 
                            className={`${billStyles.filterChip} ${activeAmountRange !== 'All' ? billStyles.active : ''}`}
                            onClick={() => setShowAmountDropdown(!showAmountDropdown)}
                        >
                            Amount {activeAmountRange !== 'All' && `: ${activeAmountRange}`} 
                            {activeAmountRange !== 'All' ? (
                                <X size={12} onClick={(e) => { e.stopPropagation(); setActiveAmountRange('All'); }} style={{marginLeft:4}}/>
                            ) : (
                                <DollarSign size={12} style={{marginLeft:4}}/>
                            )}
                        </button>
                        
                        {showAmountDropdown && (
                            <div className={billStyles.dropdownMenu}>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveAmountRange('All'); setShowAmountDropdown(false); }}>All Amounts</button>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveAmountRange('0-1000'); setShowAmountDropdown(false); }}>0 - 1,000</button>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveAmountRange('1000-5000'); setShowAmountDropdown(false); }}>1,000 - 5,000</button>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveAmountRange('5000-10000'); setShowAmountDropdown(false); }}>5,000 - 10,000</button>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveAmountRange('10000+'); setShowAmountDropdown(false); }}>10,000+</button>
                            </div>
                        )}
                    </div>
                    
                    {/* --- Status Filter --- */}
                    <div style={{position: 'relative'}}>
                        <button 
                            className={`${billStyles.filterChip} ${activeStatus !== 'All' ? billStyles.active : ''}`}
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        >
                            Status {activeStatus !== 'All' && `: ${activeStatus}`} 
                            <X size={12} onClick={(e) => { 
                                if(activeStatus !== 'All') { e.stopPropagation(); setActiveStatus('All'); }
                            }} style={{marginLeft:4}}/>
                        </button>
                        
                        {showStatusDropdown && (
                            <div className={billStyles.dropdownMenu}>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveStatus('All'); setShowStatusDropdown(false); }}>All</button>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveStatus('Paid'); setShowStatusDropdown(false); }}>Paid</button>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveStatus('Pending'); setShowStatusDropdown(false); }}>Pending</button>
                                <button className={billStyles.dropdownItem} onClick={() => { setActiveStatus('Overdue'); setShowStatusDropdown(false); }}>Overdue</button>
                            </div>
                        )}
                    </div>
                </div>

                <button className={billStyles.generateBtn} onClick={() => navigate('/billing/new')}>
                    <Plus size={16}/> Generate Invoice
                </button>
            </div>

            {/* 3. Invoice Table */}
            <div className={styles.card} style={{padding:0, overflow:'hidden'}}>
                <table className={billStyles.invoiceTable}>
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Patient Name</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((inv, index) => (
                                <tr key={index} className={billStyles.tableRow}>
                                    <td>{inv.id}</td>
                                    <td>
                                        <div className={styles.tableCellFlex}>
                                            <div className={styles.avatar}></div> 
                                            {inv.patientName}
                                        </div>
                                    </td>
                                    <td>{inv.date}</td>
                                    <td style={{fontWeight:700}}>₹ {inv.total.toLocaleString()}</td>
                                    <td>{getStatusUI(inv.status)}</td>
                                    <td><MoreVertical size={16} color="#888"/></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{textAlign:'center', padding:'40px', color:'#888'}}>
                                    No invoices match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatCard = ({icon, label, value, sub, trend, iconClass}: any) => (
    <div className={billStyles.statCard}>
        <div className={`${billStyles.iconBox} ${iconClass || ''}`}>{icon}</div>
        <div className={billStyles.statInfo}>
            <h3>{label}</h3>
            <p>
                {value} 
                <span className={`${billStyles.statChange} ${trend === 'up' ? billStyles.trendUp : billStyles.trendDown}`}>
                    {trend === 'up' ? '↗️' : '↘️'} {sub}
                </span>
            </p>
        </div>
    </div>
);

export default Billing;