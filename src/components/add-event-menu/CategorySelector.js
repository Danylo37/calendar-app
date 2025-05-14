import React from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { availableIcons } from '../../constants/icons';

const CategorySelector = ({
                              selectedCategory,
                              isCategoryDropdownOpen,
                              toggleCategoryDropdown,
                              categories,
                              handleSelectCategory,
                              isAddingCategory,
                              setIsAddingCategory,
                              newCategoryName,
                              setNewCategoryName,
                              selectedIcon,
                              setSelectedIcon,
                              handleAddCategory,
                              categoryDropdownRef,
                              getIconComponent,
                              handleClearCategory
                          }) => {
    return (
        <div className="category-dropdown-container" ref={categoryDropdownRef}>
            <div
                className="event-form-input dropdown-field category-selector"
                onClick={toggleCategoryDropdown}
            >
                {selectedCategory ? (
                    <div className="selected-category">
                        <div className="category-icon">
                            {getIconComponent(selectedCategory.icon)}
                        </div>
                        <span className="dropdown-text">{selectedCategory.name}</span>
                        <button
                            className="clear-selection-btn"
                            onClick={handleClearCategory}
                            title="Clear category"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <span className="dropdown-text">Category (optional)</span>
                )}
                <ChevronDown
                    size={14}
                    className={isCategoryDropdownOpen ? 'chevron-rotated' : ''}
                />
            </div>

            {isCategoryDropdownOpen && (
                <div className="category-dropdown">
                    <div className="category-list">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className={`category-item ${selectedCategory && selectedCategory.id === category.id ? 'category-selected' : ''}`}
                                onClick={() => handleSelectCategory(category)}
                            >
                                <div className="category-icon">
                                    {getIconComponent(category.icon)}
                                </div>
                                <span className="category-name">{category.name}</span>
                            </div>
                        ))}
                    </div>

                    {isAddingCategory ? (
                        <div className="add-category-form">
                            <input
                                type="text"
                                placeholder="Category name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="category-input"
                                autoFocus
                            />

                            <div className="icon-selector">
                                {availableIcons.map(icon => {
                                    const IconComponent = icon.component;
                                    return (
                                        <div
                                            key={icon.name}
                                            className={`icon-option ${selectedIcon === icon.name ? 'selected' : ''}`}
                                            onClick={() => setSelectedIcon(icon.name)}
                                        >
                                            <IconComponent size={20} />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="form-actions category-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={() => setIsAddingCategory(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="save-btn"
                                    onClick={handleAddCategory}
                                    disabled={!newCategoryName.trim()}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="add-category-btn"
                            onClick={() => setIsAddingCategory(true)}
                        >
                            <Plus size={16} />
                            <span>Add Category</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategorySelector;