import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '../utils/localStorage';

const DEFAULT_CATEGORIES = [
    { id: 1, name: 'Work', icon: 'Briefcase', selected: true },
    { id: 2, name: 'Home', icon: 'Home', selected: true },
    { id: 3, name: 'Personal', icon: 'Heart', selected: true }
];

export const useCategories = () => {
    const [categories, setCategories] = useState(() => {
        return loadFromLocalStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    });

    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.CATEGORIES, categories);
    }, [categories]);

    const addCategory = (name, icon) => {
        const newCategory = {
            id: Date.now(),
            name: name.trim(),
            icon: icon,
            selected: true
        };

        setCategories(prevCategories => [...prevCategories, newCategory]);
        return newCategory;
    };

    const removeCategory = (id) => {
        setCategories(prevCategories =>
            prevCategories.filter(category => category.id !== id)
        );
    };

    const toggleCategorySelection = (id) => {
        setCategories(prevCategories =>
            prevCategories.map(category =>
                category.id === id
                    ? { ...category, selected: !category.selected }
                    : category
            )
        );
    };

    const resetToDefaultCategories = () => {
        setCategories(DEFAULT_CATEGORIES);
    };

    return {
        categories,
        addCategory,
        removeCategory,
        toggleCategorySelection,
        resetToDefaultCategories
    };
};