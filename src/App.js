import React from 'react';
import Header from './components/layout/Header';
import Main from './components/layout/Main';
import Footer from './components/layout/Footer';
import Reminder from './components/reminder/Reminder';
import { CalendarProvider, useCalendar } from './context/CalendarProvider';
import './App.css';

const CalendarApp = () => {
    const { activeReminder, closeReminder } = useCalendar();

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