import React, { useState } from 'react';

const CalendarEvent = ({ event, style, onClick }) => {
    const { title, color } = event;
    const [, setIsHovering] = useState(false);

    const { isSmall, fontSize, ...visibleStyle } = style;

    const eventStyle = {
        ...visibleStyle,
        backgroundColor: color.background,
        borderColor: color.border,
        position: 'absolute',
        overflow: 'hidden',
        fontSize: fontSize,
        padding: isSmall ? '0 6px' : '4px 8px'
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const useCompactLayout = isSmall || parseInt(style.width) < 60;

    const timeFormat = `${event.startTime} - ${event.endTime}`;

    return (
        <div
            className="calendar-event"
            style={eventStyle}
            onClick={(e) => {
                e.stopPropagation();
                onClick && onClick(e);
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {useCompactLayout ? (
                <div className="event-compact">
                    <span className="event-title-compact">{title}</span>
                    <span className="event-time-compact">{timeFormat}</span>
                </div>
            ) : (
                <>
                    <div className="event-title">{title}</div>
                    <div className="event-time">{timeFormat}</div>
                    {event.category && event.category.name && (
                        <div className="event-category">
                            {event.category.name}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CalendarEvent;