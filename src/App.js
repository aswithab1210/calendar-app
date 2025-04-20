import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarView from "./components/CalendarView";
import EventModal from "./components/EventModal";
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    setLoading(true);
    setError(null); // Reset previous errors
    axios.get('/.netlify/functions/getEvents')
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching events.");
        setLoading(false);
      });
  }, []);

  // Event Reminder logic (10 minutes before event start)
  const eventReminder = (event) => {
    const eventTime = new Date(event.start).getTime();
    const reminderTime = eventTime - 10 * 60 * 1000; // 10 minutes before event

    // Check if the reminder time is in the future, otherwise set it immediately
    const delayTime = reminderTime > Date.now() ? reminderTime - Date.now() : 0;

    setTimeout(() => {
      alert(`Reminder: Event "${event.title}" is starting soon!`);
    }, delayTime);
  };

  // Add or edit events
  const handleSave = (eventData) => {
    setLoading(true);
    setError(null);

    if (eventData.id) {
      // Editing an existing event
      axios.post('/.netlify/functions/editEvent', eventData)
        .then(() => {
          setEvents(events.map((e) => (e.id === eventData.id ? eventData : e)));
          setSelectedEvent(null);
          setLoading(false);
          eventReminder(eventData); // Set reminder when editing an event
        })
        .catch((err) => {
          setError("Error editing event.");
          setLoading(false);
        });
    } else {
      // Adding a new event
      axios.post('/.netlify/functions/addEvent', eventData)
        .then((res) => {
          setEvents([...events, res.data]);
          setSelectedEvent(null);
          setLoading(false);
          eventReminder(res.data); // Set reminder when adding a new event
        })
        .catch((err) => {
          setError("Error adding event.");
          setLoading(false);
        });
    }
  };

  return (
    <div className="app-container">
      <h1 className="text-center neon-glow">📅 Smart Calendar</h1>
      
      {loading && <div className="spinner-border text-info" role="status"></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <button
        className="btn btn-primary floating-add-button"
        onClick={() => setSelectedEvent({})}
      >
        ➕ Add Event
      </button>

      <CalendarView events={events} onSelectEvent={setSelectedEvent} />

      {selectedEvent !== null && 
        <EventModal 
          event={selectedEvent} 
          onSave={handleSave} 
          onClose={() => setSelectedEvent(null)} 
        />}
    </div>
  );
}

export default App;
