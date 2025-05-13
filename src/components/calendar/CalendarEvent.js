import React from 'react';

const CalendarEvent = ({ event, onClick }) => {
    const { title, color } = event;

    return (
        <div
            className="calendar-event"
            style={{
                backgroundColor: color.background,
                borderColor: color.border
            }}
            onClick={onClick}
        >
            <div className="event-title">{title}</div>
        </div>
    );
};

export default CalendarEvent;