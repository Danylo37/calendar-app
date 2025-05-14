import React from 'react';
import { Trash2 } from 'lucide-react';

const MenuFooter = ({ onAddEvent, isEditMode, onDeleteEvent }) => {
    return (
        <div className="form-actions">
            {isEditMode && (
                <button className="delete-button" onClick={onDeleteEvent}>
                    <Trash2 size={18} />
                    Delete
                </button>
            )}
            <button className="add-button" onClick={onAddEvent}>
                {isEditMode ? 'Save changes' : 'Add event'}
            </button>
        </div>
    );
};

export default MenuFooter;