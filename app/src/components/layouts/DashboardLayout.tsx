import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
    Grid, 
    UserPlus, 
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

    // This function will be needed to update the title
    // For now, it's static
    const getPageTitle = () => {
        // In the future, we can use `useLocation` to change this
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
                    <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <Grid size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink 
                        to="/find-doctor" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <UserPlus size={20} />
                        <span>Find Doctor</span>
                    </NavLink>
                    <NavLink 
                        to="/appointments" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <Calendar size={20} />
                        <span>Appointments</span>
                    </NavLink>
                    <NavLink 
                        to="/medical-records" 
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        <FileText size={20} />
                        <span>Medical Records</span>
                    </NavLink>
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