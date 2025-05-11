import { useMemo, useCallback } from 'react';
import { format } from 'date-fns';

export const useCalendarUtils = () => {
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            slots.push(hour);
        }
        return slots;
    }, []);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimePosition = currentHour + (currentMinute / 60);

    const isToday = useCallback((day) => {
        return format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    }, []);

    const formatHour = useCallback((hour) => {
        return hour.toString().padStart(2, '0') + ':00';
    }, []);

    return {
        timeSlots,
        now,
        currentHour,
        currentMinute,
        currentTimePosition,
        isToday,
        formatHour
    };
};