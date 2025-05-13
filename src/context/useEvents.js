import { useState } from 'react';
import { format } from 'date-fns';

export const useEvents = () => {
    const [events, setEvents] = useState([]);

    const addEvent = (eventData) => {
        const newEvent = {
            id: Date.now(),
            title: eventData.title,
            date: eventData.date,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            category: eventData.category,
            color: eventData.color,
            description: eventData.description,
            reminder: eventData.reminder
        };

        const startHours = parseInt(newEvent.startTime.split(':')[0], 10);
        const startMinutes = parseInt(newEvent.startTime.split(':')[1], 10);
        const endHours = parseInt(newEvent.endTime.split(':')[0], 10);
        const endMinutes = parseInt(newEvent.endTime.split(':')[1], 10);

        if (endHours < startHours || (endHours === startHours && endMinutes <= startMinutes)) {
            const newEndHours = startHours + 1;
            newEvent.endTime = `${newEndHours < 10 ? '0' + newEndHours : newEndHours}:${startMinutes < 10 ? '0' + startMinutes : startMinutes}`;
        }

        setEvents(prevEvents => [...prevEvents, newEvent]);
        return newEvent;
    };

    const getEventsForDay = (date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        return events.filter(event => event.date === dateString);
    };

    const removeEvent = (id) => {
        setEvents(prevEvents =>
            prevEvents.filter(event => event.id !== id)
        );
    };

    return {
        events,
        addEvent,
        getEventsForDay,
        removeEvent
    };
};