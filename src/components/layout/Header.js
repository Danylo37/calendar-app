import React from 'react';
import { PlusCircle, Calendar, ListFilter } from 'lucide-react';
import '../../styles/layout/Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <button className="btn">
                    <PlusCircle size={18} />
                    <span>Add Event</span>
                </button>
                <button className="btn">
                    <Calendar size={18} />
                    <span>View</span>
                </button>
                <button className="btn">
                    <ListFilter size={18} />
                    <span>Categories</span>
                </button>
            </div>
            <div className="header-right">
                <button className="btn">&lt;</button>
                <button className="btn date-btn">Date</button>
                <button className="btn">&gt;</button>
            </div>
        </header>
    );
}

export default Header;