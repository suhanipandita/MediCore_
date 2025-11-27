import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './ScheduleAppoinment.module.css';
import { X, MapPin, Calendar, Sun, Moon, Cloud, ChevronDown } from 'react-feather';
// REPLACE mockDoctors with service
import { fetchDoctorById } from '../services/doctorService';
import type{ UIDoctor } from '../services/doctorService';

type Period = 'Morning' | 'Afternoon' | 'Evening';

const ScheduleAppointment: React.FC = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialDate = searchParams.get('date') || '';
  const initialTimeParam = searchParams.get('time');
  const initialReasonParam = searchParams.get('reason');

  // State for Doctor Data
  const [doctor, setDoctor] = useState<UIDoctor | null>(null);
  const [loading, setLoading] = useState(true);

  // State for Interactivity
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Morning');
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTimeParam);
  const [visitReason, setVisitReason] = useState<string>(initialReasonParam || 'Chest Pain');

  // FETCH DATA ON MOUNT
  useEffect(() => {
    const loadDoctor = async () => {
      if (doctorId) {
        setLoading(true);
        const data = await fetchDoctorById(doctorId);
        setDoctor(data);
        setLoading(false);
      }
    };
    loadDoctor();
  }, [doctorId]);

  // Filter Logic
  const dayAvailability = useMemo(() => {
    return doctor?.availability.find((day: any) => day.date === initialDate);
  }, [doctor, initialDate]);

  const allTimeSlots = dayAvailability ? dayAvailability.slots : [];

  const filteredTimeSlots = useMemo(() => {
    return allTimeSlots.filter((slot: any) => slot.period === selectedPeriod);
  }, [allTimeSlots, selectedPeriod]);

  // Select default time
  useEffect(() => {
    if (initialTimeParam && filteredTimeSlots.some((slot: any) => slot.time === initialTimeParam)) {
      setSelectedTime(initialTimeParam);
    } else if (filteredTimeSlots.length > 0) {
      setSelectedTime(filteredTimeSlots[0].time);
    } else {
      setSelectedTime(null);
    }
  }, [selectedPeriod, filteredTimeSlots, initialTimeParam]);

  if (loading) return <div className={styles.loading}>Loading doctor details...</div>;

  if (!doctor || !dayAvailability) {
    return (
      <div className={styles.overlay}>
         <div className={styles.modal}>
           <div className={styles.modalHeader}>
             <h2>Error</h2>
             <button className={styles.closeButton} onClick={() => navigate(-1)}><X size={24} /></button>
           </div>
           <p style={{textAlign:'center', padding:'20px'}}>
             {doctor ? 'No availability found for this date.' : 'Doctor not found.'}
           </p>
         </div>
      </div>
    );
  }

  const handleContinue = () => {
    if (selectedTime) {
      navigate(
        `/review-confirm/${doctor.id}?date=${encodeURIComponent(initialDate)}&time=${encodeURIComponent(selectedTime)}&reason=${encodeURIComponent(visitReason)}`
      );
    } else {
      alert('Please select a time slot.');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Schedule Appointment</h2>
          <button className={styles.closeButton} onClick={() => navigate(-1)}><X size={24} /></button>
        </div>

        {/* Doctor Info */}
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

        {/* Inputs... (Same as your previous code) */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Reason for Visit</h4>
          <div className={styles.selectWrapper}>
            <select className={styles.reasonSelect} value={visitReason} onChange={(e) => setVisitReason(e.target.value)}>
              <option value="Chest Pain">Chest Pain</option>
              <option value="Fever">Fever</option>
              <option value="Headache">Headache</option>
              <option value="Routine Checkup">Routine Checkup</option>
            </select>
            <ChevronDown size={20} className={styles.selectArrow} />
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Appointment Time</h4>
          <div className={styles.datePicker}><span>{initialDate}</span> <Calendar size={20} /></div>
          
          <div className={styles.timeOfDayToggle}>
            {['Morning', 'Afternoon', 'Evening'].map(p => (
                <button 
                    key={p} 
                    className={`${styles.timeOfDayButton} ${selectedPeriod === p ? styles.active : ''}`}
                    onClick={() => setSelectedPeriod(p as Period)}
                >
                    {p === 'Morning' ? <Cloud size={18}/> : p === 'Afternoon' ? <Sun size={18}/> : <Moon size={18}/>} {p}
                </button>
            ))}
          </div>

          <div className={styles.timeSlotsGrid}>
            {filteredTimeSlots.length > 0 ? (
              filteredTimeSlots.map((slot: any) => (
                <button key={slot.time} className={`${styles.timeSlotButton} ${selectedTime === slot.time ? styles.selected : ''}`} onClick={() => setSelectedTime(slot.time)}>
                  {slot.time}
                </button>
              ))
            ) : (
              <p className={styles.noSlotsText}>No slots available.</p>
            )}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.continueButton} disabled={!selectedTime} onClick={handleContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;