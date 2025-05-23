import React, { createContext, useContext } from 'react';
import { useCalendarState } from './useCalendarState';
import { useUIState } from './useUIState';
import { useCategories } from './useCategories';
import { useEvents, checkEventCrossesMidnight } from './useEvents';
import { useReminders } from '../hooks/useReminders';

const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
    const calendarState = useCalendarState();
    const uiState = useUIState();
    const categoryState = useCategories();
    const eventState = useEvents();
    const reminderState = useReminders(eventState.events);

    const handleRemoveCategory = (categoryId) => {
        eventState.updateEventsAfterCategoryDelete(categoryId);
        categoryState.removeCategory(categoryId);
    };

    const resetToDefaultCategories = () => {
        const defaultCategoryIds = [1, 2, 3];
        eventState.updateEventsAfterCategoriesReset(defaultCategoryIds);
        categoryState.resetToDefaultCategories();
    };

    const resetReminderForEvent = (eventId) => {
        reminderState.resetDismissedReminder(eventId);
    };

    const value = {
        ...calendarState,
        ...uiState,
        ...categoryState,
        ...eventState,
        ...reminderState,
        removeCategory: handleRemoveCategory,
        resetToDefaultCategories: resetToDefaultCategories,
        resetReminderForEvent,
        checkEventCrossesMidnight,
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => useContext(CalendarContext);