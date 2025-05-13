import React from 'react';
import { ChevronDown } from 'lucide-react';

const colorOptions = [
    { id: 1, background: '#DBFFDC', border: '#40CE49' },
    { id: 2, background: '#8466D7', border: '#6540CE' },
    { id: 3, background: '#FFDBDB', border: '#CE6640' },
    { id: 4, background: '#FFF4DB', border: '#CEAC40' },
    { id: 5, background: '#DBF0FF', border: '#40A9CE' },
    { id: 6, background: '#F5DBFF', border: '#B740CE' },
    { id: 7, background: '#C8CEFF', border: '#6540CE' }
];

const ColorSelector = ({selectedColor, isColorDropdownOpen, toggleColorDropdown, handleSelectColor, colorDropdownRef}
) => {
    return (
        <div className="color-dropdown-container" ref={colorDropdownRef}>
            <div
                className="event-form-input dropdown-field color-selector"
                onClick={toggleColorDropdown}
            >
                <div
                    className="color-indicator"
                    style={{
                        backgroundColor: selectedColor.background,
                        borderColor: selectedColor.border
                    }}
                ></div>
                <ChevronDown
                    size={14}
                    className={isColorDropdownOpen ? 'chevron-rotated' : ''}
                />
            </div>

            {isColorDropdownOpen && (
                <div className="color-dropdown">
                    <div className="color-options">
                        {colorOptions.map(color => (
                            <div
                                key={color.id}
                                className={`color-option ${selectedColor.id === color.id ? 'color-selected' : ''}`}
                                onClick={() => handleSelectColor(color)}
                                style={{
                                    backgroundColor: color.background,
                                    borderColor: color.border
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export { colorOptions };
export default ColorSelector;