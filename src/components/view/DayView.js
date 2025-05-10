import React, { useMemo } from 'react';
import { format } from 'date-fns';
import TimeGrid from '../TimeGrid';
import "../../styles/view/DayView.css";

function DayView({ currentDate, onSelectTimeSlot }) {
    const dayArray = useMemo(() => [currentDate], [currentDate]);

    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            slots.push(hour);
        }
        return slots;
    }, []);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const isToday = (day) => {
        return format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    };

    const formatHour = (hour) => {
        return hour.toString().padStart(2, '0') + ':00';
    };

    return (
        <div className="day-view">
            <div className="day-header">
                <div className="time-column-header"></div>

                <div className="day-header-content">
                    <div
                        className={`day-header-item ${isToday(currentDate) ? 'today' : ''}`}
                    >
                        <div className="day-name">{format(currentDate, 'EEEE')}</div>
                        <div className="day-number">{format(currentDate, 'd')}</div>
                    </div>
                </div>
            </div>

            <div className="day-grid-container">
                <div className="time-column">
                    {timeSlots.map(hour => (
                        <div
                            key={`time-${hour}`}
                            className="time-slot-container"
                        >
                            <div className={`time-slot-label ${hour === 0 ? 'hidden' : ''}`}>
                                {hour === 0 ? '' : formatHour(hour)}
                            </div>
                        </div>
                    ))}
                </div>

                <TimeGrid
                    weekDays={dayArray}
                    timeSlots={timeSlots}
                    isToday={isToday}
                    currentHour={currentHour}
                    currentMinute={currentMinute}
                    onSelectTimeSlot={onSelectTimeSlot}
                />
            </div>
        </div>
    );
}

export default DayView;