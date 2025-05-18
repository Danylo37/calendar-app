import React from 'react';
import { format } from 'date-fns';
import { Edit, Clock, Calendar, Bell } from 'lucide-react';
import '../../styles/EventViewMode.css';

const EventViewMode = ({
                           title,
                           date,
                           startTime,
                           endTime,
                           category,
                           color,
                           description,
                           reminder,
                           onEditClick,
                           getIconComponent,
                           onDeleteEvent
                       }) => {
    const formatDate = (date) => {
        return format(date, 'EEEE, MMMM d, yyyy');
    };

    return (
        <div className="event-view-mode">
            <div
                className="event-title-container"
                style={{
                    backgroundColor: color.background,
                    border: `2px solid ${color.border}`
                }}
            >
                <h2 className="event-title">{title}</h2>
            </div>

            <div className="event-details">
                <div className="event-detail-item">
                    <Calendar size={18} className="detail-icon" />
                    <span className="detail-text">{formatDate(date)}</span>
                </div>

                <div className="event-detail-item">
                    <Clock size={18} className="detail-icon" />
                    <span className="detail-text">{startTime} — {endTime}</span>
                </div>

                {category && (
                    <div className="event-detail-item">
                        <div className="detail-icon">
                            {getIconComponent(category.icon, 18)}
                        </div>
                        <span className="detail-text">{category.name}</span>
                    </div>
                )}

                {reminder && (
                    <div className="event-detail-item">
                        <Bell size={18} className="detail-icon" />
                        <span className="detail-text">
                            Reminder: {reminder.displayShort} {reminder.id !== 0 ? 'before' : ''}
                        </span>
                    </div>
                )}
            </div>

            {description && (
                <div className="event-description-container">
                    <p className="event-description">{description}</p>
                </div>
            )}

            <div className="event-view-actions">
                <button className="delete-button" onClick={onDeleteEvent}>
                    Delete
                </button>
                <button className="edit-button" onClick={onEditClick}>
                    <Edit size={18} />
                    Edit
                </button>
            </div>
        </div>
    );
};

export default EventViewMode;