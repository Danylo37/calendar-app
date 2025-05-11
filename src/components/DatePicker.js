import React, { useState, useRef, useEffect } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/DatePicker.css';

const DatePicker = ({ selectedDate, onDateChange, isOpen, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const datePickerRef = useRef(null);

    useEffect(() => {
        if (isOpen && selectedDate) {
            setCurrentMonth(selectedDate);
        }
    }, [isOpen, selectedDate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target) &&
                !event.target.classList.contains('date-input')
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const onDateClick = (day) => {
        onDateChange(day);
        onClose();
    };

    if (!isOpen) return null;

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = 'MMMM yyyy';
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const day = addDays(startDate, i);
        weekDays.push(format(day, 'EEE'));
    }

    const weeks = [];
    let week = [];

    days.forEach((day) => {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    });

    return (
        <div className="datepicker-container" ref={datePickerRef}>
            <div className="datepicker-header">
                <button className="datepicker-month-nav" onClick={prevMonth}>
                    <ChevronLeft size={18} />
                </button>
                <div className="datepicker-current-month">
                    {format(currentMonth, dateFormat)}
                </div>
                <button className="datepicker-month-nav" onClick={nextMonth}>
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="datepicker-days-header">
                {weekDays.map((day, index) => (
                    <div className="datepicker-weekday" key={index}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="datepicker-days-grid">
                {weeks.map((week, weekIndex) => (
                    <div className="datepicker-week" key={weekIndex}>
                        {week.map((day) => {
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isSelectedDay = selectedDate && isSameDay(day, selectedDate);

                            return (
                                <div
                                    className={`datepicker-day ${
                                        !isCurrentMonth ? 'datepicker-other-month' : ''
                                    } ${isSelectedDay ? 'datepicker-selected-day' : ''}`}
                                    key={day.toString()}
                                    onClick={() => onDateClick(day)}
                                >
                                    {format(day, 'd')}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DatePicker;