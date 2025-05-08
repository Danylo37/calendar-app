import React, { useEffect, useState } from 'react';
import '../styles/Calendar.css';
import DayView from './view/DayView';
import WeekView from './view/WeekView';
import MonthView from './view/MonthView';

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('Week');

    const handleSelectTimeSlot = (day, hour) => {
        console.log(`Selected time slot: ${day.toISOString()} at ${hour}:00`);
    };

    useEffect(() => {
        // Code for syncing with Header will be added later
    }, []);

    const renderCalendarView = () => {
        switch (viewMode) {
            case 'Day':
                return <DayView currentDate={currentDate} />;
            case 'Week':
                return <WeekView
                    currentDate={currentDate}
                    onSelectTimeSlot={handleSelectTimeSlot}
                />;
            case 'Month':
                return <MonthView currentDate={currentDate} />;
            default:
                return <WeekView
                    currentDate={currentDate}
                    onSelectTimeSlot={handleSelectTimeSlot}
                />;
        }
    };

    return (
        <div className="calendar-container">
            {renderCalendarView()}
        </div>
    );
}

export default Calendar;