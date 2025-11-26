import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
    Grid, 
    UserPlus, 
    Calendar, 
    FileText, 
    CreditCard, 
    Search, 
    Bell, 
    User,
    Package,
    Users
} from 'react-feather';
import styles from './DashboardLayout.module.css';
import logo from '../../assets/icons/logo.svg';
import { useAppSelector } from '../../store/hooks';

const DashboardLayout: React.FC = () => {
    const location = useLocation();
    // 1. Get 'user' in addition to 'profile'
    const { user, profile } = useAppSelector((state) => state.auth);
    
    // 2. FIX: Use profile role OR fallback to user_metadata role immediately
    const role = (profile?.role || user?.user_metadata?.role || '').toLowerCase(); 

    const getDashboardRoute = () => {
        switch (role) {
            case 'admin': return '/admin-dashboard';
            case 'doctor': return '/doctor-dashboard';
            case 'nurse': return '/nurse-dashboard';
            case 'patient': return '/dashboard';
            default: return '/select-role';
        }
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('admin-dashboard')) return 'Admin Dashboard';
        if (path.includes('doctor-dashboard')) return 'Doctor Dashboard';
        if (path.includes('nurse-dashboard')) return 'Nurse Dashboard';
        if (path.includes('appointments')) return 'Appointments';
        if (path.includes('patient-list')) return 'Patient List';
        if (path.includes('medical-records')) return 'Medical Records';
        if (path.includes('billing')) return 'Billing & Invoice';
        if (path.includes('inventory')) return 'Inventory';
        if (path.includes('staff-management')) return 'Staff Management';
        return "Dashboard"; 
    };

    return (
        <div className={styles.layoutContainer}>
            <nav className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <img src={logo} alt="Medicore Logo"/>
                    <span>Medicore</span>
                </div>

                <div className={styles.navLinks}>
                    {/* 1. Dashboard (Dynamic Link) */}
                    <NavLink 
                        to={getDashboardRoute()} 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                        end
                    >
                        <Grid size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    {/* --- ADMIN LINKS --- */}
                    {role === 'admin' && (
                        <>
                            <NavLink to="/staff-management" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                <Users size={20} /> <span>Staff Management</span>
                            </NavLink>
                            <NavLink to="/billing" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                <FileText size={20} /> <span>Billing & Invoice</span>
                            </NavLink>
                            <NavLink to="/inventory" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                <Package size={20} /> <span>Inventory</span>
                            </NavLink>
                        </>
                    )}

                    {/* --- DOCTOR LINKS (Strictly 3 items) --- */}
                    {role === 'doctor' && (
                        <>
                            <NavLink to="/appointments" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                <Calendar size={20} /> <span>Appointments</span>
                            </NavLink>
                            <NavLink to="/patient-list" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                <UserPlus size={20} /> <span>Patient List</span>
                            </NavLink>
                        </>
                    )}

                    {/* --- PATIENT LINKS --- */}
                    {role === 'patient' && (
                        <>
                            <NavLink to="/appointments" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                <Calendar size={20} /> <span>Appointments</span>
                            </NavLink>
                            <NavLink to="/medical-records" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                <FileText size={20} /> <span>Medical Records</span>
                            </NavLink>
                            <NavLink to="/billing" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                <CreditCard size={20} /> <span>Bills & Payments</span>
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>

            <main className={styles.mainContent}>
                <header className={styles.topbar}>
                    <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
                    <div className={styles.topbarActions}>
                        <div className={styles.searchWrapper}>
                            <Search size={18} className={styles.searchIcon} />
                            <input type="text" placeholder="Search" className={styles.searchInput} />
                        </div>
                        <button className={styles.iconButton}>
                            <Bell size={20} />
                        </button>
                        <button className={`${styles.iconButton} ${styles.userButton}`}>
                            <User size={20} />
                        </button>
                    </div>
                </header>

                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;