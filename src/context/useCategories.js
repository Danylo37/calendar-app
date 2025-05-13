import { useState } from 'react';

export const useCategories = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Work', icon: 'Briefcase', selected: true },
        { id: 2, name: 'Home', icon: 'Home', selected: true },
        { id: 3, name: 'Personal', icon: 'Heart', selected: true }
    ]);

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

    return {
        categories,
        addCategory,
        removeCategory,
        toggleCategorySelection
    };
};