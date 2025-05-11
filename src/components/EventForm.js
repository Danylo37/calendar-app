import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/EventForm.css';
import { ChevronDown, X, Calendar } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { format } from 'date-fns';
import DatePicker from './DatePicker';

const EventForm = ({ isOpen, onClose, triggerPosition }) => {
    const formRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateInputValue, setDateInputValue] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const dateInputRef = useRef(null);

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

            // Проверка на валидность даты
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
                <input
                    type="text"
                    className="event-form-input time-input"
                    placeholder="HH:MM"
                />
                <span className="time-separator">—</span>
                <input
                    type="text"
                    className="event-form-input time-input"
                    placeholder="HH:MM"
                />
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