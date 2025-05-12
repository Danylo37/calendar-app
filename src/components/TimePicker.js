import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import '../styles/TimePicker.css';

const TimePicker = ({ selectedTime, onTimeChange, isOpen, onClose }) => {
    const [timeInputValue, setTimeInputValue] = useState(selectedTime || '');
    const timePickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                timePickerRef.current &&
                !timePickerRef.current.contains(event.target) &&
                !event.target.classList.contains('time-input')
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (selectedTime && selectedTime !== timeInputValue) {
            setTimeInputValue(selectedTime);
        }
    }, [selectedTime]);

    const handleTimeSelection = (time) => {
        onTimeChange(time);
        setTimeInputValue(time);
        onClose();
    };

    // Generate time slots with 15-minute intervals (00:00 to 23:45)
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

    if (!isOpen) return null;

    return (
        <div className="timepicker-container" ref={timePickerRef}>
            <div className="timepicker-header">
                <div className="timepicker-title">
                    <Clock size={18} />
                    <span>Select Time</span>
                </div>
            </div>

            <div className="timepicker-content">
                <div className="time-slots-container">
                    {timeSlots.map(time => (
                        <div
                            key={time}
                            className={`time-slot ${timeInputValue === time ? 'time-slot-selected' : ''}`}
                            onClick={() => handleTimeSelection(time)}
                        >
                            {time}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimePicker;