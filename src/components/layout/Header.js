import React, { useRef, useEffect } from 'react';
import {
    PlusCircle, ChevronLeft, ChevronRight, ChevronDown,
    CalendarDays, CalendarRange, CalendarClock
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarProvider';
import CategoryManager from '../category/CategoryManager';
import Menu from '../add-event-menu/Menu';
import '../../styles/layout/Header.css';

function Header() {
    const {
        currentDate,
        viewMode,
        setViewMode,
        goToPrevious,
        goToNext,
        isEventFormOpen,
        eventButtonPosition,
        isViewDropdownOpen,
        toggleEventForm,
        toggleViewDropdown
    } = useCalendar();

    const dropdownRef = useRef(null);
    const addEventButtonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (isViewDropdownOpen) {
                    toggleViewDropdown();
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isViewDropdownOpen, toggleViewDropdown]);

    const formatDate = () => {
        const locale = 'en-GB';

        if (viewMode === 'Day') {
            return currentDate.toLocaleDateString(locale, {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } else {
            return currentDate.toLocaleDateString(locale, {
                month: 'long',
                year: 'numeric'
            });
        }
    };

    const changeViewMode = (mode) => {
        setViewMode(mode);
        toggleViewDropdown();
    };

    const getViewIcon = (mode) => {
        switch(mode) {
            case 'Day': return <CalendarClock size={18} />;
            case 'Week': return <CalendarRange size={18} />;
            case 'Month': return <CalendarDays size={18} />;
            default: return <CalendarRange size={18} />;
        }
    };

    const handleAddEventClick = (e) => {
        e.stopPropagation();

        if (isEventFormOpen) return;

        if (addEventButtonRef.current) {
            const rect = addEventButtonRef.current.getBoundingClientRect();
            toggleEventForm({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <button
                        className={`btn ${isEventFormOpen ? 'disabled' : ''}`}
                        ref={addEventButtonRef}
                        onClick={handleAddEventClick}
                    >
                        <PlusCircle size={18} />
                        <span>Add Event</span>
                    </button>
                    <div className="dropdown-container" ref={dropdownRef}>
                        <button
                            className="btn"
                            onClick={() => toggleViewDropdown()}
                        >
                            {getViewIcon(viewMode)}
                            <span>{viewMode}</span>
                            <ChevronDown
                                size={16}
                                className={isViewDropdownOpen ? 'chevron-rotated' : ''}
                            />
                        </button>
                        {isViewDropdownOpen && (
                            <div className={`dropdown-menu ${isViewDropdownOpen ? 'dropdown-open' : 'dropdown-close'}`}>
                                <button
                                    className={`dropdown-item ${viewMode === 'Day' ? 'dropdown-item-active' : ''}`}
                                    onClick={() => changeViewMode('Day')}
                                >
                                    <CalendarClock size={16} className="dropdown-icon" />
                                    <span>Day</span>
                                </button>
                                <button
                                    className={`dropdown-item ${viewMode === 'Week' ? 'dropdown-item-active' : ''}`}
                                    onClick={() => changeViewMode('Week')}
                                >
                                    <CalendarRange size={16} className="dropdown-icon" />
                                    <span>Week</span>
                                </button>
                                <button
                                    className={`dropdown-item ${viewMode === 'Month' ? 'dropdown-item-active' : ''}`}
                                    onClick={() => changeViewMode('Month')}
                                >
                                    <CalendarDays size={16} className="dropdown-icon" />
                                    <span>Month</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <CategoryManager />
                </div>
                <div className="header-right">
                    <button className="btn nav-btn" onClick={() => goToPrevious()}>
                        <ChevronLeft size={22} />
                    </button>
                    <div className="date-display">{formatDate()}</div>
                    <button className="btn nav-btn" onClick={() => goToNext()}>
                        <ChevronRight size={22} />
                    </button>
                </div>
            </header>

            <Menu
                isOpen={isEventFormOpen}
                onClose={() => toggleEventForm()}
                triggerPosition={eventButtonPosition}
            />
        </>
    );
}

export default Header;