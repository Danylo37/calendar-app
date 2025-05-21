import React from 'react';
import DateTimeSelector from './date-time/DateTimeSelector';
import CategorySelector from './CategorySelector';
import ColorSelector from './ColorSelector';
import EventDescription from './EventDescription';
import MenuFooter from './MenuFooter';
import ReminderSelector from './ReminderSelector';

const EventEditMode = ({
                           title,
                           dateInputValue,
                           startTimeValue,
                           endTimeValue,
                           selectedDate,
                           selectedCategory,
                           selectedColor,
                           selectedReminder,
                           description,
                           newCategoryName,
                           selectedIcon,
                           setDescription,

                           errors,
                           showValidationErrors,

                           isEditMode,

                           handleTitleChange,
                           handleDateInputChange,
                           handleTimeInputChange,
                           handleStartTimeChange,
                           handleEndTimeChange,
                           handleDateChange,
                           handleSelectCategory,
                           handleClearCategory,
                           handleSelectColor,
                           handleSelectReminder,
                           handleClearReminder,
                           handleAddCategory,
                           handleSaveEvent,
                           handleDeleteEvent,

                           isDatePickerOpen,
                           isStartTimePickerOpen,
                           isEndTimePickerOpen,
                           isCategoryDropdownOpen,
                           isColorDropdownOpen,
                           isReminderDropdownOpen,
                           isAddingCategory,

                           toggleDatePicker,
                           toggleStartTimePicker,
                           toggleEndTimePicker,
                           toggleCategoryDropdown,
                           toggleColorDropdown,
                           toggleReminderDropdown,
                           setIsAddingCategory,

                           dateInputRef,
                           startTimeInputRef,
                           endTimeInputRef,
                           datePickerRef,
                           startTimePickerRef,
                           endTimePickerRef,
                           categoryDropdownRef,
                           colorDropdownRef,
                           reminderDropdownRef,

                           getIconComponent,
                           categories,
                           setNewCategoryName,
                           setSelectedIcon
                       }) => {
    return (
        <>
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
        </>
    );
};

export default EventEditMode;