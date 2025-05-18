import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '../utils/localStorage';

export const useCalendarState = () => {
    const [viewMode, setViewMode] = useState(() => {
        return loadFromLocalStorage(STORAGE_KEYS.VIEW_MODE, 'Week');
    });

    const [currentDate, setCurrentDate] = useState(() => {
        const savedDate = loadFromLocalStorage(STORAGE_KEYS.CURRENT_DATE, null);
        return savedDate ? new Date(savedDate) : new Date();
    });

    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.VIEW_MODE, viewMode);
    }, [viewMode]);

    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.CURRENT_DATE, currentDate.toISOString());
    }, [currentDate]);

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

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleSelectTimeSlot = (day, hour) => {
        const formattedDate = format(day, 'yyyy-MM-dd');

        const startHour = hour < 10 ? `0${hour}` : `${hour}`;
        const nextHour = (hour + 1) % 24;
        const endHour = nextHour < 10 ? `0${nextHour}` : `${nextHour}`;

        const startTime = `${startHour}:00`;
        const endTime = `${endHour}:00`;

        setSelectedTimeSlot({
            date: formattedDate,
            day: day,
            hour: hour,
            startTime: startTime,
            endTime: endTime
        });
    };

    return {
        currentDate,
        setCurrentDate,
        viewMode,
        setViewMode,
        goToPrevious,
        goToNext,
        goToToday,
        handleSelectTimeSlot,
        selectedTimeSlot
    };
};