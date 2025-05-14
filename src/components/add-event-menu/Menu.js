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
import ReminderSelector from './ReminderSelector';
import { availableIcons } from '../../constants/icons';

const getCurrentTimeRoundedToNextHour = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const nextHour = minutes === 0 ? hours : hours + 1;

    const startHour = nextHour % 24;
    const endHour = (startHour + 1) % 24;

    const formattedStartHour = startHour.toString().padStart(2, '0');
    const formattedEndHour = endHour.toString().padStart(2, '0');

    const startTime = `${formattedStartHour}:00`;
    const endTime = `${formattedEndHour}:00`;

    return { startTime, endTime };
};

const Menu = ({ isOpen, onClose, triggerPosition }) => {
    const formRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateInputValue, setDateInputValue] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const { startTime, endTime } = getCurrentTimeRoundedToNextHour();
    const [startTimeValue, setStartTimeValue] = useState(startTime);
    const [endTimeValue, setEndTimeValue] = useState(endTime);

    const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
    const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Briefcase');

    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(colorOptions[6]);

    const [isReminderDropdownOpen, setIsReminderDropdownOpen] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [eventId, setEventId] = useState(null);

    const [errors, setErrors] = useState({
        title: false,
        duration: false
    });
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [formDimensions, setFormDimensions] = useState({ width: 400, height: 500 });

    const categoryDropdownRef = useRef(null);
    const colorDropdownRef = useRef(null);
    const dateInputRef = useRef(null);
    const startTimeInputRef = useRef(null);
    const endTimeInputRef = useRef(null);
    const reminderDropdownRef = useRef(null);
    const datePickerRef = useRef(null);
    const startTimePickerRef = useRef(null);
    const endTimePickerRef = useRef(null);

    const {
        closeAllUIElementsExcept,
        categories,
        addCategory,
        addEvent,
        updateEvent,
        removeEvent,
        editingEvent,
        checkEventCrossesMidnight
    } = useCalendar();

    const closeAllPickers = useCallback(() => {
        setIsDatePickerOpen(false);
        setIsStartTimePickerOpen(false);
        setIsEndTimePickerOpen(false);
        setIsCategoryDropdownOpen(false);
        setIsColorDropdownOpen(false);
        setIsReminderDropdownOpen(false);
        setIsAddingCategory(false);
    }, []);

    const resetForm = useCallback(() => {
        setTitle('');
        setEventId(null);
        setSelectedDate(new Date());
        setDateInputValue(format(new Date(), 'dd/MM/yyyy'));

        const { startTime, endTime } = getCurrentTimeRoundedToNextHour();
        setStartTimeValue(startTime);
        setEndTimeValue(endTime);

        setSelectedCategory(null);
        setSelectedColor(colorOptions[6]);
        setDescription('');
        setSelectedReminder(null);
        setErrors({
            title: false,
            duration: false
        });
        setShowValidationErrors(false);
        setIsEditMode(false);

        closeAllPickers();
    }, [closeAllPickers]);

    const handleCloseForm = useCallback(() => {
        closeAllPickers();
        onClose();
    }, [closeAllPickers, onClose]);

    const handleFormClick = useCallback((e) => {
        if (
            (categoryDropdownRef.current && categoryDropdownRef.current.contains(e.target)) ||
            (colorDropdownRef.current && colorDropdownRef.current.contains(e.target)) ||
            (datePickerRef.current && datePickerRef.current.contains(e.target)) ||
            (startTimePickerRef.current && startTimePickerRef.current.contains(e.target)) ||
            (endTimePickerRef.current && endTimePickerRef.current.contains(e.target)) ||
            (reminderDropdownRef.current && reminderDropdownRef.current.contains(e.target)) ||
            (dateInputRef.current && dateInputRef.current.contains(e.target)) ||
            (startTimeInputRef.current && startTimeInputRef.current.contains(e.target)) ||
            (endTimeInputRef.current && endTimeInputRef.current.contains(e.target)) ||
            e.target.closest('.dropdown-field') ||
            e.target.closest('.time-slots-container') ||
            e.target.closest('.timepicker-container') ||
            e.target.closest('.datepicker-container') ||
            e.target.closest('.category-dropdown') ||
            e.target.closest('.color-dropdown') ||
            e.target.closest('.reminder-dropdown')
        ) {
            return;
        }

        closeAllPickers();
    }, [closeAllPickers]);

    useEffect(() => {
        if (isOpen) {
            closeAllPickers();
        }
    }, [isOpen, closeAllPickers]);

    const calculatePosition = useCallback((triggerPos, formWidth, formHeight) => {
        if (!triggerPos) return { x: 0, y: 0 };

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let xPos = triggerPos.left;
        let yPos = triggerPos.top + triggerPos.height + 10;

        if (xPos + formWidth > viewportWidth - 20) {
            xPos = Math.max(20, viewportWidth - formWidth - 20);
        }

        if (yPos + formHeight > viewportHeight - 20) {
            yPos = Math.max(20, triggerPos.top - formHeight - 10);

            if (yPos < 20) {
                yPos = 20;
            }
        }

        return { x: xPos, y: yPos };
    }, []);

    useEffect(() => {
        if (editingEvent && isOpen) {
            setIsEditMode(true);
            setEventId(editingEvent.id);
            setTitle(editingEvent.title || '');

            try {
                const dateParts = editingEvent.date.split('-');
                if (dateParts.length === 3) {
                    const year = parseInt(dateParts[0]);
                    const month = parseInt(dateParts[1]) - 1;
                    const day = parseInt(dateParts[2]);
                    const eventDate = new Date(year, month, day);
                    setSelectedDate(eventDate);
                    setDateInputValue(format(eventDate, 'dd/MM/yyyy'));
                }
            } catch (error) {
                console.error('Error parsing date:', error);
            }

            setStartTimeValue(editingEvent.startTime || startTime);
            setEndTimeValue(editingEvent.endTime || endTime);

            setSelectedCategory(editingEvent.category || null);

            setSelectedColor(editingEvent.color || colorOptions[6]);

            setDescription(editingEvent.description || '');

            setSelectedReminder(editingEvent.reminder || null);
        } else {
            if (isOpen && !editingEvent) {
                resetForm();
                setIsEditMode(false);
            }
        }
    }, [editingEvent, isOpen, startTime, endTime, resetForm]);

    useEffect(() => {
        if (isOpen && formRef.current && triggerPosition) {
            const updateFormDimensions = () => {
                if (formRef.current) {
                    const { width, height } = formRef.current.getBoundingClientRect();
                    setFormDimensions({ width, height });

                    const pos = calculatePosition(triggerPosition, width, height);
                    setPosition(pos);

                    if (pos.y < triggerPosition.top) {
                        formRef.current.style.transformOrigin = 'bottom left';
                    } else {
                        formRef.current.style.transformOrigin = 'top left';
                    }
                }
            };

            setTimeout(updateFormDimensions, 0);
        }
    }, [isOpen, triggerPosition, calculatePosition]);

    useEffect(() => {
        if (formRef.current && isOpen && triggerPosition) {
            const pos = calculatePosition(triggerPosition, formDimensions.width, formDimensions.height);
            setPosition(pos);
        }
    }, [formDimensions, triggerPosition, isOpen, calculatePosition]);

    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            if (formRef.current && triggerPosition) {
                const { width, height } = formRef.current.getBoundingClientRect();
                setFormDimensions({ width, height });
                const pos = calculatePosition(triggerPosition, width, height);
                setPosition(pos);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen, triggerPosition, calculatePosition]);

    useEffect(() => {
        if (formRef.current) {
            formRef.current.style.left = `${position.x}px`;
            formRef.current.style.top = `${position.y}px`;
        }
    }, [position]);

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

        if (errors.duration) {
            setErrors({...errors, duration: false});
        }
    };

    const handleEndTimeChange = (time) => {
        setEndTimeValue(time);

        if (errors.duration) {
            setErrors({...errors, duration: false});
        }
    };

    const calculateDurationInMinutes = (startTime, endTime) => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        let startTotalMinutes = startHours * 60 + startMinutes;
        let endTotalMinutes = endHours * 60 + endMinutes;

        if (endTotalMinutes <= startTotalMinutes) {
            endTotalMinutes += 24 * 60;
        }

        return endTotalMinutes - startTotalMinutes;
    };

    const validateTimeDuration = (start, end) => {
        const duration = calculateDurationInMinutes(start, end);

        if (duration === 1440) {
            return true;
        }

        return duration >= 5;
    };

    const closeOtherDropdowns = (currentDropdown) => {
        if (currentDropdown !== 'datePicker') setIsDatePickerOpen(false);
        if (currentDropdown !== 'startTimePicker') setIsStartTimePickerOpen(false);
        if (currentDropdown !== 'endTimePicker') setIsEndTimePickerOpen(false);
        if (currentDropdown !== 'category') setIsCategoryDropdownOpen(false);
        if (currentDropdown !== 'color') setIsColorDropdownOpen(false);
        if (currentDropdown !== 'reminder') setIsReminderDropdownOpen(false);
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

    const toggleReminderDropdown = (newState) => {
        setIsReminderDropdownOpen(newState);
        if (newState) {
            closeOtherDropdowns('reminder');
        }
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setIsCategoryDropdownOpen(false);
    };

    const handleClearCategory = (e) => {
        e.stopPropagation();
        setSelectedCategory(null);
    };

    const handleSelectColor = (color) => {
        setSelectedColor(color);
        setIsColorDropdownOpen(false);
    };

    const handleSelectReminder = (reminder) => {
        setSelectedReminder(reminder);
        setIsReminderDropdownOpen(false);
    };

    const handleClearReminder = (e) => {
        e.stopPropagation();
        setSelectedReminder(null);
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

    const validateForm = () => {
        const newErrors = {
            title: !title.trim(),
            duration: !validateTimeDuration(startTimeValue, endTimeValue)
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSaveEvent = () => {
        const isValid = validateForm();

        if (!isValid) {
            setShowValidationErrors(true);
            return;
        }

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const day = selectedDate.getDate();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const eventData = {
            title: title || 'Untitled Event',
            date: formattedDate,
            startTime: startTimeValue,
            endTime: endTimeValue,
            category: selectedCategory,
            color: selectedColor,
            description: description,
            reminder: selectedReminder,
            crossesMidnight: checkEventCrossesMidnight(startTimeValue, endTimeValue)
        };

        if (isEditMode && eventId) {
            updateEvent({
                ...eventData,
                id: eventId
            });
        } else {
            addEvent(eventData);
        }

        resetForm();
        handleCloseForm();
    };

    const handleDeleteEvent = () => {
        if (isEditMode && eventId) {
            removeEvent(eventId);
            resetForm();
            handleCloseForm();
        }
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);

        if (value.trim()) {
            setErrors({ ...errors, title: false });
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
        const handleClickOutside = (event) => {
            if (isOpen && formRef.current && !formRef.current.contains(event.target)) {
                handleCloseForm();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleCloseForm]);

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
    }, [closeAllUIElementsExcept, closeAllPickers]);

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
            onClick={handleFormClick}
        >
            <MenuHeader
                onClose={handleCloseForm}
                onMouseDown={handleMouseDown}
            />

            <div className="form-group">
                <input
                    type="text"
                    className={`event-form-title ${errors.title && showValidationErrors ? 'input-error' : ''}`}
                    placeholder="Add title *"
                    value={title}
                    onChange={handleTitleChange}
                />
                {errors.title && showValidationErrors && (
                    <div className="error-message">Title is required</div>
                )}
            </div>

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
                datePickerRef={datePickerRef}
                startTimePickerRef={startTimePickerRef}
                endTimePickerRef={endTimePickerRef}
            />

            {errors.duration && showValidationErrors && (
                <div className="duration-error-message">Event must be at least 5 minutes long (or exactly 24 hours)</div>
            )}

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
                    handleClearCategory={handleClearCategory}
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
                    isDropdownOpen={isReminderDropdownOpen}
                    onDropdownToggle={toggleReminderDropdown}
                    handleClearReminder={handleClearReminder}
                    dropdownRef={reminderDropdownRef}
                />
            </div>

            <EventDescription
                description={description}
                setDescription={setDescription}
            />

            <MenuFooter
                onAddEvent={handleSaveEvent}
                isEditMode={isEditMode}
                onDeleteEvent={handleDeleteEvent}
            />
        </div>
    );
};

export default Menu;