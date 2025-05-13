import React from 'react';

const MenuFooter = ({onAddEvent}) => {
    return (
        <div className="form-actions">
            <button className="add-button" onClick={onAddEvent}>
                Add event
            </button>
        </div>
    );
};

export default MenuFooter;