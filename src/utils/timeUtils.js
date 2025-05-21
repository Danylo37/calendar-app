export const getCurrentTimeRoundedToNextHour = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const nextHour = minutes === 0 ? hours : hours + 1;

    const startHour = nextHour % 24;
    const endHour = (startHour + 1) % 24;

    const formattedStartHour = startHour.toString().padStart(2, '0');
    const formattedEndHour = endHour.toString().padStart(2, '0');

    const startTime = `${formattedStartHour}:00`;
    const endTime = `${formattedEndHour}:00`;

    return { startTime, endTime };
};