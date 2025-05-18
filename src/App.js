import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Main from './components/layout/Main';
import Footer from './components/layout/Footer';
import Reminder from './components/reminder/Reminder';
import { CalendarProvider, useCalendar } from './context/CalendarProvider';
import './App.css';

const LoadingSpinner = () => (
    <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading calendar...</p>
    </div>
);

const CalendarApp = () => {
    const { activeReminder, closeReminder } = useCalendar();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <Header />
            <Main />
            <Footer />
            {activeReminder && (
                <Reminder
                    event={activeReminder}
                    onClose={closeReminder}
                />
            )}
        </div>
    );
};

function App() {
    return (
        <CalendarProvider>
            <CalendarApp />
        </CalendarProvider>
    );
}

export default App;