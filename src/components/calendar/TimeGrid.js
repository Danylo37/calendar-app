import React from 'react';
import { useCalendar } from '../../context/CalendarProvider';
import CalendarEvent from './CalendarEvent';

function TimeGrid({ weekDays, timeSlots, isToday, currentHour, currentMinute, onSelectTimeSlot }) {
    const currentTimePosition = currentHour + (currentMinute / 60);
    const { getEventsForDay, categories } = useCalendar();

    const timeToDecimal = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours + minutes / 60;
    };

    const calculateEventStyle = (event, overlappingEvents) => {
        let startTime;

        if (event.isContinuation) {
            startTime = 0;
        } else {
            startTime = timeToDecimal(event.startTime);
        }

        const endTime = timeToDecimal(event.endTime);

        let adjustedEndTime;
        if (!event.isContinuation && event.crossesMidnight) {
            adjustedEndTime = 24;
        } else {
            adjustedEndTime = endTime;
        }

        if (event.startTime === event.endTime && !event.isContinuation) {
            adjustedEndTime = 24;
        }

        const duration = adjustedEndTime - startTime;
        const heightPercent = Math.max(duration * 100, 20);

        const startHour = Math.floor(startTime);
        const startMinutePercent = (startTime - startHour) * 100;

        const eventIndex = overlappingEvents.findIndex(e =>
            e.id === event.id || (e.continuationId && e.continuationId === event.continuationId)
        );

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
                height: `calc(${heightPercent}% + ${duration}px)`,
                width: '100%',
                left: '0',
                zIndex: 1,
                isSmall: duration < 0.5,
                fontSize: fontSize,
                isContinuation: event.isContinuation
            };
        } else {
            const pixelReduction = eventIndex * 25;

            return {
                top: `${startMinutePercent}%`,
                height: `calc(${heightPercent}% + ${duration}px)`,
                width: `calc(100% - ${pixelReduction}px)`,
                right: '0',
                left: 'auto',
                zIndex: eventIndex + 1,
                isSmall: duration < 0.5,
                fontSize: fontSize,
                isContinuation: event.isContinuation
            };
        }
    };

    const findOverlappingEvents = (events, targetEvent) => {
        const targetStart = targetEvent.isContinuation
            ? 0
            : timeToDecimal(targetEvent.startTime);

        const targetEnd = timeToDecimal(targetEvent.endTime);

        let adjustedTargetEnd;
        if (targetEvent.startTime === targetEvent.endTime && !targetEvent.isContinuation) {
            adjustedTargetEnd = 24;
        } else if (targetEvent.crossesMidnight && !targetEvent.isContinuation) {
            adjustedTargetEnd = 24;
        } else {
            adjustedTargetEnd = targetEnd;
        }

        return events.filter(event => {
            const eventStart = event.isContinuation
                ? 0
                : timeToDecimal(event.startTime);

            const eventEnd = timeToDecimal(event.endTime);

            let adjustedEventEnd;
            if (event.startTime === event.endTime && !event.isContinuation) {
                adjustedEventEnd = 24;
            } else if (event.crossesMidnight && !event.isContinuation) {
                adjustedEventEnd = 24;
            } else {
                adjustedEventEnd = eventEnd;
            }

            return (
                (eventStart < adjustedTargetEnd && adjustedEventEnd > targetStart) ||
                (targetStart < adjustedEventEnd && adjustedTargetEnd > eventStart)
            );
        }).sort((a, b) => {
            const aStart = a.isContinuation ? 0 : timeToDecimal(a.startTime);
            const bStart = b.isContinuation ? 0 : timeToDecimal(b.startTime);

            if (aStart !== bStart) {
                return aStart - bStart;
            }

            return (a.originalEventId || a.id) - (b.originalEventId || b.id);
        });
    };

    return (
        <div className="time-grid">
            {weekDays.map(day => {
                const dayEvents = getEventsForDay(day, categories);

                return (
                    <div
                        key={day.toString()}
                        className={`day-column ${isToday(day) ? 'today-column' : ''}`}
                    >
                        {timeSlots.map(hour => {
                            const cellKey = `${day}-${hour}`;

                            const hourEvents = dayEvents.filter(event => {
                                const startTime = event.isContinuation
                                    ? 0
                                    : timeToDecimal(event.startTime);

                                const endTime = timeToDecimal(event.endTime);

                                let adjustedEndTime;
                                if (event.startTime === event.endTime && !event.isContinuation) {
                                    adjustedEndTime = 24;
                                } else if (event.crossesMidnight && !event.isContinuation) {
                                    adjustedEndTime = 24;
                                } else {
                                    adjustedEndTime = endTime;
                                }

                                const hourStart = hour;
                                const hourEnd = hour + 1;

                                return (startTime < hourEnd && adjustedEndTime > hourStart);
                            });

                            const eventsStartingInThisHour = hourEvents.filter(event => {
                                if (event.isContinuation) {
                                    return hour === 0;
                                }

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

                                        const eventKey = event.continuationId || event.id;

                                        return (
                                            <CalendarEvent
                                                key={eventKey}
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