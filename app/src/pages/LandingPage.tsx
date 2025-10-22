import React from 'react';
import Hero from '../components/features/LandingPage/Hero';
import styles from './LandingPage.module.css'; // Import the CSS module
// You can add other sections of the landing page here
// import HowItWorks from '../components/features/LandingPage/HowItWorks';
// import Testimonials from '../components/features/LandingPage/Testimonials';

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingPageContainer}>
      <Hero />
      {/* Render other sections below the Hero */}
      {/* <HowItWorks /> */}
      {/* <Testimonials /> */}
    </div>
  );
};

export default LandingPage;