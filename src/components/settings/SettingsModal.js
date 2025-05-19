import React, { useState, useRef, useEffect } from 'react';
import { Settings, X, Trash2, AlertCircle } from 'lucide-react';
import { useCalendar } from '../../context/CalendarProvider';
import { clearCalendarData } from '../../utils/localStorage';
import { useClickOutside } from '../../hooks/useClickOutside';
import '../../styles/settings/SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const { resetToDefaultCategories } = useCalendar();

    useClickOutside(modalRef, onClose, isOpen);

    useEffect(() => {
        if (!isOpen) {
            setShowConfirmClear(false);
            setShowConfirmReset(false);
        }
    }, [isOpen]);

    const handleClearData = () => {
        clearCalendarData();
        window.location.reload();
    };

    const handleResetCategories = () => {
        resetToDefaultCategories();
        setShowConfirmReset(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="settings-modal" ref={modalRef}>
                <div className="settings-modal-header">
                    <h3>
                        <Settings size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                        Settings
                    </h3>
                    <button className="close-modal-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="settings-modal-content">
                    <div className="settings-section">
                        <h4>Data Management</h4>

                        <div className="setting-item">
                            {!showConfirmReset ? (
                                <button
                                    className="reset-categories-btn"
                                    onClick={() => setShowConfirmReset(true)}
                                >
                                    Reset Categories to Default
                                </button>
                            ) : (
                                <div className="confirm-clear-container">
                                    <div className="confirm-message">
                                        <AlertCircle size={40} />
                                        <span>This will reset all categories to default. Events will keep their data but some categories may be removed. Are you sure?</span>
                                    </div>
                                    <div className="confirm-actions">
                                        <button className="cancel-btn" onClick={() => setShowConfirmReset(false)}>
                                            Cancel
                                        </button>
                                        <button className="confirm-btn" onClick={handleResetCategories}>
                                            Yes, Reset Categories
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="setting-item">
                            {!showConfirmClear ? (
                                <button
                                    className="clear-data-btn"
                                    onClick={() => setShowConfirmClear(true)}
                                >
                                    <Trash2 size={16} />
                                    Clear All Calendar Data
                                </button>
                            ) : (
                                <div className="confirm-clear-container">
                                    <div className="confirm-message">
                                        <AlertCircle size={20} />
                                        <span>This will delete all events and reset all settings. Are you sure?</span>
                                    </div>
                                    <div className="confirm-actions">
                                        <button className="cancel-btn" onClick={() => setShowConfirmClear(false)}>
                                            Cancel
                                        </button>
                                        <button className="confirm-btn" onClick={handleClearData}>
                                            Yes, Clear Data
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;