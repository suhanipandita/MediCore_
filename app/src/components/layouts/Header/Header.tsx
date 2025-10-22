import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks'; // Correct path from components/layouts/Header
import styles from './Header.module.css';
import notificationIcon from '../../../assets/icons/notification-bell.png';
import userIcon from '../../../assets/icons/user-profile.png';

const Header: React.FC = () => {
  const { session, profile } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const renderUserActions = () => {
    if (session && profile) {
      return (
        <div className={styles.userActions}>
          <button className={styles.actionButton} aria-label="Notifications">
            <img src={notificationIcon} alt="" className={styles.icon} />
            <span className={styles.badge}>4</span> {/* Static badge for now */}
          </button>
          {/* Profile Button */}
          <button className={styles.actionButton} aria-label="User profile">
            <img src={userIcon} alt="" className={styles.icon} />
            {/* Display first name if available, fallback to 'User' or 'Zara' */}
            <span>{profile.first_name || 'User'}</span>
          </button>
          {/* Add Logout Button/Dropdown Here */}
        </div>
      );
    } else {
      // Unauthenticated View (shows Login/Signup)
      return (
        <div className={styles.userActions}>
          <button
            className={styles.loginButton} // Use a specific style
            onClick={() => navigate('/login')}
          >
            Login / Signup
          </button>
        </div>
      );
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Medicore
        </Link>
        <nav className={styles.nav}>
          <Link to="/find-doctors" className={styles.navLink}>
            Find Doctors
          </Link>
          <Link to="/appointments" className={styles.navLink}>
            Appointments
          </Link>
          <Link to="/my-health" className={styles.navLink}>
            My Health
          </Link>
        </nav>
        {renderUserActions()}
      </div>
    </header>
  );
};

export default Header;