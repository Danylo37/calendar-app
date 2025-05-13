import React from 'react';

const MenuFooter = ({ onClose }) => {
    return (
        <div className="form-actions">
            <button className="add-button" onClick={onClose}>
                Add event
            </button>
        </div>
    );
};

export default MenuFooter;