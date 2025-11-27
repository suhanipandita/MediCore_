import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import styles from './Hero.module.css';
import { Search } from 'react-feather';
import DoctorHeroImage from '../../../assets/images/doctor-hero.png';
import locationIcon from '../../../assets/icons/location.svg'; // Renamed to avoid conflict
import doctorIcon from '../../../assets/icons/doctor.svg'; // Renamed

const Hero: React.FC = () => {
  const navigate = useNavigate(); // 2. Initialize hook
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Handler to redirect to Find Doctors page
  const handleSearch = () => {
    navigate(`/find-doctors?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find Trusted Doctors in Seconds.
          </h1>
          <p className={styles.heroSubtitle}>
            Search by specialty, condition, or location...
          </p>
          
          <div className={styles.searchBar}>
            {/* Location Input (Optional logic can be added) */}
            <div className={styles.searchInputWrapper}>
              <img src={locationIcon} alt="" className={styles.icon} />
              <input type="text" placeholder="City or Zip code" className={styles.searchInput}/>
            </div>

            {/* Main Search Input */}
            <div className={styles.searchInputWrapper}>
              <img src={doctorIcon} alt="" className={styles.icon} />
              <input 
                type="text" 
                placeholder="Condition, Doctor, Name..." 
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Allow Enter key
              />
            </div>

            {/* Search Button */}
            <button 
                className={styles.searchButton} 
                aria-label="Search"
                onClick={handleSearch} // 4. Attach handler
            >
              <Search size={24} />
            </button>
          </div>
          
          {/* Link directly to the page */}
          <a href="/find-doctors" className={styles.browseLink}>
            Browse All Specialties &gt;
          </a>
        </div>
        <div className={styles.heroImageContainer}>
          <img src={DoctorHeroImage} alt="Smiling doctor" className={styles.heroImage} />
        </div>
      </div>
  );
};

export default Hero;