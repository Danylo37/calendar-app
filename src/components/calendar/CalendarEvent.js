import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarProvider';

const CalendarEvent = ({ event, style, onClick }) => {
    const { title, color } = event;
    const [, setIsClicked] = useState(false);
    const { toggleEventForm, editingEvent } = useCalendar();

    const isBeingEdited = editingEvent && (
        editingEvent.id === event.id ||
        (event.originalEventId && editingEvent.id === event.originalEventId)
    );

    const { isSmall, fontSize, isContinuation, ...visibleStyle } = style;

    const eventStyle = {
        ...visibleStyle,
        backgroundColor: color.background,
        borderColor: color.border,
        position: 'absolute',
        overflow: 'hidden',
        fontSize: fontSize,
        padding: isSmall ? '0 6px' : '4px 8px',
        zIndex: isBeingEdited ? 100 : style.zIndex
    };

    const handleMouseLeave = () => {
        setIsClicked(false);
    };

    const handleEventClick = (e) => {
        e.stopPropagation();
        setIsClicked(true);

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
                date: event.originalDate || event.date,
            }
            : event;

        toggleEventForm(eventPosition, editEvent);

        if (onClick) {
            onClick(e);
        }
    };

    const calculateDurationInMinutes = () => {
        const [startHours, startMinutes] = event.startTime.split(':').map(Number);
        const [endHours, endMinutes] = event.endTime.split(':').map(Number);

        let startTotalMinutes = startHours * 60 + startMinutes;
        let endTotalMinutes = endHours * 60 + endMinutes;

        if (endTotalMinutes <= startTotalMinutes) {
            endTotalMinutes += 24 * 60;
        }

        return endTotalMinutes - startTotalMinutes;
    };

    const eventDuration = calculateDurationInMinutes();
    const shouldShowDescription = !isSmall && parseInt(style.width) >= 60 && eventDuration >= 30 && event.description;
    const useCompactLayout = isSmall || parseInt(style.width) < 60;

    const timeFormat = `${event.startTime} - ${event.endTime}`;

    const getDescriptionStyle = () => {
        const heightPx = parseFloat(style.height);
        const titleTimeHeight = 40;
        const maxLines = Math.max(1, Math.floor((heightPx - titleTimeHeight) / 16));

        return {
            maxHeight: `${heightPx - titleTimeHeight}px`,
            WebkitLineClamp: maxLines
        };
    };

    return (
        <div
            className="calendar-event"
            style={eventStyle}
            onClick={handleEventClick}
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
                    {shouldShowDescription && (
                        <div className="event-description" style={getDescriptionStyle()}>
                            {event.description}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CalendarEvent;