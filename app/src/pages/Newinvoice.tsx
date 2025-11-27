import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Download, Maximize2, Link as LinkIcon } from 'react-feather';
import styles from './NewInvoice.module.css';
import { useAppDispatch } from '../store/hooks';
import { addInvoice} from '../store/slices/billingSlice';
import type{InvoiceItem } from '../store/slices/billingSlice';

const NewInvoice: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // --- Form State ---
    const [invoiceNum] = useState(`INV-${Math.floor(2000 + Math.random() * 1000)}`);
    const [date] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    const [patientName] = useState('John Smith');
    const [patientId] = useState('P012');
    const [email] = useState('jhonsmith@gmail.com');

    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', description: 'OPD Consultation - Dr. Jhon Smith', qty: 1, unitPrice: 800 }
    ]);

    const [hasTax, setHasTax] = useState(false);
    const [hasDiscount, setHasDiscount] = useState(false);
    const [taxRate] = useState(0.04); // 4%
    const [discountVal] = useState(0);

    // --- Calculations ---
    const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0), [items]);
    const taxAmount = hasTax ? subtotal * taxRate : 0;
    const finalTotal = subtotal + taxAmount - discountVal;

    // --- Handlers ---
    const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleAddItem = () => {
        setItems([...items, { id: Date.now().toString(), description: '', qty: 1, unitPrice: 0 }]);
    };

    const handleDeleteItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleSendInvoice = () => {
        dispatch(addInvoice({
            id: invoiceNum,
            patientId,
            patientName,
            email,
            date,
            dueDate: '20 Sep 2025', // Mock
            items,
            subtotal,
            taxPercent: hasTax ? 4 : 0,
            discount: discountVal,
            total: finalTotal,
            status: 'Pending'
        }));
        alert("Invoice Sent Successfully!");
        navigate('/billing');
    };

    return (
        <div className={styles.container}>
            
            {/* LEFT SECTION: Editor */}
            <div className={styles.leftSection}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>New Invoice</h1>
                </div>

                <div className={styles.infoRow}>
                    <div className={styles.infoCard}>
                        <h3 className={styles.cardTitle}>Invoice</h3>
                        <div className={styles.infoLine}><span className={styles.label}>Invoice number</span> <span className={styles.value}>{invoiceNum}</span></div>
                        <div className={styles.infoLine}><span className={styles.label}>Invoice Date</span> <span className={styles.value}>{date}</span></div>
                        <div className={styles.infoLine}><span className={styles.label}>Due Date</span> <span className={styles.value}>20/09/2025</span></div>
                    </div>
                    <div className={styles.infoCard}>
                        <h3 className={styles.cardTitle}>Patient</h3>
                        <div className={styles.infoLine}><span className={styles.label}>Name</span> <span className={styles.value}>{patientName}</span></div>
                        <div className={styles.infoLine}><span className={styles.label}>Patient ID</span> <span className={styles.value}>{patientId}</span></div>
                        <div className={styles.infoLine}><span className={styles.label}>Mail ID</span> <span className={styles.value}>{email}</span></div>
                    </div>
                </div>

                <div className={styles.itemSection}>
                    <h3 className={styles.cardTitle}>Item details</h3>
                    
                    <div className={styles.itemHeader}>
                        <span>Item/ Service</span>
                        <span>Qty</span>
                        <span>Unit Price</span>
                        <span>Total Price</span>
                        <span></span>
                    </div>

                    {items.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                            <input 
                                className={styles.input} 
                                value={item.description} 
                                onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                                placeholder="Description"
                            />
                            <div className={styles.qtyControl}>
                                <button className={styles.qtyBtn} onClick={() => handleUpdateItem(item.id, 'qty', Math.max(1, item.qty - 1))}>-</button>
                                <span className={styles.qtyVal}>{item.qty}</span>
                                <button className={styles.qtyBtn} onClick={() => handleUpdateItem(item.id, 'qty', item.qty + 1)}>+</button>
                            </div>
                            <input 
                                className={styles.input} 
                                type="number"
                                value={item.unitPrice} 
                                onChange={e => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                            />
                            <input 
                                className={styles.input} 
                                value={`₹ ${item.qty * item.unitPrice}`} 
                                readOnly
                                style={{background:'#F9F9F9'}}
                            />
                            <button className={styles.deleteBtn} onClick={() => handleDeleteItem(item.id)}><Trash2 size={16}/></button>
                        </div>
                    ))}

                    <button className={styles.addItemBtn} onClick={handleAddItem}>
                        <Plus size={16}/> Add Item
                    </button>

                    <div className={styles.totalsSection}>
                        <div className={styles.totalRow}>
                            <span className={styles.label}>Subtotal</span>
                            <span className={styles.value}>₹ {subtotal}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span className={styles.label}>Discount</span>
                            <span className={styles.addLink} onClick={() => setHasDiscount(!hasDiscount)}>+ Add</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span className={styles.label}>Tax (4%)</span>
                            {hasTax ? (
                                <span className={styles.value}>₹ {taxAmount.toFixed(2)}</span>
                            ) : (
                                <span className={styles.addLink} onClick={() => setHasTax(true)}>+ Add</span>
                            )}
                        </div>
                        <div className={styles.totalRow} style={{borderTop: '1px solid #eee', paddingTop: '8px'}}>
                            <span className={styles.label} style={{fontSize:'16px', fontWeight:600}}>Total</span>
                            <span className={styles.finalTotal}>₹ {finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION: Preview */}
            <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                    <h3 className={styles.cardTitle} style={{margin:0}}>Preview</h3>
                    <div style={{display:'flex', gap:'8px'}}>
                        <button style={{border:'none', background:'none', cursor:'pointer'}}><Download size={18} color="#666"/></button>
                        <button style={{border:'none', background:'none', cursor:'pointer'}}><Maximize2 size={18} color="#666"/></button>
                    </div>
                </div>

                <div className={styles.paper}>
                    <div className={styles.paperHeader}>
                        <div>
                            <h4 style={{margin:0, fontSize:'16px'}}>Invoice</h4>
                            <span style={{color:'#888', fontSize:'12px'}}>{invoiceNum}</span>
                        </div>
                        <LinkIcon className={styles.logoIcon} size={24}/>
                    </div>

                    <div className={styles.paperMeta}>
                        <div className={styles.metaGroup}>
                            <label>Name</label> <p>{patientName}</p>
                        </div>
                        <div className={styles.metaGroup} style={{textAlign:'right'}}>
                            <label>Patient Id</label> <p>{patientId}</p>
                        </div>
                        <div className={styles.metaGroup}>
                            <label>Issued</label> <p>{date}</p>
                        </div>
                        <div className={styles.metaGroup} style={{textAlign:'right'}}>
                            <label>Due</label> <p>20 Sep 2025</p>
                        </div>
                    </div>

                    <table className={styles.paperTable}>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th style={{textAlign:'right'}}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.description.substring(0, 15)}...</td>
                                    <td>{item.qty}</td>
                                    <td>{item.unitPrice}</td>
                                    <td style={{textAlign:'right'}}>{item.qty * item.unitPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.paperFooter}>
                        <div className={styles.paperRow}><span>Subtotal</span> <span>₹ {subtotal}</span></div>
                        {hasTax && <div className={styles.paperRow}><span>Tax (4%)</span> <span>₹ {taxAmount.toFixed(0)}</span></div>}
                        <div className={`${styles.paperRow} ${styles.paperTotal}`}><span>Total</span> <span>₹ {finalTotal.toFixed(0)}</span></div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.btnDraft}>Save as Draft</button>
                    <button className={styles.btnSend} onClick={handleSendInvoice}>Send Invoice</button>
                </div>
            </div>

        </div>
    );
};

export default NewInvoice;