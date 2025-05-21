import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../../styles/EventForm.css';
import { List } from 'lucide-react';
import { useCalendar } from '../../context/CalendarProvider';
import { format } from 'date-fns';
import MenuHeader from './MenuHeader';
import EventViewMode from './EventViewMode';
import EventEditMode from './EventEditMode';
import { colorOptions } from './ColorSelector';
import { availableIcons } from '../../constants/icons';
import { getCurrentTimeRoundedToNextHour } from '../../utils/timeUtils';
import { validateEventForm } from '../../utils/eventFormUtils';
import useDraggableForm from '../../hooks/useDraggableForm';
import useDropdownManagement from '../../hooks/useDropdownManagement';

const Menu = ({ isOpen, onClose, triggerPosition }) => {
    const formRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateInputValue, setDateInputValue] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [isViewMode, setIsViewMode] = useState(false);

    const [localUpdated, setLocalUpdated] = useState(false);
    const [eventId, setEventId] = useState(null);

    const { startTime, endTime } = getCurrentTimeRoundedToNextHour();
    const [startTimeValue, setStartTimeValue] = useState(startTime);
    const [endTimeValue, setEndTimeValue] = useState(endTime);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('List');
    const [selectedColor, setSelectedColor] = useState(colorOptions[6]);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');

    const [errors, setErrors] = useState({
        title: false,
        duration: false
    });
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

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
        selectedTimeSlotForForm,
        checkEventCrossesMidnight,
        resetReminderForEvent
    } = useCalendar();

    const {
        isDatePickerOpen,
        isStartTimePickerOpen,
        isEndTimePickerOpen,
        isCategoryDropdownOpen,
        isColorDropdownOpen,
        isReminderDropdownOpen,
        isAddingCategory,
        setIsAddingCategory,
        setIsCategoryDropdownOpen,
        setIsColorDropdownOpen,
        setIsReminderDropdownOpen,
        toggleDatePicker,
        toggleStartTimePicker,
        toggleEndTimePicker,
        toggleCategoryDropdown,
        toggleColorDropdown,
        toggleReminderDropdown,
        closeAllPickers
    } = useDropdownManagement();

    const { position, isPositionCalculated, handleMouseDown } = useDraggableForm({
        formRef,
        triggerPosition,
        isOpen,
        closeAllUIElementsExcept,
        closeAllPickers
    });

    useEffect(() => {
        if (!isOpen) {
            setNewCategoryName('');
            setIsAddingCategory(false);
            setSelectedIcon('List');
        }
    }, [isOpen, setIsAddingCategory]);

    useEffect(() => {
        if (localUpdated && isOpen) {
            setIsViewMode(true);
            setLocalUpdated(false);
        }
    }, [localUpdated, isOpen]);

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
        setIsViewMode(false);
        setLocalUpdated(false);
        setSelectedIcon('List');

        closeAllPickers();
    }, [closeAllPickers]);

    const handleCloseForm = useCallback(() => {
        closeAllPickers();
        onClose();
        resetForm();
    }, [closeAllPickers, onClose, resetForm]);

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

    useEffect(() => {
        if (editingEvent && isOpen) {
            setIsViewMode(true);
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
        } else if (isOpen && selectedTimeSlotForForm) {
            setSelectedDate(selectedTimeSlotForForm.day);
            setDateInputValue(format(selectedTimeSlotForForm.day, 'dd/MM/yyyy'));
            setStartTimeValue(selectedTimeSlotForForm.startTime);
            setEndTimeValue(selectedTimeSlotForForm.endTime);
            setIsEditMode(false);
            setIsViewMode(false);
        } else {
            if (isOpen && !editingEvent) {
                resetForm();
                setIsEditMode(false);
                setIsViewMode(false);
            }
        }
    }, [editingEvent, isOpen, startTime, endTime, resetForm, selectedTimeSlotForForm]);

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
            setSelectedIcon('List');
            setIsCategoryDropdownOpen(false);
        }
    };

    const validateForm = () => {
        const { errors: newErrors, isValid } = validateEventForm(title, startTimeValue, endTimeValue);
        setErrors(newErrors);
        return isValid;
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
            title: title,
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

            resetReminderForEvent(eventId);

            setLocalUpdated(true);
            setIsViewMode(true);
        } else {
            addEvent(eventData);
            resetForm();
            handleCloseForm();
        }
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
        return <List size={size} />;
    };

    const handleSwitchToEditMode = () => {
        setIsViewMode(false);
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

    if (!isOpen) return null;

    return (
        <div
            ref={formRef}
            className={`event-form ${isOpen ? 'active' : ''} ${isPositionCalculated ? 'position-calculated' : ''}`}
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

            {isViewMode ? (
                <EventViewMode
                    title={title}
                    date={selectedDate}
                    startTime={startTimeValue}
                    endTime={endTimeValue}
                    category={selectedCategory}
                    color={selectedColor}
                    description={description}
                    reminder={selectedReminder}
                    onEditClick={handleSwitchToEditMode}
                    getIconComponent={getIconComponent}
                    onDeleteEvent={handleDeleteEvent}
                />
            ) : (
                <EventEditMode
                    title={title}
                    dateInputValue={dateInputValue}
                    startTimeValue={startTimeValue}
                    endTimeValue={endTimeValue}
                    selectedDate={selectedDate}
                    selectedCategory={selectedCategory}
                    selectedColor={selectedColor}
                    selectedReminder={selectedReminder}
                    description={description}
                    newCategoryName={newCategoryName}
                    selectedIcon={selectedIcon}

                    errors={errors}
                    showValidationErrors={showValidationErrors}

                    isEditMode={isEditMode}

                    handleTitleChange={handleTitleChange}
                    handleDateInputChange={handleDateInputChange}
                    handleTimeInputChange={handleTimeInputChange}
                    handleStartTimeChange={handleStartTimeChange}
                    handleEndTimeChange={handleEndTimeChange}
                    handleDateChange={handleDateChange}
                    handleSelectCategory={handleSelectCategory}
                    handleClearCategory={handleClearCategory}
                    handleSelectColor={handleSelectColor}
                    handleSelectReminder={handleSelectReminder}
                    handleClearReminder={handleClearReminder}
                    handleAddCategory={handleAddCategory}
                    handleSaveEvent={handleSaveEvent}
                    handleDeleteEvent={handleDeleteEvent}

                    isDatePickerOpen={isDatePickerOpen}
                    isStartTimePickerOpen={isStartTimePickerOpen}
                    isEndTimePickerOpen={isEndTimePickerOpen}
                    isCategoryDropdownOpen={isCategoryDropdownOpen}
                    isColorDropdownOpen={isColorDropdownOpen}
                    isReminderDropdownOpen={isReminderDropdownOpen}
                    isAddingCategory={isAddingCategory}

                    toggleDatePicker={toggleDatePicker}
                    toggleStartTimePicker={toggleStartTimePicker}
                    toggleEndTimePicker={toggleEndTimePicker}
                    toggleCategoryDropdown={toggleCategoryDropdown}
                    toggleColorDropdown={toggleColorDropdown}
                    toggleReminderDropdown={toggleReminderDropdown}
                    setIsAddingCategory={setIsAddingCategory}

                    dateInputRef={dateInputRef}
                    startTimeInputRef={startTimeInputRef}
                    endTimeInputRef={endTimeInputRef}
                    datePickerRef={datePickerRef}
                    startTimePickerRef={startTimePickerRef}
                    endTimePickerRef={endTimePickerRef}
                    categoryDropdownRef={categoryDropdownRef}
                    colorDropdownRef={colorDropdownRef}
                    reminderDropdownRef={reminderDropdownRef}

                    getIconComponent={getIconComponent}
                    categories={categories}
                    setNewCategoryName={setNewCategoryName}
                    setSelectedIcon={setSelectedIcon}
                    setDescription={setDescription}
                />
            )}
        </div>
    );
};

export default Menu;