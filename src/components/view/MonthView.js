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
import { useCalendarUtils } from '../../hooks/useCalendarUtils';
import "../../styles/view/MonthView.css";

function MonthView({ currentDate }) {
    const { isToday } = useCalendarUtils();

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
            return format(day, 'EEEE'); // Полное название дня
        });
    }, []);

    const calendarWeeks = useMemo(() => {
        const weeks = [];
        let week = [];

        monthDays.forEach((day, i) => {
            week.push(day);

            if ((i + 1) % 7 === 0 || i === monthDays.length - 1) {
                weeks.push(week);
                week = [];
            }
        });

        return weeks;
    }, [monthDays]);

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
                                className={`month-day ${!isSameMonth(day, currentDate) ? 'other-month' : ''} ${isToday(day) ? 'today' : ''}`}
                            >
                                <div className="day-number">{format(day, 'd')}</div>
                                {/* Rendering day events */}
                                <div className="day-events">
                                    {/* Events placeholder */}
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