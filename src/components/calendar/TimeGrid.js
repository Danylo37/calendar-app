import React from 'react';

function TimeGrid({ weekDays, timeSlots, isToday, currentHour, currentMinute, onSelectTimeSlot }) {
    const currentTimePosition = currentHour + (currentMinute / 60);

    return (
        <div className="time-grid">
            {weekDays.map(day => (
                <div
                    key={day.toString()}
                    className={`day-column ${isToday(day) ? 'today-column' : ''}`}
                >
                    {timeSlots.map(hour => (
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
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default TimeGrid;