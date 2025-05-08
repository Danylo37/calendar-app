import React from "react";
import "../../styles/view/MonthView.css";

function MonthView({ currentDate }) {
    return (
        <div className="month-view">
            <h3>Month View - {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
            <p>This view is under development</p>
        </div>
    );
}

export default MonthView;