import React, { createContext, useContext } from 'react';
import { useCalendarState } from './useCalendarState';
import { useUIState } from './useUIState';
import { useCategories } from './useCategories';
import { useEvents } from './useEvents';

const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
    const calendarState = useCalendarState();
    const uiState = useUIState();
    const categoryState = useCategories();
    const eventState = useEvents();

    const value = {
        ...calendarState,
        ...uiState,
        ...categoryState,
        ...eventState
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => useContext(CalendarContext);