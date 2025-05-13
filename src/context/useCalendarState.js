import { useState } from 'react';
import { format } from 'date-fns';

export const useCalendarState = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('Week');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

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
        handleSelectTimeSlot,
        selectedTimeSlot
    };
};