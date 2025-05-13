import React from 'react';
import Header from './components/layout/Header';
import Main from './components/layout/Main';
import Footer from './components/layout/Footer';
import { CalendarProvider } from './context/CalendarProvider';
import './App.css';

function App() {
    return (
        <CalendarProvider>
            <div>
                <Header />
                <Main />
                <Footer />
            </div>
        </CalendarProvider>
    );
}

export default App;