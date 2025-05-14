import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const DateTimeSelector = ({
                              dateInputValue,
                              handleDateInputChange,
                              startTimeValue,
                              endTimeValue,
                              handleTimeInputChange,
                              handleStartTimeChange,
                              handleEndTimeChange,
                              isDatePickerOpen,
                              setIsDatePickerOpen,
                              isStartTimePickerOpen,
                              setIsStartTimePickerOpen,
                              isEndTimePickerOpen,
                              setIsEndTimePickerOpen,
                              selectedDate,
                              handleDateChange,
                              dateInputRef,
                              startTimeInputRef,
                              endTimeInputRef,
                              setStartTimeValue,
                              setEndTimeValue
                          }) => {
    return (
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
                        isEndTime={false}
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
                        comparisonTime={startTimeValue}
                        isEndTime={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateTimeSelector;