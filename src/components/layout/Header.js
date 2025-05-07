import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Calendar, ListFilter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import '../../styles/layout/Header.css';

function Header() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('Week');
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsViewDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        setIsViewDropdownOpen(false);
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
                        onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                    >
                        <Calendar size={18} />
                        <span>{viewMode}</span>
                        <ChevronDown size={16} />
                    </button>
                    {isViewDropdownOpen && (
                        <div className="dropdown-menu">
                            <button
                                className="dropdown-item"
                                onClick={() => changeViewMode('Day')}
                            >
                                Day
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => changeViewMode('Week')}
                            >
                                Week
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => changeViewMode('Month')}
                            >
                                Month
                            </button>
                        </div>
                    )}
                </div>
                <button className="btn">
                    <ListFilter size={18} />
                    <span>Categories</span>
                </button>
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