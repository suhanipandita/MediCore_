import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './FindDoctors.module.css';
import {
  ToggleLeft,
  ToggleRight,
  Star,
  ChevronRight,
} from 'react-feather';

// Import Service & Types
import { fetchDoctors } from '../services/doctorService';
import type{ UIDoctor } from '../services/doctorService';

// --- Types ---
interface FilterState {
  immediateCare: boolean;
  sortBy: string;
  maxDistance: number;
  maxFee: number;
  date: string;
  timeOfDay: string[];
  minRating: number | null;
  experienceRanges: string[];
  gender: string;
}

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

/**
 * Sidebar Component (Unchanged logic, just ensure imports match)
 */
const FiltersSidebar: React.FC<SidebarProps> = ({ filters, setFilters }) => {
  const updateFilter = (field: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCheckbox = (field: 'timeOfDay' | 'experienceRanges', value: string) => {
    setFilters((prev) => {
      const currentList = prev[field];
      if (currentList.includes(value)) {
        return { ...prev, [field]: currentList.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      immediateCare: false,
      sortBy: 'relevance',
      maxDistance: 30,
      maxFee: 2000,
      date: '',
      timeOfDay: [],
      minRating: null,
      experienceRanges: [],
      gender: 'all',
    });
  };

  return (
    <aside className={styles.filtersSidebar}>
      <div className={styles.filterHeader}>
        <h3>Filter</h3>
        <button className={styles.resetButton} onClick={resetFilters}>Reset</button>
      </div>

      <div className={styles.filterGroup}>
        <div 
          className={styles.filterTitleRow} 
          onClick={() => updateFilter('immediateCare', !filters.immediateCare)}
          style={{ cursor: 'pointer' }}
        >
          <label className={styles.filterTitle} style={{ cursor: 'pointer' }}>Immediate Care</label>
          {filters.immediateCare ? (
             <ToggleRight size={36} className={styles.toggleIcon} color="#2A7B72" />
          ) : (
             <ToggleLeft size={36} className={styles.toggleIcon} />
          )}
        </div>
        <p className={styles.filterDescription}>Search doctors with the nearest available slots.</p>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterTitle} htmlFor="sortBy">Sort By</label>
        <select 
          id="sortBy" 
          className={styles.selectInput}
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="price_low_high">Price: Low to High</option>
          <option value="price_high_low">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Max Distance: {filters.maxDistance} km</h4>
        <div className={styles.rangeSliderContainer}>
          <input type="range" min="0" max="30" value={filters.maxDistance} onChange={(e) => updateFilter('maxDistance', Number(e.target.value))} className={styles.rangeSlider} />
          <div className={styles.rangeLabels}><span>0 km</span><span>30 km</span></div>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Max Fee: ₹{filters.maxFee}</h4>
        <div className={styles.rangeSliderContainer}>
          <input type="range" min="0" max="2000" step="100" value={filters.maxFee} onChange={(e) => updateFilter('maxFee', Number(e.target.value))} className={styles.rangeSlider} />
          <div className={styles.rangeLabels}><span>₹0</span><span>₹2000</span></div>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Search By Date</h4>
        <div className={styles.dateInputWrapper}>
          <input type="date" className={styles.dateInput} value={filters.date} onChange={(e) => updateFilter('date', e.target.value)} />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Gender</h4>
        <div className={styles.radioGroup}>
          {['all', 'male', 'female', 'nonbinary'].map((g) => (
            <label key={g} style={{textTransform: 'capitalize'}}>
              <input type="radio" name="gender" value={g} checked={filters.gender === g} onChange={(e) => updateFilter('gender', e.target.value)} /> {g}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

// --- Helper to format date "2025-10-10" -> "10 Oct" ---
const formatDateForSlot = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

/**
 * UPDATED DoctorCard to match the image structure
 */
const DoctorCard: React.FC<{ doctor: UIDoctor }> = ({ doctor }) => (
  <article className={styles.doctorCard}>
    
    {/* Left: Avatar + Link */}
    <div className={styles.doctorLeft}>
      <img
        src={doctor.imageSrc}
        alt={doctor.name}
        className={styles.doctorImage}
      />
      <button className={styles.viewProfileLink}>View Profile</button>
    </div>

    {/* Middle: Info */}
    <div className={styles.doctorMiddle}>
      <h3 className={styles.doctorName}>{doctor.name}</h3>
      <p className={styles.doctorSpeciality}>{doctor.speciality}</p>
      
      <div className={styles.ratingRow}>
        <Star size={16} className={styles.starIcon} />
        <span>{doctor.rating}</span>
        <span className={styles.reviewCount}>({doctor.reviews} reviews)</span>
      </div>

      <div className={styles.detailsList}>
        <span className={styles.metaItem}>
          Years of experience: {doctor.experience}
        </span>
        <span className={styles.metaItem}>
          Consultation Fee: ₹{doctor.consultationFee}
        </span>
        <span className={styles.metaItem}>
          Location: {doctor.location}
        </span>
      </div>
    </div>

    {/* Right: Availability Grid */}
    <div className={styles.doctorRight}>
      <div className={styles.availabilityHeader}>
        <h4>Availability</h4>
        <a href="#" className={styles.viewAllLink}>
          View all <ChevronRight size={14} />
        </a>
      </div>
      
      <div className={styles.availabilityGrid}>
        {/* Render slots from DB data */}
        {doctor.availability && doctor.availability.slice(0, 8).map((day: any, index: number) => {
          const slotCount = day.slots ? day.slots.length : 0;
          const isAvailable = slotCount > 0;
          
          return isAvailable ? (
            <Link
              key={index}
              to={`/schedule-appointment/${doctor.id}?date=${encodeURIComponent(day.date)}`}
              className={`${styles.availabilitySlot} ${styles.available}`}
            >
              <span className={styles.slotDate}>{formatDateForSlot(day.date)}</span>
              <span className={styles.slotCount}>{slotCount} appts</span>
            </Link>
          ) : (
            <div key={index} className={`${styles.availabilitySlot} ${styles.unavailable}`}>
              <span className={styles.slotDate}>{formatDateForSlot(day.date)}</span>
              <span className={styles.slotCount}>0 appts</span>
            </div>
          );
        })}
      </div>
    </div>
  </article>
);

/**
 * Main Page
 */
const FindDoctors: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    immediateCare: false,
    sortBy: 'relevance',
    maxDistance: 30,
    maxFee: 2000,
    date: '',
    timeOfDay: [],
    minRating: null,
    experienceRanges: [],
    gender: 'all',
  });

  const [doctors, setDoctors] = useState<UIDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      const data = await fetchDoctors();
      setDoctors(data);
      setLoading(false);
    };
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    // Gender
    if (filters.gender !== 'all') {
      result = result.filter(
        (doc) => doc.gender && doc.gender.toLowerCase() === filters.gender
      );
    }
    // Fee
    result = result.filter((doc) => doc.consultationFee <= filters.maxFee);
    // Rating
    if (filters.minRating !== null) {
      result = result.filter((doc) => doc.rating >= filters.minRating!);
    }
    // Immediate Care
    if (filters.immediateCare) {
        result = result.filter(doc => doc.availability && doc.availability.some((day: any) => day.slots && day.slots.length > 0));
    }
    // Sorting
    if (filters.sortBy === 'price_low_high') {
      result.sort((a, b) => a.consultationFee - b.consultationFee);
    } else if (filters.sortBy === 'price_high_low') {
      result.sort((a, b) => b.consultationFee - a.consultationFee);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [filters, doctors]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <FiltersSidebar filters={filters} setFilters={setFilters} />
        
        <section className={styles.resultsSection}>
          {loading ? (
             <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>Loading doctors...</div>
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
              <h3>No doctors found.</h3>
              <button 
                onClick={() => setFilters(prev => ({...prev, gender: 'all', maxFee: 2000, minRating: null, immediateCare: false}))}
                style={{ marginTop: '1rem', padding: '8px 16px', cursor: 'pointer', background: '#2A7B72', color: 'white', border: 'none', borderRadius: '8px' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FindDoctors;