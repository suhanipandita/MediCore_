import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, Plus, MoreVertical, X } from 'react-feather';
import styles from './dashboard.module.css'; // Common styles
import staffStyles from './StaffManagement.module.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addStaffMember } from '../store/slices/staffSlice';

const StaffManagement: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { staff } = useAppSelector(state => state.staff);

    // --- Filter State ---
    const [roleFilter, setRoleFilter] = useState<'All' | 'Doctor' | 'Nurse'>('All');
    const [deptFilter, setDeptFilter] = useState<string>('All');
    const [showModal, setShowModal] = useState(false);
    const [search] = useState('');

    // --- Add Staff Form State ---
    const [newStaff, setNewStaff] = useState({ name: '', role: 'Doctor', department: '' });

    // Departments List (Could be dynamic)
    const departments = ['Cardiology', 'Physiology', 'Ophthalmology', 'Dermatology', 'Orthopedics'];

    // --- Filtering Logic ---
    const filteredStaff = staff.filter(member => {
        const matchesRole = roleFilter === 'All' || member.role === roleFilter;
        const matchesDept = deptFilter === 'All' || member.department === deptFilter;
        const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) || member.id.toLowerCase().includes(search.toLowerCase());
        return matchesRole && matchesDept && matchesSearch;
    });

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStaff.name && newStaff.department) {
            dispatch(addStaffMember({
                name: newStaff.name,
                role: newStaff.role as 'Doctor' | 'Nurse',
                department: newStaff.department
            }));
            setShowModal(false);
            setNewStaff({ name: '', role: 'Doctor', department: '' }); // Reset
        }
    };

    return (
        <div className={staffStyles.container}>
            {/* Header with Search (reusing dashboard layout search style) */}
            
            <div className={staffStyles.filterHeader}>
                {/* Filters */}
                <div className={staffStyles.filterGroup}>
                    <button className={staffStyles.filterChip}><Sliders size={14} /> Filters</button>
                    
                    <button 
                        className={`${staffStyles.filterChip} ${roleFilter === 'Doctor' ? staffStyles.active : ''}`}
                        onClick={() => setRoleFilter(roleFilter === 'Doctor' ? 'All' : 'Doctor')}
                    >
                        Doctor {roleFilter === 'Doctor' && <X size={12}/>}
                    </button>
                    
                    <button 
                        className={`${staffStyles.filterChip} ${roleFilter === 'Nurse' ? staffStyles.active : ''}`}
                        onClick={() => setRoleFilter(roleFilter === 'Nurse' ? 'All' : 'Nurse')}
                    >
                        Nurse {roleFilter === 'Nurse' && <X size={12}/>}
                    </button>

                    {/* Advanced Dept Filter */}
                    <select 
                        className={staffStyles.departmentSelect} 
                        value={deptFilter} 
                        onChange={(e) => setDeptFilter(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>

                {/* Add Button */}
                <button className={staffStyles.btnAddStaff} onClick={() => setShowModal(true)}>
                    <Plus size={16}/> Add Staff
                </button>
            </div>

            {/* Staff Table */}
            <div className={styles.card} style={{padding:0, overflow:'hidden'}}>
                <table className={staffStyles.staffTable}>
                    <thead>
                        <tr>
                            <th>Staff ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStaff.map(member => (
                            <tr 
                                key={member.id} 
                                className={staffStyles.tableRow}
                                onClick={() => navigate(`/staff/${member.id}`)}
                            >
                                <td className={staffStyles.colId}>{member.id}</td>
                                <td className={staffStyles.colName}>
                                    <div className={styles.avatar} style={{backgroundImage: member.avatarUrl ? `url(${member.avatarUrl})` : undefined}}></div>
                                    {member.name}
                                </td>
                                <td className={staffStyles.colRole}>{member.role}</td>
                                <td className={staffStyles.colDept}>{member.department}</td>
                                <td>
                                    {member.status === 'Active' ? (
                                        <span className={staffStyles.statusActive}><span className={staffStyles.dotActive}></span> Active</span>
                                    ) : (
                                        <span className={staffStyles.statusInactive}><span className={staffStyles.dotInactive}></span> Inactive</span>
                                    )}
                                </td>
                                <td><MoreVertical size={16} color="#888"/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Staff Modal */}
            {showModal && (
                <div className={staffStyles.modalOverlay}>
                    <div className={staffStyles.modalCard}>
                        <div className={staffStyles.modalHeader}>
                            <h3 className={staffStyles.modalTitle}>Add New Staff</h3>
                            <button onClick={() => setShowModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20}/></button>
                        </div>
                        <form onSubmit={handleAddStaff}>
                            <div className={staffStyles.formGroup}>
                                <label className={staffStyles.formLabel}>Full Name</label>
                                <input 
                                    className={staffStyles.formInput} 
                                    placeholder="e.g. John Doe"
                                    value={newStaff.name}
                                    onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className={staffStyles.formGroup}>
                                <label className={staffStyles.formLabel}>Role</label>
                                <select 
                                    className={staffStyles.formSelect}
                                    value={newStaff.role}
                                    onChange={e => setNewStaff({...newStaff, role: e.target.value as string})}
                                >
                                    <option value="Doctor">Doctor</option>
                                    <option value="Nurse">Nurse</option>
                                </select>
                            </div>
                            <div className={staffStyles.formGroup}>
                                <label className={staffStyles.formLabel}>Department</label>
                                <select 
                                    className={staffStyles.formSelect}
                                    value={newStaff.department}
                                    onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className={staffStyles.modalActions}>
                                <button type="button" className={staffStyles.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className={staffStyles.btnSubmit}>Add Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManagement;