import React, { useState, useRef, useEffect } from 'react';
import { ListFilter, ChevronDown, Plus, X } from 'lucide-react';
import { useCalendar } from '../../context/CalendarProvider';
import { availableIcons } from '../../constants/icons';
import CategoryConfirmModal from './CategoryConfirmModal';
import '../../styles/CategoryManager.css';

function CategoryManager() {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('Briefcase');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [categoryEventsCount, setCategoryEventsCount] = useState(0);

    const {
        isCategoryMenuOpen,
        toggleCategoryMenu,
        categories,
        addCategory,
        removeCategory,
        toggleCategorySelection,
        events
    } = useCalendar();

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                if (isCategoryMenuOpen) {
                    toggleCategoryMenu();
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCategoryMenuOpen, toggleCategoryMenu]);

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName, selectedIcon);
            setNewCategoryName('');
            setIsAddingCategory(false);
            setSelectedIcon('Briefcase');
        }
    };

    const countEventsWithCategory = (categoryId) => {
        return events.filter(event =>
            event.category && event.category.id === categoryId
        ).length;
    };

    const prepareRemoveCategory = (id, e) => {
        e.stopPropagation();

        const category = categories.find(cat => cat.id === id);
        if (!category) return;

        const eventsCount = countEventsWithCategory(id);

        if (eventsCount === 0) {
            removeCategory(id);
            return;
        }

        setCategoryToDelete(category);
        setCategoryEventsCount(eventsCount);

        setConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return;

        const categoryId = categoryToDelete.id;

        removeCategory(categoryId);

        setConfirmModalOpen(false);
        setCategoryToDelete(null);
    };

    const getIconComponent = (iconName, size = 16) => {
        const icon = availableIcons.find(icon => icon.name === iconName);
        if (icon) {
            const IconComponent = icon.component;
            return <IconComponent size={size} />;
        }
        return <ListFilter size={size} />;
    };

    const getSelectedCategoryText = () => {
        if (categories.length === 0) {
            return 'Categories';
        }

        const selectedCount = categories.filter(cat => cat.selected).length;

        if (selectedCount === 0) {
            return 'Categories (0)';
        } else if (selectedCount === categories.length) {
            return 'Categories (All)';
        } else {
            return `Categories (${selectedCount})`;
        }
    };

    return (
        <div className="dropdown-container" ref={menuRef}>
            <button
                className="btn"
                onClick={() => toggleCategoryMenu()}
            >
                <ListFilter size={18} />
                <span>{getSelectedCategoryText()}</span>
                <ChevronDown
                    size={16}
                    className={isCategoryMenuOpen ? 'chevron-rotated' : ''}
                />
            </button>

            {isCategoryMenuOpen && (
                <div className={`category-menu ${isCategoryMenuOpen ? 'dropdown-open' : 'dropdown-close'}`}>
                    <div className="category-list">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className={`category-item ${category.selected ? 'category-selected' : ''}`}
                                onClick={() => toggleCategorySelection(category.id)}
                            >
                                <div className="category-icon">
                                    {getIconComponent(category.icon)}
                                </div>
                                <span className="category-name">{category.name}</span>
                                <button
                                    className="category-delete"
                                    onClick={(e) => prepareRemoveCategory(category.id, e)}
                                >
                                    <X size={16} />
                                </button>
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

                            <div className="form-actions">
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

            <CategoryConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                categoryName={categoryToDelete?.name || ''}
                eventCount={categoryEventsCount}
            />
        </div>
    );
}

export default CategoryManager;