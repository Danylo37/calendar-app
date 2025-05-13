import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/EventForm.css';
import { ChevronDown, X, Calendar, Clock, Plus, Briefcase, Home, Heart, Book, Coffee, Utensils, Plane, Users, Dumbbell, Film, Music, ShoppingBag, GraduationCap } from 'lucide-react';
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

    // Time picker states
    const [startTimeValue, setStartTimeValue] = useState('09:00');
    const [endTimeValue, setEndTimeValue] = useState('10:00');
    const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
    const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

    // Category states
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Briefcase');

    const categoryDropdownRef = useRef(null);

    const dateInputRef = useRef(null);
    const startTimeInputRef = useRef(null);
    const endTimeInputRef = useRef(null);

    const {
        closeAllUIElementsExcept,
        // Using global categories
        categories,
        addCategory
    } = useCalendar();

    const availableIcons = [
        { name: 'Briefcase', component: Briefcase },
        { name: 'Home', component: Home },
        { name: 'Heart', component: Heart },
        { name: 'Book', component: Book },
        { name: 'Coffee', component: Coffee },
        { name: 'Utensils', component: Utensils },
        { name: 'Plane', component: Plane },
        { name: 'Users', component: Users },
        { name: 'Dumbbell', component: Dumbbell },
        { name: 'Film', component: Film },
        { name: 'Music', component: Music },
        { name: 'ShoppingBag', component: ShoppingBag },
        { name: 'GraduationCap', component: GraduationCap }
    ];

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
        setIsCategoryDropdownOpen(false);
    };

    // Category functions
    const toggleCategoryDropdown = () => {
        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
        if (!isCategoryDropdownOpen) {
            setIsAddingCategory(false);
        }
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setIsCategoryDropdownOpen(false);
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            // Use the global addCategory function
            const newCategory = addCategory(newCategoryName, selectedIcon);
            setSelectedCategory(newCategory);
            setNewCategoryName('');
            setIsAddingCategory(false);
            setSelectedIcon('Briefcase');
            setIsCategoryDropdownOpen(false);
        }
    };

    const getIconComponent = (iconName, size = 16) => {
        const icon = availableIcons
            .find(icon => icon.name === iconName);
        if (icon) {
            const IconComponent = icon.component;
            return <IconComponent size={size} />;
        }
        return <Briefcase size={size} />;
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

            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
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

    // Make sure only one picker is open at a time
    useEffect(() => {
        if (isStartTimePickerOpen) {
            setIsEndTimePickerOpen(false);
            setIsDatePickerOpen(false);
            setIsCategoryDropdownOpen(false);
        }
    }, [isStartTimePickerOpen]);

    useEffect(() => {
        if (isEndTimePickerOpen) {
            setIsStartTimePickerOpen(false);
            setIsDatePickerOpen(false);
            setIsCategoryDropdownOpen(false);
        }
    }, [isEndTimePickerOpen]);

    useEffect(() => {
        if (isDatePickerOpen) {
            setIsStartTimePickerOpen(false);
            setIsEndTimePickerOpen(false);
            setIsCategoryDropdownOpen(false);
        }
    }, [isDatePickerOpen]);

    useEffect(() => {
        if (isCategoryDropdownOpen) {
            setIsStartTimePickerOpen(false);
            setIsEndTimePickerOpen(false);
            setIsDatePickerOpen(false);
        }
    }, [isCategoryDropdownOpen]);

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
                <div className="category-dropdown-container" ref={categoryDropdownRef}>
                    <div
                        className="event-form-input dropdown-field category-selector"
                        onClick={toggleCategoryDropdown}
                    >
                        {selectedCategory ? (
                            <>
                                <div className="selected-category">
                                    <div className="category-icon">
                                        {getIconComponent(selectedCategory.icon)}
                                    </div>
                                    <span className="dropdown-text">{selectedCategory.name}</span>
                                </div>
                            </>
                        ) : (
                            <span className="dropdown-text">Category</span>
                        )}
                        <ChevronDown
                            size={14}
                            className={isCategoryDropdownOpen ? 'chevron-rotated' : ''}
                        />
                    </div>

                    {isCategoryDropdownOpen && (
                        <div className="category-dropdown">
                            <div className="category-list">
                                {categories.map(category => (
                                    <div
                                        key={category.id}
                                        className={`category-item ${selectedCategory && selectedCategory.id === category.id ? 'category-selected' : ''}`}
                                        onClick={() => handleSelectCategory(category)}
                                    >
                                        <div className="category-icon">
                                            {getIconComponent(category.icon)}
                                        </div>
                                        <span className="category-name">{category.name}</span>
                                    </div>
                                ))}
                            </div>

                            {isAddingCategory ? (
                                <div className="add-category-form">
                                    <input
                                        type="text"
                                        placeholder="Category name"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="category-input"
                                        autoFocus
                                    />

                                    <div className="icon-selector">
                                        {availableIcons.map(icon => {
                                            const IconComponent = icon.component;
                                            return (
                                                <div
                                                    key={icon.name}
                                                    className={`icon-option ${selectedIcon === icon.name ? 'selected' : ''}`}
                                                    onClick={() => setSelectedIcon(icon.name)}
                                                >
                                                    <IconComponent size={20} />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="form-actions category-actions">
                                        <button
                                            className="cancel-btn"
                                            onClick={() => setIsAddingCategory(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="save-btn"
                                            onClick={handleAddCategory}
                                            disabled={!newCategoryName.trim()}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="add-category-btn"
                                    onClick={() => setIsAddingCategory(true)}
                                >
                                    <Plus size={16} />
                                    <span>Add Category</span>
                                </button>
                            )}
                        </div>
                    )}
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