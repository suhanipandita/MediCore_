import React, { useState, useMemo } from 'react';
import { FileText, CheckCircle, AlertCircle, MoreVertical, Search } from 'react-feather';
import styles from './Inventory.module.css';

// --- Types ---
interface InventoryItem {
    id: number;
    name: string;
    category: string;
    unit: string;
    totalStock: number;
    availableStock: number;
    usedToday: number;
    status: 'Available' | 'Low Stock';
    lastUpdated: string;
}

// --- Mock Data ---
const MOCK_INVENTORY: InventoryItem[] = [
    { id: 1, name: "Gloves (Sterile)", category: "Muscle pain", unit: "Box", totalStock: 125, availableStock: 162, usedToday: 55, status: "Low Stock", lastUpdated: "08 Sep 2025 - 10:25 AM" },
    { id: 2, name: "Surgical Mask", category: "PPE", unit: "Packets", totalStock: 500, availableStock: 450, usedToday: 50, status: "Available", lastUpdated: "08 Sep 2025 - 09:00 AM" },
    { id: 3, name: "Syringes (5ml)", category: "Injections", unit: "Box", totalStock: 300, availableStock: 280, usedToday: 20, status: "Available", lastUpdated: "07 Sep 2025 - 04:00 PM" },
    { id: 4, name: "Paracetamol", category: "Medicine", unit: "Strip", totalStock: 1000, availableStock: 800, usedToday: 200, status: "Available", lastUpdated: "08 Sep 2025 - 11:00 AM" },
    { id: 5, name: "Bandages", category: "Wound Care", unit: "Rolls", totalStock: 150, availableStock: 120, usedToday: 30, status: "Available", lastUpdated: "06 Sep 2025 - 02:00 PM" },
    { id: 6, name: "Sanitizer (500ml)", category: "PPE", unit: "Bottles", totalStock: 200, availableStock: 180, usedToday: 20, status: "Available", lastUpdated: "08 Sep 2025 - 08:30 AM" },
];

const Inventory: React.FC = () => {
    // --- State ---
    // 1. Selection State (Top Card View)
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    
    // 2. Form/Filter State
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('All');
    const [date, setDate] = useState('');
    const [note, setNote] = useState('');
    const [quantity, setQuantity] = useState('200');

    // --- Filtering Logic (useMemo prevents loops) ---
    const filteredInventory = useMemo(() => {
        return MOCK_INVENTORY.filter(item => {
            // Filter by Name
            const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
            // Filter by Category
            const catMatch = searchCategory === 'All' || item.category === searchCategory;
            
            return nameMatch && catMatch;
        });
    }, [searchName, searchCategory]);

    // --- Handlers ---
    const handleLogUsage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) {
            alert("Please select an item from the table first.");
            return;
        }
        alert(`Successfully logged ${quantity} units of ${selectedItem.name} used on ${date || 'today'}.`);
        
        // Reset Form
        setNote('');
        setQuantity('200');
        // Optional: Clear selection
        // setSelectedItem(null);
    };

    // Get Unique Categories for Dropdown
    const categories = ['All', ...Array.from(new Set(MOCK_INVENTORY.map(i => i.category)))];

    return (
        <div className={styles.pageContainer}>
            
            {/* --- Left Column: Summary/Details + Table --- */}
            <div className={styles.leftColumn}>
                
                {/* DYNAMIC TOP SECTION */}
                <div className={styles.card}>
                    {selectedItem ? (
                        // --- VIEW 2: Single Item Detail ---
                        <div>
                            <div className={styles.itemDetailHeader}>
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <div className={styles.itemTitle}>{selectedItem.name}</div>
                                    <button 
                                        onClick={() => setSelectedItem(null)}
                                        style={{background:'none', border:'none', color:'#2A7B72', cursor:'pointer', fontSize:'14px', fontWeight:600}}
                                    >
                                        Close X
                                    </button>
                                </div>
                                <div className={styles.itemMetaGrid}>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Category</span>
                                        <span className={styles.metaValue}>{selectedItem.category}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Unit</span>
                                        <span className={styles.metaValue}>{selectedItem.unit}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Available Stock</span>
                                        <span className={styles.metaValue}>{selectedItem.lastUpdated}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.itemStatsGrid}>
                                <div className={styles.itemStatCard}>
                                    <span className={styles.itemStatLabel}>Total Stock</span>
                                    <span className={styles.itemStatValue}>{selectedItem.totalStock}</span>
                                </div>
                                <div className={styles.itemStatCard}>
                                    <span className={styles.itemStatLabel}>Available Stock</span>
                                    <span className={styles.itemStatValue}>{selectedItem.availableStock}</span>
                                </div>
                                <div className={styles.itemStatCard}>
                                    <span className={styles.itemStatLabel}>Used Today</span>
                                    <span className={styles.itemStatValue}>{selectedItem.usedToday}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // --- VIEW 1: Global Summary ---
                        <>
                            <div className={styles.cardHeader}>
                                <h2>Inventory Management <span>(Last updated: 08 Sep, 13:04)</span></h2>
                                <a className={styles.viewAllLink}>View all &gt;</a>
                            </div>
                            <div className={styles.summaryGrid}>
                                <div className={styles.summaryItem}>
                                    <div className={styles.summaryIcon}><FileText size={20} /></div>
                                    <div className={styles.summaryText}>
                                        <h3>Total Items</h3>
                                        <p>512,123</p>
                                    </div>
                                </div>
                                <div className={styles.summaryItem}>
                                    <div className={styles.summaryIcon}><CheckCircle size={20} /></div>
                                    <div className={styles.summaryText}>
                                        <h3>Used Today</h3>
                                        <p>51,274</p>
                                    </div>
                                </div>
                                <div className={styles.summaryItem}>
                                    <div className={styles.summaryIcon} style={{color: '#D94C4C', backgroundColor: '#FDECEA'}}><AlertCircle size={20} /></div>
                                    <div className={styles.summaryText}>
                                        <h3>Low Stock</h3>
                                        <p>521</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* INVENTORY TABLE */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Inventory Available</h2>
                        <a className={styles.viewAllLink}>View all &gt;</a>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Unit</th>
                                <th>Available Stock</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.length > 0 ? (
                                filteredInventory.map((item) => (
                                    <tr 
                                        key={item.id} 
                                        className={`${styles.tableRow} ${selectedItem?.id === item.id ? styles.active : ''}`}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.unit}</td>
                                        <td>
                                            {item.status === 'Low Stock' ? (
                                                <span className={styles.statusLow}><span className={styles.dot}></span> {item.availableStock} Units</span>
                                            ) : (
                                                <span className={styles.statusAvailable}><span className={styles.dot}></span> {item.availableStock} Units</span>
                                            )}
                                        </td>
                                        <td><MoreVertical size={16} color="#888"/></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{textAlign:'center', color:'#888', padding:'20px'}}>No items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Right Column: Log Usage Form --- */}
            <div className={styles.card} style={{height: 'fit-content'}}>
                <div className={styles.cardHeader}>
                    <h2>Log Usage</h2>
                </div>
                
                <form className={styles.logForm} onSubmit={handleLogUsage}>
                    {/* Search / Filter Input */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Item Name</label>
                        <div style={{position: 'relative'}}>
                            <input 
                                type="text" 
                                placeholder="Search to filter list..." 
                                className={styles.input} 
                                style={{width: '100%', paddingRight: '32px'}}
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                            <Search size={16} style={{position: 'absolute', right: '10px', top: '12px', color: '#888'}}/>
                        </div>
                    </div>

                    {/* Date Input */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Date & Time</label>
                        <input 
                            type="date" 
                            className={styles.input} 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* Category Dropdown (Filters Table) */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category</label>
                        <select 
                            className={`${styles.input} ${styles.select}`}
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Note Input */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Note</label>
                        <input 
                            type="text" 
                            placeholder="No expired items should be there." 
                            className={styles.input}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {/* Quantity Dropdown */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Quantity Used</label>
                        <select 
                            className={`${styles.input} ${styles.select}`}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        >
                            <option value="200">200</option>
                            <option value="100">100</option>
                            <option value="50">50</option>
                            <option value="10">10</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.logButton}>
                        {selectedItem ? `Log Usage for ${selectedItem.name}` : 'Log Usage'}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default Inventory;