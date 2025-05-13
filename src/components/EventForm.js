import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/EventForm.css';
import { ChevronDown, X, Calendar, Clock } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { format } from 'date-fns';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const EventForm = ({ isOpen, onClose, triggerPosition }) => {
    const formRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateInputValue, setDateInputValue] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const [startTimeValue, setStartTimeValue] = useState('09:00');
    const [endTimeValue, setEndTimeValue] = useState('10:00');
    const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
    const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

    const dateInputRef = useRef(null);
    const startTimeInputRef = useRef(null);
    const endTimeInputRef = useRef(null);

    const { closeAllUIElementsExcept } = useCalendar() || { closeAllUIElementsExcept: () => {} };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDateInputValue(format(date, 'dd/MM/yyyy'));
    };

    const handleDateInputChange = (e) => {
        const value = e.target.value;
        setDateInputValue(value);

        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = value.match(dateRegex);

        if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1;
            const year = parseInt(match[3], 10);

            const newDate = new Date(year, month, day);
            if (
                newDate.getDate() === day &&
                newDate.getMonth() === month &&
                newDate.getFullYear() === year &&
                year >= 1900 && year <= 2100
            ) {
                setSelectedDate(newDate);
            }
        }
    };

    const handleTimeInputChange = (e, setTimeValue) => {
        const value = e.target.value;
        setTimeValue(value);

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (timeRegex.test(value)) {
            // Valid time format
        }
    };

    const handleStartTimeChange = (time) => {
        setStartTimeValue(time);
    };

    const handleEndTimeChange = (time) => {
        setEndTimeValue(time);
    };

    const closeAllPickers = () => {
        setIsDatePickerOpen(false);
        setIsStartTimePickerOpen(false);
        setIsEndTimePickerOpen(false);
    };

    useEffect(() => {
        if (isOpen && formRef.current && triggerPosition) {
            const xPos = triggerPosition.left;
            const yPos = triggerPosition.top + triggerPosition.height + 10;

            setPosition({ x: xPos, y: yPos });

            formRef.current.style.transformOrigin = `top left`;
        }
    }, [isOpen, triggerPosition]);

    useEffect(() => {
        if (formRef.current) {
            formRef.current.style.left = `${position.x}px`;
            formRef.current.style.top = `${position.y}px`;
        }
    }, [position]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && formRef.current && !formRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleMouseDown = useCallback((e) => {
        if (e.target.closest('.form-header')) {
            setIsDragging(true);

            const rect = formRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });

            e.preventDefault();
            e.stopPropagation();

            closeAllUIElementsExcept('eventForm');
            closeAllPickers();
        }
    }, [closeAllUIElementsExcept]);

    const handleMouseMove = useCallback((e) => {
        if (isDragging && formRef.current) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            setPosition({ x: newX, y: newY });
        }
    }, [isDragging, dragOffset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        if (isStartTimePickerOpen) {
            setIsEndTimePickerOpen(false);
            setIsDatePickerOpen(false);
        }
    }, [isStartTimePickerOpen]);

    useEffect(() => {
        if (isEndTimePickerOpen) {
            setIsStartTimePickerOpen(false);
            setIsDatePickerOpen(false);
        }
    }, [isEndTimePickerOpen]);

    useEffect(() => {
        if (isDatePickerOpen) {
            setIsStartTimePickerOpen(false);
            setIsEndTimePickerOpen(false);
        }
    }, [isDatePickerOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={formRef}
            className={`event-form ${isOpen ? 'active' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            <div className="form-header" onMouseDown={handleMouseDown}>
                <div className="drag-handle-container">
                    <div className="drag-handle"></div>
                </div>
                <button className="close-btn" onClick={onClose}>
                    <X size={26} />
                </button>
            </div>

            <input
                type="text"
                className="event-form-title"
                placeholder="Add title"
            />

            <div className="event-form-row date-time-row">
                <div className="date-input-container">
                    <input
                        type="text"
                        className="event-form-input date-input"
                        placeholder="DD/MM/YYYY"
                        value={dateInputValue}
                        onChange={handleDateInputChange}
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        ref={dateInputRef}
                    />
                    <button
                        className="calendar-icon-button"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    >
                        <Calendar size={16} />
                    </button>
                    <DatePicker
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        isOpen={isDatePickerOpen}
                        onClose={() => setIsDatePickerOpen(false)}
                    />
                </div>

                <div className="time-selection-group">
                    <div className="time-input-container">
                        <input
                            type="text"
                            className="event-form-input time-input"
                            placeholder="HH:MM"
                            value={startTimeValue}
                            onChange={(e) => handleTimeInputChange(e, setStartTimeValue)}
                            onClick={() => setIsStartTimePickerOpen(!isStartTimePickerOpen)}
                            ref={startTimeInputRef}
                        />
                        <button
                            className="time-icon-button"
                            onClick={() => setIsStartTimePickerOpen(!isStartTimePickerOpen)}
                        >
                            <Clock size={14} />
                        </button>
                        <TimePicker
                            selectedTime={startTimeValue}
                            onTimeChange={handleStartTimeChange}
                            isOpen={isStartTimePickerOpen}
                            onClose={() => setIsStartTimePickerOpen(false)}
                        />
                    </div>

                    <span className="time-separator">—</span>

                    <div className="time-input-container">
                        <input
                            type="text"
                            className="event-form-input time-input"
                            placeholder="HH:MM"
                            value={endTimeValue}
                            onChange={(e) => handleTimeInputChange(e, setEndTimeValue)}
                            onClick={() => setIsEndTimePickerOpen(!isEndTimePickerOpen)}
                            ref={endTimeInputRef}
                        />
                        <button
                            className="time-icon-button"
                            onClick={() => setIsEndTimePickerOpen(!isEndTimePickerOpen)}
                        >
                            <Clock size={14} />
                        </button>
                        <TimePicker
                            selectedTime={endTimeValue}
                            onTimeChange={handleEndTimeChange}
                            isOpen={isEndTimePickerOpen}
                            onClose={() => setIsEndTimePickerOpen(false)}
                        />
                    </div>
                </div>
            </div>

            <div className="event-form-row">
                <div className="event-form-input dropdown-field">
                    <span className="dropdown-text">Category</span>
                    <ChevronDown size={14} />
                </div>
                <div className="event-form-input dropdown-field">
                    <div className="color-indicator"></div>
                    <ChevronDown size={14} />
                </div>
                <div className="event-form-input dropdown-field">
                    <span className="dropdown-text">Reminder</span>
                    <ChevronDown size={14} />
                </div>
            </div>

            <div className="event-form-row">
                <textarea
                    className="description-input"
                    placeholder="Description"
                ></textarea>
            </div>

            <div className="form-actions">
                <button className="add-button" onClick={onClose}>
                    Add event
                </button>
            </div>
        </div>
    );
};

export default EventForm;