import React, { useState, useEffect } from "react";

const EventModal = ({ event, onSave, onClose }) => {
  const [title, setTitle] = useState(event ? event.title : "");
  const [start, setStart] = useState(event ? event.start : "");
  const [end, setEnd] = useState(event ? event.end : "");
  const [category, setCategory] = useState(event ? event.category : "Work");

  useEffect(() => {
    setTitle(event ? event.title : "");
    setStart(event ? event.start : "");
    setEnd(event ? event.end : "");
    setCategory(event ? event.category : "Work");
  }, [event]);

  const handleSave = () => {
    if (!title || !start || !end || !category) {
      alert("Please fill all fields.");
      return;
    }
  
    const updatedEvent = { id: event ? event.id : undefined, title, start, end, category };
    onSave(updatedEvent);
  };
  

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{event ? "Edit Event" : "Add Event"}</h2>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Start Date</label>
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label>End Date</label>
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EventModal;
