import React, { useState, useRef } from 'react';
import { ChevronDown, Clock, X } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import '../../styles/ReminderSelector.css';

const CustomReminderModal = ({ isOpen, onClose, onSave, initialValue }) => {
    const defaultValue = initialValue && typeof initialValue.value === 'number' ? initialValue.value : 15;
    const [timeValue, setTimeValue] = useState(defaultValue);
    const [timeUnit, setTimeUnit] = useState(initialValue?.unit || 'minutes');
    const modalRef = useRef(null);

    useClickOutside(modalRef, onClose, isOpen);

    if (!isOpen) return null;

    const handleSave = () => {
        let finalValue = Number(timeValue || 0);
        let finalUnit = timeUnit;
        let displayShort;

        if (finalValue === 0) {
            displayShort = 'When event starts';
        }
        else if (timeUnit === 'minutes' && finalValue >= 60 && finalValue % 60 === 0) {
            const hours = finalValue / 60;

            if (hours === 24) {
                displayShort = '24 hrs.';
            } else if (hours === 1) {
                displayShort = '1 hr.';
            } else {
                displayShort = `${hours} hrs.`;
            }

            finalValue = hours;
            finalUnit = 'hour';
        }
        else if (timeUnit === 'minutes' && finalValue >= 60) {
            const hours = Math.floor(finalValue / 60);
            const minutes = finalValue % 60;

            displayShort = `${hours} ${hours === 1 ? 'hr.' : 'hrs.'} ${minutes}min.`;
        }
        else if (timeUnit === 'hour') {
            if (finalValue === 24) {
                displayShort = '24 hrs.';
            } else if (finalValue === 1) {
                displayShort = '1 hr.';
            } else {
                displayShort = `${finalValue} hrs.`;
            }
        }
        else {
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
        const inputValue = e.target.value;
        const parsedValue = parseInt(inputValue, 10);
        const maxValue = timeUnit === 'hour' ? 24 : 1440;

        if (!isNaN(parsedValue)) {
            if (parsedValue < 0) {
                setTimeValue(0);
            } else if (parsedValue > maxValue) {
                setTimeValue(maxValue);
            } else {
                setTimeValue(parsedValue);
            }
        } else if (inputValue === '') {
            setTimeValue('');
        }
    };

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
                            min="0"
                            max={timeUnit === 'hour' ? 24 : 1440}
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
                        disabled={timeValue === ''}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

const reminderOptions = [
    { id: 0, value: 0, unit: 'minutes', displayShort: 'When event starts' },
    { id: 1, value: 5, unit: 'minutes', displayShort: '5 min.' },
    { id: 2, value: 10, unit: 'minutes', displayShort: '10 min.' },
    { id: 3, value: 15, unit: 'minutes', displayShort: '15 min.' },
    { id: 4, value: 30, unit: 'minutes', displayShort: '30 min.' },
    { id: 5, value: 1, unit: 'hour', displayShort: '1 hr.' },
    { id: 'custom', value: null, unit: null, displayShort: 'Custom', isCustomOption: true }
];

const ReminderSelector = ({ selectedReminder, onChange, isDropdownOpen, onDropdownToggle, handleClearReminder, dropdownRef }) => {
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const localDropdownRef = useRef(null);

    const reminderDropdownRef = dropdownRef || localDropdownRef;

    const toggleDropdown = () => {
        const newState = !isDropdownOpen;
        if (onDropdownToggle) {
            onDropdownToggle(newState);
        }
    };

    const handleSelectReminder = (option) => {
        if (option.isCustomOption) {
            onDropdownToggle(false);
            setIsCustomModalOpen(true);
            return;
        }

        if (onChange) {
            onChange(option);
        }
    };

    const handleCustomReminderSave = (customReminder) => {
        if (onChange) {
            onChange(customReminder);
        }
        setIsCustomModalOpen(false);
    };

    return (
        <>
            <div className="reminder-dropdown-container" ref={reminderDropdownRef}>
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
                                        <span>{option.displayShort} {option.id !== 0 ? 'before' : ''}</span>
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