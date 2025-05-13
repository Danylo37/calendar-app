import React from 'react';
import { useCalendar } from '../../context/CalendarProvider';
import CalendarEvent from './CalendarEvent';

function TimeGrid({ weekDays, timeSlots, isToday, currentHour, currentMinute, onSelectTimeSlot }) {
    const currentTimePosition = currentHour + (currentMinute / 60);
    const { getEventsForDay } = useCalendar();

    const timeToDecimal = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours + minutes / 60;
    };

    const calculateEventStyle = (event, overlappingEvents) => {
        const startTime = timeToDecimal(event.startTime);
        const endTime = timeToDecimal(event.endTime);
        const duration = endTime - startTime;

        const heightPercent = Math.max(duration * 100, 20);

        const startHour = Math.floor(startTime);
        const startMinutePercent = (startTime - startHour) * 100;

        const eventIndex = overlappingEvents.findIndex(e => e.id === event.id);

        let fontSize;
        if (duration <= 0.20) {
            fontSize = '0.60rem';
        } else if (duration <= 0.5) {
            fontSize = '0.63rem';
        } else {
            fontSize = '0.75rem';
        }

        if (eventIndex === 0) {
            return {
                top: `${startMinutePercent}%`,
                height: `${heightPercent}%`,
                width: '100%',
                left: '0',
                zIndex: 1,
                isSmall: duration < 0.5,
                fontSize: fontSize
            };
        } else {
            const pixelReduction = eventIndex * 25;

            return {
                top: `${startMinutePercent}%`,
                height: `${heightPercent}%`,
                width: `calc(100% - ${pixelReduction}px)`,
                right: '0',
                left: 'auto',
                zIndex: eventIndex + 1,
                isSmall: duration < 0.5,
                fontSize: fontSize
            };
        }
    };

    const findOverlappingEvents = (events, targetEvent) => {
        const targetStart = timeToDecimal(targetEvent.startTime);
        const targetEnd = timeToDecimal(targetEvent.endTime);

        return events.filter(event => {
            const eventStart = timeToDecimal(event.startTime);
            const eventEnd = timeToDecimal(event.endTime);

            return (
                (eventStart < targetEnd && eventEnd > targetStart) ||
                (targetStart < eventEnd && targetEnd > eventStart)
            );
        }).sort((a, b) => {
            const aStart = timeToDecimal(a.startTime);
            const bStart = timeToDecimal(b.startTime);

            if (aStart !== bStart) {
                return aStart - bStart;
            }

            return a.id - b.id;
        });
    };

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
                            const cellKey = `${day}-${hour}`;

                            const hourEvents = dayEvents.filter(event => {
                                const startTime = timeToDecimal(event.startTime);
                                const endTime = timeToDecimal(event.endTime);
                                const hourStart = hour;
                                const hourEnd = hour + 1;

                                return (startTime < hourEnd && endTime > hourStart);
                            });

                            const eventsStartingInThisHour = hourEvents.filter(event => {
                                const startHour = parseInt(event.startTime.split(':')[0], 10);
                                return startHour === hour;
                            });

                            return (
                                <div
                                    key={cellKey}
                                    className={`time-cell ${hour === 0 ? 'midnight-cell' : ''}`}
                                    onClick={() => onSelectTimeSlot && onSelectTimeSlot(day, hour)}
                                >
                                    {isToday(day) && hour === Math.floor(currentTimePosition) && (
                                        <div
                                            className="current-time-indicator"
                                            style={{ top: `${(currentTimePosition - hour) * 100}%` }}
                                        ></div>
                                    )}

                                    {eventsStartingInThisHour.map(event => {
                                        const overlappingEvents = findOverlappingEvents(dayEvents, event);
                                        const eventStyle = calculateEventStyle(event, overlappingEvents);

                                        return (
                                            <CalendarEvent
                                                key={event.id}
                                                event={event}
                                                style={eventStyle}
                                            />
                                        );
                                    })}
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