import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../../styles/EventForm.css';
import { Briefcase } from 'lucide-react';
import { useCalendar } from '../../context/CalendarProvider';
import { format } from 'date-fns';
import MenuHeader from './MenuHeader';
import DateTimeSelector from './date-time/DateTimeSelector';
import CategorySelector from './CategorySelector';
import ColorSelector, { colorOptions } from './ColorSelector';
import EventDescription from './EventDescription';
import MenuFooter from './MenuFooter';
import ReminderSelector from '../reminder/ReminderSelector';
import { availableIcons } from '../../constants/icons';

const Menu = ({ isOpen, onClose, triggerPosition }) => {
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

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Briefcase');

    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(colorOptions[6]);

    const [selectedReminder, setSelectedReminder] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');

    const categoryDropdownRef = useRef(null);
    const colorDropdownRef = useRef(null);
    const dateInputRef = useRef(null);
    const startTimeInputRef = useRef(null);
    const endTimeInputRef = useRef(null);

    const {
        closeAllUIElementsExcept,
        categories,
        addCategory
    } = useCalendar();

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
        setIsColorDropdownOpen(false);
    };

    const closeOtherDropdowns = (currentDropdown) => {
        if (currentDropdown !== 'datePicker') setIsDatePickerOpen(false);
        if (currentDropdown !== 'startTimePicker') setIsStartTimePickerOpen(false);
        if (currentDropdown !== 'endTimePicker') setIsEndTimePickerOpen(false);
        if (currentDropdown !== 'category') setIsCategoryDropdownOpen(false);
        if (currentDropdown !== 'color') setIsColorDropdownOpen(false);
    };

    const toggleCategoryDropdown = () => {
        const newState = !isCategoryDropdownOpen;
        setIsCategoryDropdownOpen(newState);

        if (newState) {
            closeOtherDropdowns('category');
        }

        if (!newState) {
            setIsAddingCategory(false);
        }
    };

    const toggleColorDropdown = () => {
        const newState = !isColorDropdownOpen;
        setIsColorDropdownOpen(newState);

        if (newState) {
            closeOtherDropdowns('color');
        }
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setIsCategoryDropdownOpen(false);
    };

    const handleSelectColor = (color) => {
        setSelectedColor(color);
        setIsColorDropdownOpen(false);
    };

    const handleSelectReminder = (reminder) => {
        setSelectedReminder(reminder);
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory = addCategory(newCategoryName, selectedIcon);
            setSelectedCategory(newCategory);
            setNewCategoryName('');
            setIsAddingCategory(false);
            setSelectedIcon('Briefcase');
            setIsCategoryDropdownOpen(false);
        }
    };

    const getIconComponent = (iconName, size = 16) => {
        const icon = availableIcons.find(icon => icon.name === iconName);
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

    const toggleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen);
        if (!isDatePickerOpen) {
            closeOtherDropdowns('datePicker');
        }
    };

    const toggleStartTimePicker = () => {
        setIsStartTimePickerOpen(!isStartTimePickerOpen);
        if (!isStartTimePickerOpen) {
            closeOtherDropdowns('startTimePicker');
        }
    };

    const toggleEndTimePicker = () => {
        setIsEndTimePickerOpen(!isEndTimePickerOpen);
        if (!isEndTimePickerOpen) {
            closeOtherDropdowns('endTimePicker');
        }
    };

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
            <MenuHeader
                onClose={onClose}
                onMouseDown={handleMouseDown}
            />

            <input
                type="text"
                className="event-form-title"
                placeholder="Add title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <DateTimeSelector
                dateInputValue={dateInputValue}
                handleDateInputChange={handleDateInputChange}
                startTimeValue={startTimeValue}
                endTimeValue={endTimeValue}
                handleTimeInputChange={handleTimeInputChange}
                handleStartTimeChange={handleStartTimeChange}
                handleEndTimeChange={handleEndTimeChange}
                isDatePickerOpen={isDatePickerOpen}
                setIsDatePickerOpen={toggleDatePicker}
                isStartTimePickerOpen={isStartTimePickerOpen}
                setIsStartTimePickerOpen={toggleStartTimePicker}
                isEndTimePickerOpen={isEndTimePickerOpen}
                setIsEndTimePickerOpen={toggleEndTimePicker}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                dateInputRef={dateInputRef}
                startTimeInputRef={startTimeInputRef}
                endTimeInputRef={endTimeInputRef}
                setStartTimeValue={setStartTimeValue}
                setEndTimeValue={setEndTimeValue}
            />

            <div className="event-form-row">
                <CategorySelector
                    selectedCategory={selectedCategory}
                    isCategoryDropdownOpen={isCategoryDropdownOpen}
                    toggleCategoryDropdown={toggleCategoryDropdown}
                    categories={categories}
                    handleSelectCategory={handleSelectCategory}
                    isAddingCategory={isAddingCategory}
                    setIsAddingCategory={setIsAddingCategory}
                    newCategoryName={newCategoryName}
                    setNewCategoryName={setNewCategoryName}
                    selectedIcon={selectedIcon}
                    setSelectedIcon={setSelectedIcon}
                    handleAddCategory={handleAddCategory}
                    categoryDropdownRef={categoryDropdownRef}
                    getIconComponent={getIconComponent}
                />

                <ColorSelector
                    selectedColor={selectedColor}
                    isColorDropdownOpen={isColorDropdownOpen}
                    toggleColorDropdown={toggleColorDropdown}
                    handleSelectColor={handleSelectColor}
                    colorDropdownRef={colorDropdownRef}
                />

                <ReminderSelector
                    selectedReminder={selectedReminder}
                    onChange={handleSelectReminder}
                    onDropdownToggle={(isOpen) => {
                        if (isOpen) {
                            closeOtherDropdowns('reminder');
                        }
                    }}
                />
            </div>

            <EventDescription
                description={description}
                setDescription={setDescription}
            />

            <MenuFooter onClose={onClose} />
        </div>
    );
};

export default Menu;