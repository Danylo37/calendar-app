import React from 'react';
import { X } from 'lucide-react';

const MenuHeader = ({ onClose, onMouseDown }) => {
    return (
        <div className="form-header" onMouseDown={onMouseDown}>
            <div className="drag-handle-container">
                <div className="drag-handle"></div>
            </div>
            <button className="close-btn" onClick={onClose}>
                <X size={26} />
            </button>
        </div>
    );
};

export default MenuHeader;