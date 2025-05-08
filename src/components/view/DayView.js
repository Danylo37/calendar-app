import React from "react";

function DayView({ currentDate }) {
    return (
        <div className="day-view">
            <h3>Day View - {currentDate.toLocaleDateString()}</h3>
            <p>This view is under development</p>
        </div>
    );
}

export default DayView;