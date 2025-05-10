import React from 'react';
import { useCalendar } from '../context/CalendarContext';
import DayView from './view/DayView';
import WeekView from './view/WeekView';
import MonthView from './view/MonthView';
import '../styles/Calendar.css';

function Calendar() {
    const { currentDate, viewMode, handleSelectTimeSlot } = useCalendar();

    const renderCalendarView = () => {
        switch (viewMode) {
            case 'Day':
                return (
                    <DayView
                        currentDate={currentDate}
                        onSelectTimeSlot={handleSelectTimeSlot}
                    />
                );
            case 'Week':
                return (
                    <WeekView
                        currentDate={currentDate}
                        onSelectTimeSlot={handleSelectTimeSlot}
                    />
                );
            case 'Month':
                return (
                    <MonthView
                        currentDate={currentDate}
                    />
                );
            default:
                return (
                    <WeekView
                        currentDate={currentDate}
                        onSelectTimeSlot={handleSelectTimeSlot}
                    />
                );
        }
    };

    return (
        <div className="calendar-container">
            {renderCalendarView()}
        </div>
    );
}

export default Calendar;