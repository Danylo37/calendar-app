import React, { useEffect, useRef, useState } from 'react';
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

const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};

const findClosestTime = (targetTime, availableTimeSlots) => {
    if (!targetTime) return null;

    if (availableTimeSlots.includes(targetTime)) {
        return targetTime;
    }

    const targetMinutes = timeToMinutes(targetTime);

    let closestTime = availableTimeSlots[0];
    let minDifference = Math.abs(timeToMinutes(closestTime) - targetMinutes);

    for (const time of availableTimeSlots) {
        const difference = Math.abs(timeToMinutes(time) - targetMinutes);
        if (difference < minDifference) {
            closestTime = time;
            minDifference = difference;
        }
    }

    return closestTime;
};

const TimePicker = ({ selectedTime, onTimeChange, isOpen, onClose, comparisonTime, isEndTime, pickerRef }) => {
    const timeSlotsContainerRef = useRef(null);
    const selectedTimeRef = useRef(null);
    const closestTimeRef = useRef(null);
    const localContainerRef = useRef(null);
    const [isContentReady, setIsContentReady] = useState(false);

    const containerRef = pickerRef || localContainerRef;

    const closestTime = findClosestTime(selectedTime, timeSlots);

    useEffect(() => {
        if (isOpen && timeSlotsContainerRef.current) {
            setIsContentReady(false);

            const index = timeSlots.indexOf(closestTime || selectedTime);
            if (index !== -1) {
                const itemHeight = 36;
                const estimatedPosition = index * itemHeight;

                if (timeSlotsContainerRef.current) {
                    timeSlotsContainerRef.current.scrollTop = estimatedPosition;
                }
            }

            setTimeout(() => {
                setIsContentReady(true);

                setTimeout(() => {
                    try {
                        if (selectedTime && timeSlots.includes(selectedTime) && selectedTimeRef.current) {
                            selectedTimeRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        } else if (closestTime && closestTimeRef.current) {
                            closestTimeRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }
                    } catch (error) {
                        console.log('Error scrolling to time:', error);
                    }
                }, 50);
            }, 10);
        }
    }, [isOpen, selectedTime, closestTime]);

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

    const timeSlotContainerStyle = {
        opacity: isContentReady ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out'
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
                <div
                    className="time-slots-container"
                    ref={timeSlotsContainerRef}
                    style={timeSlotContainerStyle}
                >
                    {timeSlots.map(time => {
                        const isSelected = selectedTime === time;
                        const isClosest = closestTime === time && !isSelected;

                        return (
                            <div
                                key={time}
                                className={`time-slot ${isSelected ? 'time-slot-selected' : ''}`}
                                onClick={() => handleTimeSelection(time)}
                                ref={isSelected ? selectedTimeRef : (isClosest ? closestTimeRef : null)}
                            >
                                {time}
                                {isTimeEarlierOrEqual(time, comparisonTime) && (
                                    <span className="tomorrow-indicator"> (tomorrow)</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimePicker;