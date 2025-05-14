import { useState } from 'react';
import { format, subDays } from 'date-fns';

export const checkEventCrossesMidnight = (startTime, endTime) => {
    const startHours = parseInt(startTime.split(':')[0], 10);
    const startMinutes = parseInt(startTime.split(':')[1], 10);
    const endHours = parseInt(endTime.split(':')[0], 10);
    const endMinutes = parseInt(endTime.split(':')[1], 10);

    return endHours < startHours ||
        (endHours === startHours && endMinutes < startMinutes) ||
        (endHours === startHours && endMinutes === startMinutes && !(startHours === 0 && startMinutes === 0));
};

export const useEvents = () => {
    const [events, setEvents] = useState([]);

    const addEvent = (eventData) => {
        const crossesMidnight = checkEventCrossesMidnight(eventData.startTime, eventData.endTime);

        const newEvent = {
            id: Date.now(),
            title: eventData.title,
            date: eventData.date,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            category: eventData.category,
            color: eventData.color,
            description: eventData.description,
            reminder: eventData.reminder,
            crossesMidnight: crossesMidnight
        };

        setEvents(prevEvents => [...prevEvents, newEvent]);
        return newEvent;
    };

    const updateEvent = (eventData) => {
        if (!eventData.id) {
            console.error('Cannot update event without ID');
            return null;
        }

        const crossesMidnight = checkEventCrossesMidnight(eventData.startTime, eventData.endTime);

        const updatedEvent = {
            ...eventData,
            crossesMidnight
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
        const previousDay = format(subDays(date, 1), 'yyyy-MM-dd');

        let dayEvents = events.filter(event => event.date === dateString);

        const previousDayEvents = events.filter(event =>
            event.date === previousDay && event.crossesMidnight === true
        );

        const continuationEvents = previousDayEvents.map(event => {
            return {
                ...event,
                isContinuation: true,
                continuationId: `${event.id}-continuation`,
                originalEventId: event.id,
                date: dateString,
            };
        });

        return [...dayEvents, ...continuationEvents].filter(event => {
            if (!categories || categories.length === 0) {
                return true;
            }

            const selectedCategoryIds = new Set(
                categories
                    .filter(category => category.selected)
                    .map(category => category.id)
            );

            if (selectedCategoryIds.size === 0) {
                return !event.category;
            }

            return !event.category || selectedCategoryIds.has(event.category.id);
        });
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
        updateEventsAfterCategoryDelete,
        checkEventCrossesMidnight
    };
};