import { useState, useCallback } from 'react';

export const useDropdownManagement = () => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
    const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isReminderDropdownOpen, setIsReminderDropdownOpen] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    const closeAllPickers = useCallback(() => {
        setIsDatePickerOpen(false);
        setIsStartTimePickerOpen(false);
        setIsEndTimePickerOpen(false);
        setIsCategoryDropdownOpen(false);
        setIsColorDropdownOpen(false);
        setIsReminderDropdownOpen(false);
        setIsAddingCategory(false);
    }, []);

    const closeOtherDropdowns = useCallback((currentDropdown) => {
        if (currentDropdown !== 'datePicker') setIsDatePickerOpen(false);
        if (currentDropdown !== 'startTimePicker') setIsStartTimePickerOpen(false);
        if (currentDropdown !== 'endTimePicker') setIsEndTimePickerOpen(false);
        if (currentDropdown !== 'category') setIsCategoryDropdownOpen(false);
        if (currentDropdown !== 'color') setIsColorDropdownOpen(false);
        if (currentDropdown !== 'reminder') setIsReminderDropdownOpen(false);
    }, []);

    const toggleDatePicker = useCallback(() => {
        setIsDatePickerOpen(prevState => {
            const newState = !prevState;
            if (newState) {
                closeOtherDropdowns('datePicker');
            }
            return newState;
        });
    }, [closeOtherDropdowns]);

    const toggleStartTimePicker = useCallback(() => {
        setIsStartTimePickerOpen(prevState => {
            const newState = !prevState;
            if (newState) {
                closeOtherDropdowns('startTimePicker');
            }
            return newState;
        });
    }, [closeOtherDropdowns]);

    const toggleEndTimePicker = useCallback(() => {
        setIsEndTimePickerOpen(prevState => {
            const newState = !prevState;
            if (newState) {
                closeOtherDropdowns('endTimePicker');
            }
            return newState;
        });
    }, [closeOtherDropdowns]);

    const toggleCategoryDropdown = useCallback(() => {
        setIsCategoryDropdownOpen(prevState => {
            const newState = !prevState;
            if (newState) {
                closeOtherDropdowns('category');
            }
            if (!newState) {
                setIsAddingCategory(false);
            }
            return newState;
        });
    }, [closeOtherDropdowns]);

    const toggleColorDropdown = useCallback(() => {
        setIsColorDropdownOpen(prevState => {
            const newState = !prevState;
            if (newState) {
                closeOtherDropdowns('color');
            }
            return newState;
        });
    }, [closeOtherDropdowns]);

    const toggleReminderDropdown = useCallback((newState) => {
        setIsReminderDropdownOpen(newState);
        if (newState) {
            closeOtherDropdowns('reminder');
        }
    }, [closeOtherDropdowns]);

    return {
        isDatePickerOpen,
        isStartTimePickerOpen,
        isEndTimePickerOpen,
        isCategoryDropdownOpen,
        isColorDropdownOpen,
        isReminderDropdownOpen,
        isAddingCategory,

        setIsAddingCategory,
        setIsCategoryDropdownOpen,
        setIsColorDropdownOpen,
        setIsReminderDropdownOpen,

        toggleDatePicker,
        toggleStartTimePicker,
        toggleEndTimePicker,
        toggleCategoryDropdown,
        toggleColorDropdown,
        toggleReminderDropdown,

        closeAllPickers,
        closeOtherDropdowns
    };
};

export default useDropdownManagement;