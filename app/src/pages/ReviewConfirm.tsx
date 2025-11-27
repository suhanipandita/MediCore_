import React, { useMemo, useState } from 'react'; // <-- Import useState
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './ReviewConfirm.module.css';
import { X, MapPin } from 'react-feather';
import { useAppSelector } from '../store/hooks'; 

// Import the shared mock data
import { mockDoctors } from '../data/mockDoctors';

const ReviewConfirm: React.FC = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- Get auth state from Redux ---
  const { session } = useAppSelector((state) => state.auth); 

  // Retrieve appointment details from URL
  const selectedDate = searchParams.get('date') || 'N/A';
  const selectedTime = searchParams.get('time') || 'N/A';
  const visitReason = searchParams.get('reason') || 'Chest pain'; 

  const doctor = useMemo(() => {
    return mockDoctors.find(d => String(d.id) == doctorId);
  }, [doctorId]);

  // --- NEW STATE FOR PATIENT EDITING ---
  const [patientName, setPatientName] = useState('User (me)');
  const [isEditingPatient, setIsEditingPatient] = useState(false);

  if (!doctor) {
    // ... (error handling remains the same)
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Error</h2>
            <button className={styles.closeButton} onClick={() => navigate(-1)}>
              <X size={24} />
            </button>
          </div>
          <p className={styles.errorMessage}>Doctor not found.</p>
        </div>
      </div>
    );
  }

  // --- Handler for Date & Time Edit (Requirement 1) ---
  const handleEditAppointment = () => {
    // This navigates back to the schedule page
    navigate(`/schedule-appointment/${doctor.id}?date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&reason=${encodeURIComponent(visitReason)}`);
  };

  // --- Handler for Patient Edit (Requirement 2) ---
  const handlePatientEditToggle = () => {
    // This toggles the input field on and off
    setIsEditingPatient(!isEditingPatient); 
  };

  const handleBookAppointment = () => {
    if (session) {
      // Use the patientName from state
      alert(`Appointment Booked for ${patientName}!`); 
      navigate('/'); 
    } else {
      const returnUrl = location.pathname + location.search;
      navigate(`/login-patient?redirectTo=${encodeURIComponent(returnUrl)}`);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Review & Confirm</h2>
          <button className={styles.closeButton} onClick={() => navigate(-1)}>
            <X size={24} />
          </button>
        </div>

        {/* Doctor Info Card */}
        <div className={styles.infoCard}>
          <img src={doctor.imageSrc} alt={doctor.name} className={styles.doctorImage} />
          <div className={styles.doctorDetails}>
            <h3 className={styles.doctorName}>{doctor.name}</h3>
            <p className={styles.doctorSpeciality}>{doctor.speciality}</p>
            <p className={styles.doctorLocation}>
              <MapPin size={14} className={styles.locationIcon} /> {doctor.location}
            </p>
          </div>
        </div>

        {/* Date & Time / Reason for Visit */}
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>Date & Time</h4>
            {/* This button navigates away */}
            <button className={styles.editButton} onClick={handleEditAppointment}>Edit</button>
          </div>
          <p className={styles.detailText}>{selectedDate} at {selectedTime}</p>

          <h4 className={styles.cardTitle}>Visit reason</h4>
          <p className={styles.detailText}>{visitReason}</p>
        </div>

        {/* --- UPDATED PATIENT INFO CARD --- */}
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>Patient</h4>
            {/* This button toggles local state */}
            <button className={styles.editButton} onClick={handlePatientEditToggle}>
              {isEditingPatient ? 'Save' : 'Edit'}
            </button>
          </div>
          {isEditingPatient ? (
            // If editing, show an input field
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className={styles.patientNameInput}
              autoFocus
            />
          ) : (
            // Otherwise, show the text
            <p className={styles.detailText}>{patientName}</p>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.bookButton} onClick={handleBookAppointment}>
            {session ? 'Book Appointment' : 'Login to Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirm;