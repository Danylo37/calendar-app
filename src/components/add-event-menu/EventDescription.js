import React from 'react';

const EventDescription = ({ description, setDescription }) => {
    return (
        <div className="event-form-row">
      <textarea
          className="description-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
      ></textarea>
        </div>
    );
};

export default EventDescription;