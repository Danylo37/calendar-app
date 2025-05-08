import React, { useState, useRef, useEffect } from 'react';
import {
    PlusCircle, Calendar, ChevronLeft, ChevronRight, ChevronDown,
    CalendarDays, CalendarRange, CalendarClock
} from 'lucide-react';
import '../../styles/layout/Header.css';
import CategoryManager from '../CategoryManager';

function Header() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('Week');
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
    const [dropdownAnimation, setDropdownAnimation] = useState('');

    const dropdownRef = useRef(null);

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

    const goToPrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'Day') {
            newDate.setDate(newDate.getDate() - 1);
        } else if (viewMode === 'Week') {
            newDate.setDate(newDate.getDate() - 7);
        } else if (viewMode === 'Month') {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        setCurrentDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'Day') {
            newDate.setDate(newDate.getDate() + 1);
        } else if (viewMode === 'Week') {
            newDate.setDate(newDate.getDate() + 7);
        } else if (viewMode === 'Month') {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
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
            default: return <Calendar size={18} />;
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="btn">
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
    );
}

export default Header;