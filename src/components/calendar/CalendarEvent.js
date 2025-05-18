import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarProvider';

const CalendarEvent = ({ event, style, onClick }) => {
    const { title, color } = event;
    const [, setIsHovering] = useState(false);
    const { toggleEventForm } = useCalendar();

    const { isSmall, fontSize, isContinuation, ...visibleStyle } = style;

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

    const handleEventClick = (e) => {
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const eventPosition = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };

        const editEvent = event.isContinuation
            ? {
                ...event,
                id: event.originalEventId || event.id,
            }
            : event;

        // Open in view mode when clicking an event
        toggleEventForm(eventPosition, editEvent);

        if (onClick) {
            onClick(e);
        }
    };

    const useCompactLayout = isSmall || parseInt(style.width) < 60;

    const timeFormat = `${event.startTime} - ${event.endTime}`;

    return (
        <div
            className="calendar-event"
            style={eventStyle}
            onClick={handleEventClick}
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