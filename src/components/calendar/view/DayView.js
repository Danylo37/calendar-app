import React, { useMemo } from 'react';
import { format } from 'date-fns';
import TimeGrid from '../TimeGrid';
import { useCalendarUtils } from '../../../hooks/useCalendarUtils';
import "../../../styles/view/DayView.css";

function DayView({ currentDate, onSelectTimeSlot, isEventFormOpen }) {
    const {
        timeSlots,
        currentHour,
        currentMinute,
        isToday,
        formatHour
    } = useCalendarUtils();

    const dayArray = useMemo(() => [currentDate], [currentDate]);

    const isTodayDate = isToday(currentDate);

    return (
        <div className="day-view">
            <div className="calendar-header">
                <div className="time-column-header"></div>

                <div className="header-content">
                    <div
                        className={`header-item ${isTodayDate ? 'today' : ''}`}
                    >
                        <div className="day-name">{format(currentDate, 'EEEE')}</div>
                        <div className="day-number">{format(currentDate, 'd')}</div>
                    </div>
                </div>
            </div>

            <div className="grid-container">
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
                    onSelectTimeSlot={onSelectTimeSlot || (() => {})}
                    isEventFormOpen={isEventFormOpen}
                />
            </div>
        </div>
    );
}

export default DayView;