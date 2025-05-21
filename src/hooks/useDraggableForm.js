import { useState, useCallback, useEffect } from 'react';

export const useDraggableForm = ({
                                     formRef,
                                     triggerPosition,
                                     isOpen,
                                     closeAllUIElementsExcept,
                                     closeAllPickers
                                 }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [formDimensions, setFormDimensions] = useState({ width: 400, height: 500 });
    const [isPositionCalculated, setIsPositionCalculated] = useState(false);

    const calculatePosition = useCallback((triggerPos, formWidth, formHeight) => {
        if (!triggerPos) return { x: 0, y: 0 };

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let xPos = triggerPos.left;
        let yPos = triggerPos.top + triggerPos.height + 10;

        if (xPos + formWidth > viewportWidth - 20) {
            xPos = Math.max(20, viewportWidth - formWidth - 20);
        }

        if (yPos + formHeight > viewportHeight - 20) {
            yPos = Math.max(20, triggerPos.top - formHeight - 10);

            if (yPos < 20) {
                yPos = 20;
            }
        }

        return { x: xPos, y: yPos };
    }, []);

    useEffect(() => {
        if (isOpen && formRef.current && triggerPosition) {
            const updateFormDimensions = () => {
                if (formRef.current) {
                    const { width, height } = formRef.current.getBoundingClientRect();
                    setFormDimensions({ width, height });

                    const pos = calculatePosition(triggerPosition, width, height);
                    setPosition(pos);

                    if (pos.y < triggerPosition.top) {
                        formRef.current.style.transformOrigin = 'bottom left';
                    } else {
                        formRef.current.style.transformOrigin = 'top left';
                    }

                    setIsPositionCalculated(true);
                }
            };

            requestAnimationFrame(updateFormDimensions);
        }
    }, [isOpen, triggerPosition, calculatePosition, formRef]);

    useEffect(() => {
        if (formRef.current && isOpen && triggerPosition) {
            const pos = calculatePosition(triggerPosition, formDimensions.width, formDimensions.height);
            setPosition(pos);
        }
    }, [formDimensions, triggerPosition, isOpen, calculatePosition, formRef]);

    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            if (formRef.current && triggerPosition) {
                const { width, height } = formRef.current.getBoundingClientRect();
                setFormDimensions({ width, height });
                const pos = calculatePosition(triggerPosition, width, height);
                setPosition(pos);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen, triggerPosition, calculatePosition, formRef]);

    useEffect(() => {
        if (formRef.current) {
            formRef.current.style.left = `${position.x}px`;
            formRef.current.style.top = `${position.y}px`;
        }
    }, [position, formRef]);

    const handleMouseDown = useCallback((e) => {
        if (e.target.closest('.form-header')) {
            setIsDragging(true);
            const rect = formRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            e.preventDefault();
            e.stopPropagation();
            closeAllUIElementsExcept('eventForm');
            closeAllPickers();
        }
    }, [closeAllUIElementsExcept, closeAllPickers, formRef]);

    const handleMouseMove = useCallback((e) => {
        if (isDragging && formRef.current) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            setPosition({ x: newX, y: newY });
        }
    }, [isDragging, dragOffset, formRef]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        if (!isOpen) {
            setIsPositionCalculated(false);
        }
    }, [isOpen]);

    return {
        position,
        isPositionCalculated,
        handleMouseDown
    };
};

export default useDraggableForm;