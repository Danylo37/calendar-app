import { useMemo, useCallback, useState, useEffect } from 'react';
import { format } from 'date-fns';

export const useCalendarUtils = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            slots.push(hour);
        }
        return slots;
    }, []);

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimePosition = currentHour + (currentMinute / 60);

    const isToday = useCallback((day) => {
        return format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    }, []);

    const formatHour = useCallback((hour) => {
        return hour.toString().padStart(2, '0') + ':00';
    }, []);

    return {
        timeSlots,
        now: currentTime,
        currentHour,
        currentMinute,
        currentTimePosition,
        isToday,
        formatHour
    };
};