import { useState } from 'react';

export const useUIState = () => {
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [eventButtonPosition, setEventButtonPosition] = useState(null);
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    const closeAllUIElementsExcept = (elementToKeepOpen) => {
        if (elementToKeepOpen !== 'eventForm') setIsEventFormOpen(false);
        if (elementToKeepOpen !== 'viewDropdown') setIsViewDropdownOpen(false);
        if (elementToKeepOpen !== 'categoryMenu') setIsCategoryMenuOpen(false);
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

    return {
        isEventFormOpen,
        eventButtonPosition,
        isViewDropdownOpen,
        isCategoryMenuOpen,
        toggleEventForm,
        toggleViewDropdown,
        toggleCategoryMenu,
        closeAllUIElementsExcept
    };
};