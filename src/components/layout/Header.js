import React from 'react';
import '../../styles/layout/Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <button className="btn">+ Add event</button>
                <button className="btn">View</button>
                <button className="btn">Categories</button>
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
