import React, { createContext, useState, useContext } from 'react';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('Week');

    const goToPrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'Day') {
            newDate.setDate(newDate.getDate() - 1);
        } else if (viewMode === 'Week') {
            newDate.setDate(newDate.getDate() - 7);
        } else if (viewMode === 'Month') {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        setCurrentDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'Day') {
            newDate.setDate(newDate.getDate() + 1);
        } else if (viewMode === 'Week') {
            newDate.setDate(newDate.getDate() + 7);
        } else if (viewMode === 'Month') {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const handleSelectTimeSlot = (day, hour) => {
        // Will be implemented later to manage the events
    };

    return (
        <CalendarContext.Provider value={{
            currentDate,
            setCurrentDate,
            viewMode,
            setViewMode,
            goToPrevious,
            goToNext,
            handleSelectTimeSlot
        }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => useContext(CalendarContext);