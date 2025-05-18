import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import TimeGrid from '../TimeGrid';
import { useCalendarUtils } from '../../../hooks/useCalendarUtils';
import "../../../styles/view/WeekView.css";

function WeekView({ currentDate, onSelectTimeSlot, isEventFormOpen }) {
    const {
        timeSlots,
        currentHour,
        currentMinute,
        isToday,
        formatHour
    } = useCalendarUtils();

    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    return (
        <div className="week-view">
            <div className="calendar-header">
                <div className="time-column-header"></div>

                <div className="week-days-header">
                    {weekDays.map(day => (
                        <div
                            key={day.toString()}
                            className={`header-item ${isToday(day) ? 'today' : ''}`}
                        >
                            <div className="day-name">{format(day, 'EEEE')}</div>
                            <div className="day-number">{format(day, 'd')}</div>
                        </div>
                    ))}
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
                    weekDays={weekDays}
                    timeSlots={timeSlots}
                    isToday={isToday}
                    currentHour={currentHour}
                    currentMinute={currentMinute}
                    onSelectTimeSlot={onSelectTimeSlot}
                    isEventFormOpen={isEventFormOpen}
                />
            </div>
        </div>
    );
}

export default WeekView;