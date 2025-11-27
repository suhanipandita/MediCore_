import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styles from './ReviewConfirm.module.css';
import { X, MapPin } from 'react-feather';
import { useAppSelector } from '../store/hooks';
import { fetchDoctorById } from '../services/doctorService';
import type{ UIDoctor } from '../services/doctorService';
import { createAppointment } from '../services/appointmentService'; // <-- Import new service

const ReviewConfirm: React.FC = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAppSelector((state) => state.auth);

  const selectedDate = searchParams.get('date') || 'N/A';
  const selectedTime = searchParams.get('time') || 'N/A';
  const visitReason = searchParams.get('reason') || 'Chest pain';

  const [doctor, setDoctor] = useState<UIDoctor | null>(null);
  const [patientName, setPatientName] = useState('User (me)');
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isBooking, setIsBooking] = useState(false); // Loading state for booking

  useEffect(() => {
    if (doctorId) {
        fetchDoctorById(doctorId).then(setDoctor);
    }
  }, [doctorId]);

  if (!doctor) return <div className={styles.overlay}><div className={styles.modal}><p>Loading...</p></div></div>;

  const handleEditAppointment = () => {
    navigate(`/schedule-appointment/${doctor.id}?date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&reason=${encodeURIComponent(visitReason)}`);
  };

  const handleBookAppointment = async () => {
    if (!session) {
      const returnUrl = location.pathname + location.search;
      navigate(`/login-patient?redirectTo=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setIsBooking(true);
    try {
        await createAppointment(
            session.user.id,
            doctor.id,
            selectedDate,
            selectedTime,
            visitReason
        );
        alert(`Appointment Successfully Booked with ${doctor.name}!`);
        navigate('/dashboard'); // Or /my-appointments
    } catch (error: any) {
        console.error("Booking failed:", error);
        alert(`Booking failed: ${error.message}`);
    } finally {
        setIsBooking(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Review & Confirm</h2>
          <button className={styles.closeButton} onClick={() => navigate(-1)}><X size={24} /></button>
        </div>

        <div className={styles.infoCard}>
          <img src={doctor.imageSrc} alt={doctor.name} className={styles.doctorImage} />
          <div className={styles.doctorDetails}>
            <h3 className={styles.doctorName}>{doctor.name}</h3>
            <p className={styles.doctorSpeciality}>{doctor.speciality}</p>
            <p className={styles.doctorLocation}><MapPin size={14} className={styles.locationIcon} /> {doctor.location}</p>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>Date & Time</h4>
            <button className={styles.editButton} onClick={handleEditAppointment}>Edit</button>
          </div>
          <p className={styles.detailText}>{selectedDate} at {selectedTime}</p>
          <h4 className={styles.cardTitle}>Visit reason</h4>
          <p className={styles.detailText}>{visitReason}</p>
        </div>

        <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>Patient</h4>
                <button className={styles.editButton} onClick={() => setIsEditingPatient(!isEditingPatient)}>
                    {isEditingPatient ? 'Save' : 'Edit'}
                </button>
            </div>
            {isEditingPatient ? (
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className={styles.patientNameInput} autoFocus />
            ) : (
                <p className={styles.detailText}>{patientName}</p>
            )}
        </div>

        <div className={styles.buttonContainer}>
          <button 
            className={styles.bookButton} 
            onClick={handleBookAppointment}
            disabled={isBooking}
          >
            {isBooking ? 'Booking...' : (session ? 'Book Appointment' : 'Login to Book')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirm;