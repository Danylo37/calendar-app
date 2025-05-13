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