import { useState, useEffect, useCallback } from 'react';
import { format, parseISO, addMinutes, isWithinInterval, subMinutes } from 'date-fns';

export const useReminders = (events) => {
    const [activeReminder, setActiveReminder] = useState(null);
    const [dismissedReminders, setDismissedReminders] = useState({});

    const calculateReminderTime = useCallback((event) => {
        if (!event.reminder) return null;

        const eventDate = parseISO(event.date);

        const [hours, minutes] = event.startTime.split(':').map(Number);

        const eventStartTime = new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate(),
            hours,
            minutes,
            0
        );

        let reminderMinutes;
        if (event.reminder.unit === 'hour') {
            reminderMinutes = event.reminder.value * 60;
        } else {
            reminderMinutes = event.reminder.value;
        }

        if (reminderMinutes === 0) {
            return eventStartTime;
        }

        return subMinutes(eventStartTime, reminderMinutes);
    }, []);

    const shouldShowReminder = useCallback((event) => {
        if (!event.reminder) return false;

        if (dismissedReminders[event.id]) return false;

        const reminderTime = calculateReminderTime(event);
        if (!reminderTime) return false;

        const now = new Date();

        return isWithinInterval(now, {
            start: reminderTime,
            end: addMinutes(reminderTime, 1)
        });
    }, [calculateReminderTime, dismissedReminders]);

    const closeReminder = useCallback(() => {
        if (activeReminder) {
            setDismissedReminders(prev => ({
                ...prev,
                [activeReminder.id]: true
            }));

            setActiveReminder(null);
        }
    }, [activeReminder]);

    const resetDismissedReminder = useCallback((eventId) => {
        setDismissedReminders(prev => {
            const newDismissed = {...prev};
            delete newDismissed[eventId];
            return newDismissed;
        });
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            if (activeReminder) return;

            for (const event of events) {
                if (shouldShowReminder(event)) {
                    console.log('Showing reminder for:', event.title);
                    console.log('Reminder time:', format(calculateReminderTime(event), 'HH:mm:ss'));
                    console.log('Current time:', format(new Date(), 'HH:mm:ss'));
                    setActiveReminder(event);
                    break;
                }
            }
        };

        checkReminders();
        const interval = setInterval(checkReminders, 10000);

        return () => clearInterval(interval);
    }, [events, activeReminder, shouldShowReminder, calculateReminderTime]);

    return {
        activeReminder,
        closeReminder,
        resetDismissedReminder
    };
};