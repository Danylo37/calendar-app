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

    const updateEvent = (eventData) => {
        if (!eventData.id) {
            console.error('Cannot update event without ID');
            return null;
        }

        const startHours = parseInt(eventData.startTime.split(':')[0], 10);
        const startMinutes = parseInt(eventData.startTime.split(':')[1], 10);
        const endHours = parseInt(eventData.endTime.split(':')[0], 10);
        const endMinutes = parseInt(eventData.endTime.split(':')[1], 10);

        let updatedEndTime = eventData.endTime;
        if (endHours < startHours || (endHours === startHours && endMinutes <= startMinutes)) {
            const newEndHours = startHours + 1;
            updatedEndTime = `${newEndHours < 10 ? '0' + newEndHours : newEndHours}:${startMinutes < 10 ? '0' + startMinutes : startMinutes}`;
        }

        const updatedEvent = {
            ...eventData,
            endTime: updatedEndTime
        };

        setEvents(prevEvents =>
            prevEvents.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );

        return updatedEvent;
    };

    const getEventsForDay = (date, categories = []) => {
        const dateString = format(date, 'yyyy-MM-dd');
        const dayEvents = events.filter(event => event.date === dateString);

        if (!categories || categories.length === 0) {
            return dayEvents;
        }

        const selectedCategoryIds = new Set(
            categories
                .filter(category => category.selected)
                .map(category => category.id)
        );

        if (selectedCategoryIds.size === 0) {
            return dayEvents.filter(event => !event.category);
        }

        return dayEvents.filter(event =>
            !event.category ||
            selectedCategoryIds.has(event.category.id)
        );
    };

    const removeEvent = (id) => {
        setEvents(prevEvents =>
            prevEvents.filter(event => event.id !== id)
        );
    };

    const updateEventsAfterCategoryDelete = (categoryId) => {
        setEvents(prevEvents =>
            prevEvents.map(event => {
                if (event.category && event.category.id === categoryId) {
                    return { ...event, category: null };
                }
                return event;
            })
        );
    };

    return {
        events,
        setEvents,
        addEvent,
        updateEvent,
        getEventsForDay,
        removeEvent,
        updateEventsAfterCategoryDelete
    };
};