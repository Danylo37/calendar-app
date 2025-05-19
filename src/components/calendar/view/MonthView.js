import React, { useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    addDays
} from 'date-fns';
import { useCalendarUtils } from '../../../hooks/useCalendarUtils';
import { useCalendar } from '../../../context/CalendarProvider';
import "../../../styles/view/MonthView.css";

function MonthView({ currentDate, onSelectTimeSlot, isEventFormOpen }) {
    const { isToday } = useCalendarUtils();
    const { getEventsForDay, categories } = useCalendar();

    const monthDays = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }, [currentDate]);

    const weekDays = useMemo(() => {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => {
            const day = addDays(weekStart, i);
            return format(day, 'EEEE');
        });
    }, []);

    const calendarWeeks = useMemo(() => {
        const weeks = [];

        for (let i = 0; i < monthDays.length; i += 7) {
            weeks.push(monthDays.slice(i, i + 7));
        }

        return weeks;
    }, [monthDays]);

    const renderDayEvents = (day) => {
        const dayEvents = getEventsForDay(day, categories);

        const MAX_VISIBLE_EVENTS = 3;
        const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
        const hasMoreEvents = dayEvents.length > MAX_VISIBLE_EVENTS;

        return (
            <>
                {visibleEvents.map(event => (
                    <div
                        key={event.id}
                        className="event"
                        style={{
                            backgroundColor: event.color.background,
                            border: `1px solid ${event.color.border}`
                        }}
                    >
                        {event.title}
                    </div>
                ))}

                {hasMoreEvents && (
                    <div className="more-events">
                        +{dayEvents.length - MAX_VISIBLE_EVENTS} more
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="month-view">
            <div className="month-header">
                <div className="weekdays-header">
                    {weekDays.map(day => (
                        <div key={day} className="weekday">
                            {day}
                        </div>
                    ))}
                </div>
            </div>
            <div className="month-grid">
                {calendarWeeks.map((week, weekIndex) => (
                    <div key={`week-${weekIndex}`} className="week-row">
                        {week.map(day => (
                            <div
                                key={format(day, 'yyyy-MM-dd')}
                                className={`month-day 
                                ${!isSameMonth(day, currentDate) ? 'other-month' : ''} 
                                ${isToday(day) ? 'today' : ''}
                                ${isEventFormOpen ? 'disabled' : ''}`}
                                onClick={(e) => {
                                    if (isEventFormOpen) return;

                                    if (onSelectTimeSlot) {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const cellPosition = {
                                            top: rect.top,
                                            left: rect.left,
                                            width: rect.width,
                                            height: rect.height
                                        };

                                        const now = new Date();
                                        const currentHour = now.getHours();
                                        let hour = 8;

                                        if (isToday(day) && currentHour >= 8 && currentHour < 18) {
                                            hour = currentHour;
                                        }

                                        onSelectTimeSlot(day, hour, cellPosition);
                                    }
                                }}
                            >
                                <div className="day-number">{format(day, 'd')}</div>
                                <div className="day-events">
                                    {renderDayEvents(day)}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MonthView;