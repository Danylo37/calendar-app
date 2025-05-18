import React, { useRef, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import '../../styles/Reminder.css';

function Reminder({ event, onClose }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!event) return null;

    const eventDate = parseISO(event.date);
    const isToday = format(new Date(), 'yyyy-MM-dd') === event.date;
    const dateDisplay = isToday ? 'Today' : format(eventDate, 'EEEE, MMMM d');

    return (
        <div className="reminder-popup-overlay">
            <div
                className="reminder-popup"
                style={{ borderLeftColor: event.color.border }}
                ref={modalRef}
            >
                <div className="reminder-popup-header" style={{ backgroundColor: event.color.background }}>
                    <h3 style={{ color: event.color.border }}>
                        <Bell size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Event Reminder
                    </h3>
                    <button className="close-modal-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="reminder-popup-content">
                    <h2>{event.title}</h2>
                    <span className="event-time">
                        {dateDisplay} at {event.startTime} - {event.endTime}
                    </span>

                    {event.description && (
                        <p className="event-description">{event.description}</p>
                    )}

                    {event.category && (
                        <p>Category: {event.category.name}</p>
                    )}
                </div>

                <div className="reminder-popup-actions">
                    <button className="reminder-popup-dismiss" onClick={onClose}>
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Reminder;