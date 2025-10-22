import React from 'react';
import styles from './Hero.module.css';
import { MapPin, Search } from 'react-feather';
// Correct path relative to Hero.tsx
import DoctorHeroImage from '../../../assets/images/doctor-hero.png';
import location from '../../../assets/icons/location.svg';
import doctor from '../../../assets/icons/doctor.svg';

const Hero: React.FC = () => {
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find Trusted Doctors in Seconds.
          </h1>
          <p className={styles.heroSubtitle}>
            Search by specialty, condition, or location
            — book your appointment in just minutes
          </p>
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
            <img src={doctor} alt="" className={styles.icon} />
              <input type="text" placeholder="City or Zip code" className={styles.searchInput}/>
            </div>
            <div className={styles.searchInputWrapper}>
            <img src={location} alt="" className={styles.icon} />
              <input type="text" placeholder="Condition, Doctor, Name..." className={styles.searchInput}/>
            </div>
            <button className={styles.searchButton} aria-label="Search">
              <Search size={24} />
            </button>
          </div>
          <a href="#" className={styles.browseLink}>
            Browse All Specialties &gt;
          </a>
        </div>
        <div className={styles.heroImageContainer}>
          <img src={DoctorHeroImage} alt="Smiling doctor holding a clipboard" className={styles.heroImage} />
        </div>
      </div>
    </div>
  );
};

export default Hero;