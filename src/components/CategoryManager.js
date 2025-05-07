import React, { useState, useRef, useEffect } from 'react';
import {
    ListFilter,
    ChevronDown,
    Plus,
    X,
    Briefcase,
    Home,
    Heart,
    Book,
    Coffee,
    Utensils,
    Plane,
    Users,
    Dumbbell,
    Film,
    Music,
    ShoppingBag,
    GraduationCap
} from 'lucide-react';
import '../styles/CategoryManager.css';

function CategoryManager() {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Work', icon: 'Briefcase', selected: true },
        { id: 2, name: 'Home', icon: 'Home', selected: true },
        { id: 3, name: 'Personal', icon: 'Heart', selected: true }
    ]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnimation, setMenuAnimation] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('Briefcase');

    const menuRef = useRef(null);

    const availableIcons = [
        { name: 'Briefcase', component: Briefcase },
        { name: 'Home', component: Home },
        { name: 'Heart', component: Heart },
        { name: 'Book', component: Book },
        { name: 'Coffee', component: Coffee },
        { name: 'Utensils', component: Utensils },
        { name: 'Plane', component: Plane },
        { name: 'Users', component: Users },
        { name: 'Dumbbell', component: Dumbbell },
        { name: 'Film', component: Film },
        { name: 'Music', component: Music },
        { name: 'ShoppingBag', component: ShoppingBag },
        { name: 'GraduationCap', component: GraduationCap },
        { name: 'ListFilter', component: ListFilter }
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const openMenu = () => {
        setIsMenuOpen(true);
        setMenuAnimation('dropdown-open');
    };

    const closeMenu = () => {
        setMenuAnimation('dropdown-close');
        setTimeout(() => {
            setIsMenuOpen(false);
            setMenuAnimation('');
            setIsAddingCategory(false);
            setNewCategoryName('');
            setSelectedIcon('Briefcase');
        }, 200);
    };

    const toggleMenu = () => {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory = {
                id: Date.now(),
                name: newCategoryName.trim(),
                icon: selectedIcon,
                selected: true
            };

            setCategories([...categories, newCategory]);
            setNewCategoryName('');
            setIsAddingCategory(false);
            setSelectedIcon('Briefcase');
        }
    };

    const handleRemoveCategory = (id) => {
        setCategories(categories.filter(category => category.id !== id));
    };

    const toggleCategorySelection = (id) => {
        setCategories(categories.map(category =>
            category.id === id
                ? { ...category, selected: !category.selected }
                : category
        ));
    };

    const getIconComponent = (iconName, size = 16) => {
        const icon = availableIcons
            .find(icon => icon.name === iconName);
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
                onClick={toggleMenu}
            >
                <ListFilter size={18} />
                <span>{getSelectedCategoryText()}</span>
                <ChevronDown
                    size={16}
                    className={isMenuOpen ? 'chevron-rotated' : ''}
                />
            </button>

            {isMenuOpen && (
                <div className={`category-menu ${menuAnimation}`}>
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveCategory(category.id);
                                    }}
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
        </div>
    );
}

export default CategoryManager;