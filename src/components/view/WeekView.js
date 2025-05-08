import React, { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import TimeGrid from '../TimeGrid';
import "../../styles/view/WeekView.css";

function WeekView({ currentDate, onSelectTimeSlot }) {
    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

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

    return (
        <div className="week-view">
            <div className="week-header">
                <div className="time-column-header"></div>

                <div className="week-days-header">
                    {weekDays.map(day => (
                        <div
                            key={day.toString()}
                            className={`day-header ${isToday(day) ? 'today' : ''}`}
                        >
                            <div className="day-name">{format(day, 'EEEE')}</div>
                            <div className="day-number">{format(day, 'd')}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="week-grid-container">
                <div className="time-column">
                    {timeSlots.map(hour => (
                        <div key={`time-${hour}`} className="time-slot-label">
                            {`${hour}:00`}
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
                />
            </div>
        </div>
    );
}

export default WeekView;