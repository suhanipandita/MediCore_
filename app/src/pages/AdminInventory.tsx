import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle, ShoppingBag } from 'react-feather';
import styles from './dashboard.module.css'; // Common card styles
import invStyles from './AdminInventory.module.css'; // Specific styles
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addItem } from '../store/slices/inventorySlice';

const AdminInventory: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    // Get real inventory items from Redux
    const { items } = useAppSelector(state => state.inventory);

    // Form State
    const [newItem, setNewItem] = useState({ 
        name: '', category: '', quantity: '', supplier: '', threshold: '' 
    });

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newItem.name) return; 

        const item = {
            id: `INV${Date.now()}`,
            name: newItem.name,
            category: newItem.category || 'General',
            unit: 'Box',
            totalStock: parseInt(newItem.quantity) || 0,
            availableStock: parseInt(newItem.quantity) || 0,
            usedToday: 0,
            threshold: parseInt(newItem.threshold) || 50,
            supplier: newItem.supplier || 'Unknown',
            expiryDate: 'N/A',
            batchNo: 'N/A'
        };
        dispatch(addItem(item));
        setNewItem({ name: '', category: '', quantity: '', supplier: '', threshold: '' });
        alert("Item Added Successfully!");
    };

    // Helper for progress bar color
    const getProgressColor = (available: number, total: number, threshold: number) => {
        if (available < threshold) return invStyles.fillRed;
        if (available < total / 2) return invStyles.fillYellow;
        return invStyles.fillGreen;
    };

    return (
        <div className={invStyles.invGrid}>
            {/* LEFT COLUMN */}
            <div className={invStyles.leftCol}>
                
                {/* 1. Inventory Management Stats */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Inventory Management <span style={{fontWeight:400, fontSize:'12px'}}>(Last updated: 08 Sep, 13:04)</span></h2>
                        <a href="#">View all &gt;</a>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px'}}>
                        <StatBox icon={<FileText size={20}/>} label="Total Items" value={items.length.toString()} />
                        <StatBox icon={<CheckCircle size={20}/>} label="Used Today" value={items.reduce((a,b)=>a+b.usedToday,0).toString()} />
                        <StatBox icon={<AlertCircle size={20}/>} label="Low Stock" value={items.filter(i=>i.availableStock < i.threshold).length.toString()} color="#D94C4C" bg="#FDECEA"/>
                    </div>
                </div>

                {/* 2. Inventory Available List */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Inventory Available</h2>
                        <a href="#">+ Add</a>
                    </div>
                    
                    <div className={invStyles.inventoryListGrid}>
                        {items.map(item => {
                            const percent = Math.round((item.availableStock / item.totalStock) * 100) || 0;
                            return (
                                <div key={item.id} className={invStyles.itemCard} onClick={() => navigate(`/inventory/${item.id}`)}>
                                    <div className={invStyles.itemHeader}>
                                        <span className={invStyles.itemName}>{item.name}</span>
                                        <span className={invStyles.itemUnits}>{item.availableStock} Units</span>
                                    </div>
                                    
                                    <div className={invStyles.progressContainer}>
                                        <div className={invStyles.progressBar}>
                                            <div 
                                                className={`${invStyles.progressFill} ${getProgressColor(item.availableStock, item.totalStock, item.threshold)}`} 
                                                style={{width: `${percent}%`}}
                                            ></div>
                                        </div>
                                        <span className={invStyles.percentText}>{percent}%</span>
                                    </div>

                                    <div className={invStyles.itemMeta}>
                                        <span>Threshold: {item.supplier}</span>
                                        <span>Avg Daily Usage: 40 Units</span>
                                    </div>

                                    <div className={invStyles.bagIcon}><ShoppingBag size={14}/></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Stock Management Form */}
            <div className={styles.card} style={{height:'fit-content'}}>
                <div className={styles.cardHeader}><h2>Stock Management</h2></div>
                
                <form className={invStyles.stockForm} onSubmit={handleAddItem}>
                    <div>
                        <label className={invStyles.formLabel}>Item Name</label>
                        <input className={invStyles.formInput} placeholder="Search" value={newItem.name} onChange={e=>setNewItem({...newItem, name:e.target.value})} />
                    </div>
                    <div>
                        <label className={invStyles.formLabel}>Category</label>
                        <select className={invStyles.formSelect} value={newItem.category} onChange={e=>setNewItem({...newItem, category:e.target.value})}>
                            <option value="">Select Category</option>
                            <option value="Medicine">Medicine</option>
                            <option value="PPE">PPE</option>
                            <option value="Equipment">Equipment</option>
                        </select>
                    </div>
                    <div>
                        <label className={invStyles.formLabel}>Total Quantity</label>
                        <input type="number" className={invStyles.formInput} value={newItem.quantity} onChange={e=>setNewItem({...newItem, quantity:e.target.value})} />
                    </div>
                    <div>
                        <label className={invStyles.formLabel}>Supplier</label>
                        <select className={invStyles.formSelect} value={newItem.supplier} onChange={e=>setNewItem({...newItem, supplier:e.target.value})}>
                            <option value="">Select Supplier</option>
                            <option value="Medix Distributors">Medix Distributors</option>
                            <option value="SafeHands Co">SafeHands Co</option>
                        </select>
                    </div>
                    <div>
                        <label className={invStyles.formLabel}>Threshold</label>
                        <select className={invStyles.formSelect} value={newItem.threshold} onChange={e=>setNewItem({...newItem, threshold:e.target.value})}>
                            <option value="50">Warehouse (50)</option>
                            <option value="100">Store (100)</option>
                        </select>
                    </div>

                    <div className={invStyles.actionButtons}>
                        <button type="button" className={invStyles.btnOutline}>Update Stock</button>
                        <button type="submit" className={invStyles.btnPrimary}>Add Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StatBox = ({icon, label, value, color, bg}: any) => (
    <div style={{
        background: '#fff', border: '1px solid #f0f0f0', padding: '16px', borderRadius: '12px', 
        display: 'flex', alignItems: 'center', gap: '12px'
    }}>
        <div style={{
            width: '44px', height: '44px', background: bg || '#E3F9F7', color: color || '#2A7B72', 
            borderRadius: '10px', display: 'grid', placeItems: 'center'
        }}>
            {icon}
        </div>
        <div>
            <div style={{fontSize: '12px', color: '#888'}}>{label}</div>
            <div style={{fontSize: '20px', fontWeight: '700', color: '#333'}}>{value}</div>
        </div>
    </div>
);

export default AdminInventory;