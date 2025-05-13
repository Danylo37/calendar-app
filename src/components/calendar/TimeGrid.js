import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from '../../context/CalendarProvider';
import CalendarEvent from './CalendarEvent';

function TimeGrid({ weekDays, timeSlots, isToday, currentHour, currentMinute, onSelectTimeSlot }) {
    const currentTimePosition = currentHour + (currentMinute / 60);
    const { getEventsForDay } = useCalendar();

    return (
        <div className="time-grid">
            {weekDays.map(day => {
                const dayEvents = getEventsForDay(day);

                return (
                    <div
                        key={day.toString()}
                        className={`day-column ${isToday(day) ? 'today-column' : ''}`}
                    >
                        {timeSlots.map(hour => {
                            // Filter events that belong to this hour
                            const hourEvents = dayEvents.filter(event => {
                                const eventHour = parseInt(event.startTime.split(':')[0], 10);
                                return eventHour === hour;
                            });

                            return (
                                <div
                                    key={`${day}-${hour}`}
                                    className={`time-cell ${hour === 0 ? 'midnight-cell' : ''}`}
                                    onClick={() => onSelectTimeSlot && onSelectTimeSlot(day, hour)}
                                >
                                    {isToday(day) && hour === Math.floor(currentTimePosition) && (
                                        <div
                                            className="current-time-indicator"
                                            style={{ top: `${(currentTimePosition - hour) * 100}%` }}
                                        ></div>
                                    )}

                                    {hourEvents.map(event => (
                                        <CalendarEvent
                                            key={event.id}
                                            event={event}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle event click (edit/view event)
                                            }}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default TimeGrid;