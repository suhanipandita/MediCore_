import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layouts/Header/Header';
import styles from './MainLayout.module.css'; // Import the CSS module

// Define styles for the layout if needed, or use global styles
// import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
  return (
    <div> {/* Or use a more semantic tag like <div className={styles.layout}> */}
      <Header />
      <main className={styles.mainContent}>
        <Outlet /> {/* Child routes render here */}
      </main>
      {/* Footer can be added here */}
    </div>
  );
};

export default MainLayout;