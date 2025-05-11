import React, { useRef, useState, useEffect } from 'react';
import {
    PlusCircle, ChevronLeft, ChevronRight, ChevronDown,
    CalendarDays, CalendarRange, CalendarClock
} from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import CategoryManager from '../CategoryManager';
import EventForm from '../EventForm';
import '../../styles/layout/Header.css';

function Header() {
    const { currentDate, viewMode, setViewMode, goToPrevious, goToNext } = useCalendar();
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
    const [dropdownAnimation, setDropdownAnimation] = useState('');
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [eventButtonPosition, setEventButtonPosition] = useState(null);

    const dropdownRef = useRef(null);
    const addEventButtonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const openDropdown = () => {
        setIsViewDropdownOpen(true);
        setDropdownAnimation('dropdown-open');
    };

    const closeDropdown = () => {
        setDropdownAnimation('dropdown-close');
        setTimeout(() => {
            setIsViewDropdownOpen(false);
            setDropdownAnimation('');
        }, 200);
    };

    const toggleDropdown = () => {
        if (isViewDropdownOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };

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
        closeDropdown();
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

        if (addEventButtonRef.current) {
            const rect = addEventButtonRef.current.getBoundingClientRect();
            setEventButtonPosition({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
        }
        setIsEventFormOpen(true);
    };

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <button
                        className="btn"
                        ref={addEventButtonRef}
                        onClick={handleAddEventClick}
                    >
                        <PlusCircle size={18} />
                        <span>Add Event</span>
                    </button>
                    <div className="dropdown-container" ref={dropdownRef}>
                        <button
                            className="btn"
                            onClick={toggleDropdown}
                        >
                            {getViewIcon(viewMode)}
                            <span>{viewMode}</span>
                            <ChevronDown
                                size={16}
                                className={isViewDropdownOpen ? 'chevron-rotated' : ''}
                            />
                        </button>
                        {isViewDropdownOpen && (
                            <div className={`dropdown-menu ${dropdownAnimation}`}>
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
                    <button className="btn nav-btn" onClick={goToPrevious}>
                        <ChevronLeft size={22} />
                    </button>
                    <div className="date-display">{formatDate()}</div>
                    <button className="btn nav-btn" onClick={goToNext}>
                        <ChevronRight size={22} />
                    </button>
                </div>
            </header>

            <EventForm
                isOpen={isEventFormOpen}
                onClose={() => setIsEventFormOpen(false)}
                triggerPosition={eventButtonPosition}
            />
        </>
    );
}

export default Header;