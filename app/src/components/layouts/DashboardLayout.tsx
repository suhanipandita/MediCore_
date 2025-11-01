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

// --- Stethoscope Icon for Logo ---
const StethoscopeIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"></path>
        <path d="M8 6V4"></path>
        <path d="M8 6v4l-2.5 4.5a.5.5 0 0 1-.8-.4V10c0-1.1.9-2 2-2h1"></path>
        <path d="M16 4v4l2.5 4.5a.5.5 0 0 1 .8-.4V8c0-1.1-.9-2-2-2h-1"></path>
        <path d="M8 10h8"></path>
        <path d="M12 14v8"></path>
        <circle cx="12" cy="20" r="2"></circle>
    </svg>
);

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
                    <StethoscopeIcon />
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