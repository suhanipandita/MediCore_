import React, { useState } from 'react';
import styles from './PatientAppointments.module.css';
import { Search, Bell, Sliders, X } from 'react-feather';
// Profile icon from assets
import userProfileIcon from '../assets/icons/user-profile.png'; 

// Mock Data
const mockAppointments = [
  { id: 1, name: 'John smith', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZ', status: 'Cancelled' },
  { id: 2, name: 'Jhonny', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZZZZ', status: 'Rescheduled' },
  { id: 3, name: 'Max Black', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZZZZ', status: 'Rescheduled' },
  { id: 4, name: 'Becky White', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZZZZ', status: 'Completed' },
  { id: 5, name: 'Cid Volt', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZZZZ', status: 'Rescheduled' },
  { id: 6, name: 'James Well', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZZZZ', status: 'Completed' },
  { id: 7, name: 'Bow Sudde', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZZZZ', status: 'Completed' },
  { id: 8, name: 'John smith', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZZZZ', status: 'Rescheduled' },
  { id: 9, name: 'John smith', date: '12 Sept, 2025', time: '4:00 PM', clinic: 'ZZZZZZZ', status: 'Rescheduled' },
];

const activeFilters = [
  { id: 1, label: 'Completed' },
  { id: 2, label: 'Rescheduled' },
  { id: 3, label: 'Cancelled' },
];

const Appointments: React.FC = () => {
  // In a real app, this would come from state/props
  const [filters, setFilters] = useState(activeFilters); 

  const removeFilter = (id: number) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  return (
    <div className={styles.pageContent}>
      {/* Header Bar */}
      <header className={styles.header}>
        <h1 className={styles.title}>Appointments</h1>
        <div className={styles.headerControls}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.searchInput} />
          </div>
          <button className={styles.iconButton}>
            <Bell size={20} />
          </button>
          <button className={styles.iconButton}>
            <img src={userProfileIcon} alt="Profile" className={styles.profileIcon} />
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <button className={styles.filterButton}>
          <Sliders size={16} />
          <span>Filters</span>
        </button>
        {filters.map(filter => (
          <div key={filter.id} className={styles.filterTag}>
            <span>{filter.label}</span>
            <button onClick={() => removeFilter(filter.id)} className={styles.removeTagButton}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div className={styles.tableContainer}>
        <table className={styles.appointmentsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Clinic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAppointments.map((appt) => (
              <tr key={appt.id}>
                <td className={styles.patientCell}>
                  <img src={userProfileIcon} alt={appt.name} className={styles.patientAvatar} />
                  <span>{appt.name}</span>
                </td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.clinic}</td>
                <td>
                  <span className={`${styles.status} ${styles[appt.status.toLowerCase()]}`}>
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;