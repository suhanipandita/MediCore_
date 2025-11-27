import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './ScheduleAppoinment.module.css';
import { X, MapPin, Calendar, Sun, Moon, Cloud, ChevronDown } from 'react-feather';

// Import the shared mock data
import { mockDoctors } from '../data/mockDoctors';

type Period = 'Morning' | 'Afternoon' | 'Evening';

const ScheduleAppointment: React.FC = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get data from URL (initial load from FindDoctors page)
  const initialDate = searchParams.get('date') || '';
  // Get initial time and reason if coming back from ReviewConfirm
  const initialTimeParam = searchParams.get('time');
  const initialReasonParam = searchParams.get('reason');

  const doctor = mockDoctors.find(d => String(d.id) == doctorId);

  // --- State for interactivity ---
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Morning'); // Default to Morning
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTimeParam);
  const [visitReason, setVisitReason] = useState<string>(initialReasonParam || 'Chest Pain');

  // Find the correct slots for the selected doctor and date
  const dayAvailability = useMemo(() => {
    return doctor?.availability.find(day => day.date === initialDate);
  }, [doctor, initialDate]);

  const allTimeSlots = dayAvailability ? dayAvailability.slots : [];

  // Filter slots based on the selected period (Morning/Afternoon/Evening)
  const filteredTimeSlots = useMemo(() => {
    return allTimeSlots.filter(slot => slot.period === selectedPeriod);
  }, [allTimeSlots, selectedPeriod]);

  // Set default selected time when component loads or period changes
  React.useEffect(() => {
    if (initialTimeParam && filteredTimeSlots.some(slot => slot.time === initialTimeParam)) {
      setSelectedTime(initialTimeParam); // Keep previous selection if valid
      // Determine the period of the initialTimeParam and set selectedPeriod
      const initialSlotPeriod = filteredTimeSlots.find(slot => slot.time === initialTimeParam)?.period;
      if (initialSlotPeriod) {
        setSelectedPeriod(initialSlotPeriod);
      }
    } else if (filteredTimeSlots.length > 0) {
      setSelectedTime(filteredTimeSlots[0].time); // Select first available slot
    } else {
      setSelectedTime(null); // No slots available for this period
    }
  }, [selectedPeriod, filteredTimeSlots, initialTimeParam]);
  
  // --- Handle "Doctor not found" or "Date not found" ---
  if (!doctor || !dayAvailability) {
    return (
      <div className={styles.overlay}>
         <div className={styles.modal}>
           <div className={styles.modalHeader}>
             <h2>Error</h2>
             <button className={styles.closeButton} onClick={() => navigate(-1)}>
               <X size={24} />
             </button>
           </div>
           <p className={styles.loading}>
             {doctor ? 'No availability found for this date.' : 'Doctor not found.'}
           </p>
         </div>
      </div>
    );
  }

  // --- Navigate to Review & Confirm page ---
  const handleContinue = () => {
    if (selectedTime) {
      navigate(
        `/review-confirm/${doctor.id}?date=${encodeURIComponent(initialDate)}&time=${encodeURIComponent(selectedTime)}&reason=${encodeURIComponent(visitReason)}`
      );
    } else {
      alert('Please select a time slot.');
    }
  };

  // --- Render the page with the correct doctor's info ---
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Schedule Appointment</h2>
          <button className={styles.closeButton} onClick={() => navigate(-1)}>
            <X size={24} />
          </button>
        </div>

        {/* Doctor Info Card - DYNAMIC DATA */}
        <div className={styles.doctorInfoCard}>
          <img src={doctor.imageSrc} alt={doctor.name} className={styles.doctorImage} />
          <div className={styles.doctorDetails}>
            <h3 className={styles.doctorName}>{doctor.name}</h3>
            <p className={styles.doctorSpeciality}>{doctor.speciality}</p>
            <p className={styles.doctorLocation}>
              <MapPin size={14} className={styles.locationIcon} /> {doctor.location}
            </p>
          </div>
        </div>

        {/* Reason for Visit */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Reason for Visit</h4>
          <div className={styles.selectWrapper}>
            <select 
              className={styles.reasonSelect} 
              value={visitReason} // Controlled component
              onChange={(e) => setVisitReason(e.target.value)}
            >
              <option value="Chest Pain">Chest Pain</option>
              <option value="Fever">Fever</option>
              <option value="Headache">Headache</option>
              <option value="Routine Checkup">Routine Checkup</option>
            </select>
            <ChevronDown size={20} className={styles.selectArrow} />
          </div>
        </div>

        {/* Appointment Time - DYNAMIC DATE */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Appointment Time</h4>
          <div className={styles.datePicker}>
            <span>{initialDate}, 2025</span> {/* Display the date from URL */}
            <Calendar size={20} />
          </div>

          {/* --- Interactive Time of Day Toggle --- */}
          <div className={styles.timeOfDayToggle}>
            <button 
              className={`${styles.timeOfDayButton} ${selectedPeriod === 'Morning' ? styles.active : ''}`}
              onClick={() => setSelectedPeriod('Morning')}
            >
              <Cloud size={18} /> Morning
            </button>
            <button 
              className={`${styles.timeOfDayButton} ${selectedPeriod === 'Afternoon' ? styles.active : ''}`}
              onClick={() => setSelectedPeriod('Afternoon')}
            >
              <Sun size={18} /> Afternoon
            </button>
            <button 
              className={`${styles.timeOfDayButton} ${selectedPeriod === 'Evening' ? styles.active : ''}`}
              onClick={() => setSelectedPeriod('Evening')}
            >
              <Moon size={18} /> Evening
            </button>
          </div>

          {/* --- Dynamic Time Slots Grid --- */}
          <div className={styles.timeSlotsGrid}>
            {filteredTimeSlots.length > 0 ? (
              filteredTimeSlots.map((slot) => (
                <button
                  key={slot.time}
                  className={`${styles.timeSlotButton} ${selectedTime === slot.time ? styles.selected : ''}`}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                </button>
              ))
            ) : (
              <p className={styles.noSlotsText}>No slots available for this period.</p>
            )}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button 
            className={styles.continueButton} 
            disabled={!selectedTime}
            onClick={handleContinue} // Call the new handler
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;