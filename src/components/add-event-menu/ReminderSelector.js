import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Clock, X } from 'lucide-react';
import '../../styles/ReminderSelector.css';

const CustomReminderModal = ({ isOpen, onClose, onSave, initialValue }) => {
    const defaultValue = initialValue && typeof initialValue.value === 'number' ? initialValue.value : 1;
    const [timeValue, setTimeValue] = useState(defaultValue);
    const [timeUnit, setTimeUnit] = useState(initialValue?.unit || 'minutes');
    const modalRef = useRef(null);

    useEffect(() => {
        if (initialValue) {
            if (typeof initialValue.value === 'number') {
                setTimeValue(initialValue.value);
            }
            if (initialValue.unit) {
                setTimeUnit(initialValue.unit);
            }
        }
    }, [initialValue]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleSave = () => {
        let finalValue = Number(timeValue);
        let finalUnit = timeUnit;
        let displayShort;

        if (timeUnit === 'minutes' && finalValue >= 60) {
            const hours = Math.floor(finalValue / 60);
            const minutes = finalValue % 60;

            if (minutes === 0) {
                finalValue = hours;
                finalUnit = 'hour';
                displayShort = `${hours} ${hours === 1 ? 'hr.' : 'hrs.'}`;
            } else {
                finalUnit = 'minutes';
                displayShort = `${hours} ${hours === 1 ? 'hr.' : 'hrs.'} ${minutes}min.`;
            }
        } else if (timeUnit === 'hour') {
            displayShort = `${finalValue} ${finalValue === 1 ? 'hr.' : 'hrs.'}`;
        } else {
            displayShort = `${finalValue} min.`;
        }

        const customReminder = {
            id: 'custom',
            value: finalValue,
            unit: finalUnit,
            displayShort: displayShort,
            isCustom: true
        };
        onSave(customReminder);
    };

    const handleTimeChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0 && value <= 999) {
            setTimeValue(value);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="custom-reminder-overlay">
            <div className="custom-reminder-modal" ref={modalRef}>
                <div className="modal-header">
                    <h3>Custom Reminder</h3>
                    <button className="close-modal-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="time-input-group">
                        <input
                            type="number"
                            min="1"
                            max="999"
                            value={timeValue}
                            onChange={handleTimeChange}
                            className="time-value-input"
                            autoFocus
                        />

                        <div className="time-unit-selector">
                            <label className={`unit-option ${timeUnit === 'minutes' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="timeUnit"
                                    value="minutes"
                                    checked={timeUnit === 'minutes'}
                                    onChange={() => setTimeUnit('minutes')}
                                />
                                <span>Minutes</span>
                            </label>

                            <label className={`unit-option ${timeUnit === 'hour' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="timeUnit"
                                    value="hour"
                                    checked={timeUnit === 'hour'}
                                    onChange={() => setTimeUnit('hour')}
                                />
                                <span>Hours</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="cancel-modal-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="save-modal-btn"
                        onClick={handleSave}
                        disabled={!timeValue || timeValue <= 0}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

const reminderOptions = [
    { id: 1, value: 5, unit: 'minutes', displayShort: '5 min.' },
    { id: 2, value: 10, unit: 'minutes', displayShort: '10 min.' },
    { id: 3, value: 15, unit: 'minutes', displayShort: '15 min.' },
    { id: 4, value: 30, unit: 'minutes', displayShort: '30 min.' },
    { id: 5, value: 1, unit: 'hour', displayShort: '1 hr.' },
    { id: 'custom', value: null, unit: null, displayShort: 'Custom', isCustomOption: true }
];

const ReminderSelector = ({ selectedReminder, onChange, onDropdownToggle, handleClearReminder }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        const newState = !isDropdownOpen;
        setIsDropdownOpen(newState);
        if (onDropdownToggle) {
            onDropdownToggle(newState ? 'reminder' : null);
        }
    };

    const handleSelectReminder = (option) => {
        if (option.isCustomOption) {
            setIsDropdownOpen(false);
            setIsCustomModalOpen(true);
            return;
        }

        if (onChange) {
            onChange(option);
        }
        setIsDropdownOpen(false);
    };

    const handleCustomReminderSave = (customReminder) => {
        if (onChange) {
            onChange(customReminder);
        }
        setIsCustomModalOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="reminder-dropdown-container" ref={dropdownRef}>
                <div
                    className="event-form-input dropdown-field reminder-selector"
                    onClick={toggleDropdown}
                >
                    {selectedReminder ? (
                        <div className="selected-reminder">
                            <span className="dropdown-text">{selectedReminder.displayShort}</span>
                            <button
                                className="clear-selection-btn"
                                onClick={handleClearReminder}
                                title="Clear reminder"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <span className="dropdown-text">Reminder (optional)</span>
                    )}
                    <ChevronDown
                        size={14}
                        className={isDropdownOpen ? 'chevron-rotated' : ''}
                    />
                </div>

                {isDropdownOpen && (
                    <div className="reminder-dropdown">
                        <div className="reminder-options">
                            {reminderOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`reminder-option ${selectedReminder && selectedReminder.id === option.id ? 'reminder-selected' : ''} ${option.isCustomOption ? 'custom-option' : ''}`}
                                    onClick={() => handleSelectReminder(option)}
                                >
                                    {option.isCustomOption ? (
                                        <>
                                            <Clock size={14} className="custom-icon" />
                                            <span>{option.displayShort}</span>
                                        </>
                                    ) : (
                                        <span>{option.value} {option.unit} before</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CustomReminderModal
                isOpen={isCustomModalOpen}
                onClose={() => setIsCustomModalOpen(false)}
                onSave={handleCustomReminderSave}
                initialValue={selectedReminder?.isCustom ? selectedReminder : null}
            />
        </>
    );
};

export default ReminderSelector;