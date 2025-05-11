import React, { createContext, useState, useContext } from 'react';

const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('Week');

    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [eventButtonPosition, setEventButtonPosition] = useState(null);
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    const closeAllUIElementsExcept = (elementToKeepOpen) => {
        if (elementToKeepOpen !== 'eventForm') setIsEventFormOpen(false);
        if (elementToKeepOpen !== 'viewDropdown') setIsViewDropdownOpen(false);
        if (elementToKeepOpen !== 'categoryMenu') setIsCategoryMenuOpen(false);
    };

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

    const toggleEventForm = (buttonPosition = null) => {
        if (!isEventFormOpen && buttonPosition) {
            setEventButtonPosition(buttonPosition);
        }
        const newState = !isEventFormOpen;
        if (newState) {
            closeAllUIElementsExcept('eventForm');
        }
        setIsEventFormOpen(newState);
    };

    const toggleViewDropdown = () => {
        const newState = !isViewDropdownOpen;
        if (newState) {
            closeAllUIElementsExcept('viewDropdown');
        }
        setIsViewDropdownOpen(newState);
    };

    const toggleCategoryMenu = () => {
        const newState = !isCategoryMenuOpen;
        if (newState) {
            closeAllUIElementsExcept('categoryMenu');
        }
        setIsCategoryMenuOpen(newState);
    };

    return (
        <CalendarContext.Provider value={{
            currentDate,
            setCurrentDate,
            viewMode,
            setViewMode,
            goToPrevious,
            goToNext,
            handleSelectTimeSlot,

            isEventFormOpen,
            eventButtonPosition,
            isViewDropdownOpen,
            isCategoryMenuOpen,

            toggleEventForm,
            toggleViewDropdown,
            toggleCategoryMenu,
            closeAllUIElementsExcept
        }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => useContext(CalendarContext);