import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import '../../styles/CategoryConfirmModal.css';

const CategoryConfirmModal = ({ isOpen, onClose, onConfirm, categoryName, eventCount }) => {
    const modalRef = useRef(null);

    useClickOutside(modalRef, onClose, isOpen);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="confirm-modal" ref={modalRef}>
                <div className="modal-header">
                    <h3>Delete Category</h3>
                    <button className="close-modal-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    <p>
                        Are you sure you want to delete the "{categoryName}" category?
                    </p>
                    <p className="warning-text">
                        {eventCount > 0
                            ? `This will remove the category from ${eventCount} event${eventCount !== 1 ? 's' : ''}.`
                            : 'This category has no events associated with it.'}
                    </p>
                </div>

                <div className="modal-actions">
                    <button className="cancel-modal-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="delete-modal-btn" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryConfirmModal;