import React from 'react';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import Calendar from './components/Calendar';
import CategoryFilter from './components/CategoryFilter';
import Reminder from './components/Reminder';

function App() {
    return (
        <div>
            <h1>Event calendar</h1>
            <EventForm />
            <CategoryFilter />
            <Calendar />
            <EventList />
            <Reminder />
        </div>
    );
}

export default App;
