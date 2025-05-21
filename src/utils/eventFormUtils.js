export const calculateDurationInMinutes = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    let startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;

    if (endTotalMinutes <= startTotalMinutes) {
        endTotalMinutes += 24 * 60;
    }

    return endTotalMinutes - startTotalMinutes;
};

export const validateTimeDuration = (startTime, endTime) => {
    const duration = calculateDurationInMinutes(startTime, endTime);

    if (duration === 1440) {
        return true;
    }

    return duration >= 5;
};

export const validateEventForm = (title, startTime, endTime) => {
    const errors = {
        title: !title.trim(),
        duration: !validateTimeDuration(startTime, endTime)
    };

    return {
        errors,
        isValid: !Object.values(errors).some(error => error)
    };
};