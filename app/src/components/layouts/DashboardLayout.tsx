import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
    Grid, 
    UserPlus, // Used for Patient List
    Calendar, 
    FileText, 
    CreditCard, 
    Search, 
    Bell, 
    User 
} from 'react-feather';
import styles from './DashboardLayout.module.css';
import logo from '../../assets/icons/logo.svg';

// --- Main Layout Component ---
const DashboardLayout: React.FC = () => {

    // This function can be expanded later to dynamically set the title
    const getPageTitle = () => {
        // Simple logic: returns a static title for now. Advanced logic would use useLocation()
        const path = window.location.pathname;
        if (path.includes('/appointments')) return 'Appointments';
        if (path.includes('/patient-list')) return 'Patient List';
        if (path.includes('/patient-profile')) return 'Patient Profile';
        return "Dashboard"; 
    };

    return (
        <div className={styles.layoutContainer}>
            {/* --- Sidebar --- */}
            <nav className={styles.sidebar}>
                <div className={styles.sidebarLogo}>
                    <img src={logo} alt="Medicore Logo"/>
                    <span>Medicore</span>
                </div>

                <div className={styles.navLinks}>
                    {/* 1. Dashboard */}
                    <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <Grid size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    {/* 2. Appointments (Matches image order) */}
                    <NavLink 
                        to="/appointments" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <Calendar size={20} />
                        <span>Appointments</span>
                    </NavLink>
                    {/* 3. Patient List (New link for staff roles) */}
                    <NavLink 
                        to="/patient-list" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <UserPlus size={20} />
                        <span>Patient List</span>
                    </NavLink>
                    {/* 4. Medical Records */}
                    <NavLink 
                        to="/medical-records" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <FileText size={20} />
                        <span>Medical Records</span>
                    </NavLink>
                    {/* 5. Bills & Payments */}
                    <NavLink 
                        to="/billing" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <CreditCard size={20} />
                        <span>Bills & Payments</span>
                    </NavLink>
                </div>
            </nav>

            {/* --- Main Content --- */}
            <main className={styles.mainContent}>
                {/* --- Top Bar --- */}
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

                {/* --- Page Content (Outlet renders Dashboard, Appointments, etc.) --- */}
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;