import React from 'react';
import { useCalendar } from '../../context/CalendarProvider';
import DayView from './view/DayView';
import WeekView from './view/WeekView';
import MonthView from './view/MonthView';
import { format } from 'date-fns';
import '../../styles/Calendar.css';

function Calendar() {
    const {
        currentDate,
        viewMode,
        handleSelectTimeSlot,
        toggleEventForm,
        isEventFormOpen
    } = useCalendar();

    const handleTimeSlotClick = (day, hour, cellPosition) => {
        if (isEventFormOpen) return;

        const formattedDate = format(day, 'yyyy-MM-dd');

        const startHour = hour < 10 ? `0${hour}` : `${hour}`;
        const nextHour = (hour + 1) % 24;
        const endHour = nextHour < 10 ? `0${nextHour}` : `${nextHour}`;

        const startTime = `${startHour}:00`;
        const endTime = `${endHour}:00`;

        const timeSlotData = {
            date: formattedDate,
            day: day,
            hour: hour,
            startTime: startTime,
            endTime: endTime
        };

        handleSelectTimeSlot(day, hour);

        toggleEventForm(cellPosition, null, timeSlotData);
    };

    const renderCalendarView = () => {
        switch (viewMode) {
            case 'Day':
                return (
                    <DayView
                        currentDate={currentDate}
                        onSelectTimeSlot={handleTimeSlotClick}
                        isEventFormOpen={isEventFormOpen}
                    />
                );
            case 'Week':
                return (
                    <WeekView
                        currentDate={currentDate}
                        onSelectTimeSlot={handleTimeSlotClick}
                        isEventFormOpen={isEventFormOpen}
                    />
                );
            case 'Month':
                return (
                    <MonthView
                        currentDate={currentDate}
                        onSelectTimeSlot={handleTimeSlotClick}
                        isEventFormOpen={isEventFormOpen}
                    />
                );
            default:
                return (
                    <WeekView
                        currentDate={currentDate}
                        onSelectTimeSlot={handleTimeSlotClick}
                        isEventFormOpen={isEventFormOpen}
                    />
                );
        }
    };

    return (
        <div className={`calendar-container ${isEventFormOpen ? 'form-open' : ''}`}>
            {renderCalendarView()}
        </div>
    );
}

export default Calendar;