import React, { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import '../../../styles/TimePicker.css';

const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            slots.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return slots;
};

const timeSlots = generateTimeSlots();

const TimePicker = ({ selectedTime, onTimeChange, isOpen, onClose, comparisonTime, isEndTime, pickerRef }) => {
    const timeSlotsContainerRef = useRef(null);
    const selectedTimeRef = useRef(null);
    const localContainerRef = useRef(null);

    const containerRef = pickerRef || localContainerRef;

    useEffect(() => {
        if (isOpen && selectedTimeRef.current && timeSlotsContainerRef.current) {
            setTimeout(() => {
                selectedTimeRef.current.scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                });
            }, 50);
        }
    }, [isOpen, selectedTime]);

    if (!isOpen) return null;

    const handleTimeSelection = (time) => {
        onTimeChange(time);
        onClose();
    };

    const isTimeEarlierOrEqual = (time, comparison) => {
        if (!comparison || !isEndTime) return false;

        const [timeHours, timeMinutes] = time.split(':').map(Number);
        const [comparisonHours, comparisonMinutes] = comparison.split(':').map(Number);

        return timeHours < comparisonHours ||
            (timeHours === comparisonHours && timeMinutes <= comparisonMinutes);
    };

    return (
        <div className="timepicker-container" ref={containerRef}>
            <div className="timepicker-header">
                <div className="timepicker-title">
                    <Clock size={18} />
                    <span>Select Time</span>
                </div>
            </div>

            <div className="timepicker-content">
                <div className="time-slots-container" ref={timeSlotsContainerRef}>
                    {timeSlots.map(time => (
                        <div
                            key={time}
                            className={`time-slot ${selectedTime === time ? 'time-slot-selected' : ''}`}
                            onClick={() => handleTimeSelection(time)}
                            ref={selectedTime === time ? selectedTimeRef : null}
                        >
                            {time}
                            {isTimeEarlierOrEqual(time, comparisonTime) && (
                                <span className="tomorrow-indicator"> (tomorrow)</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimePicker;