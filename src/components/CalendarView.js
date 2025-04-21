import React from "react"; 
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
 
const CalendarView = ({ events, onSelectEvent }) => {
  
  // Event categories and colors
  const eventClassNames = (event) => {
    switch (event.extendedProps.category) {
      case "Work":
        return "event-work";
      case "Personal":
        return "event-personal";
      default:
        return "event-default";
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClassNames={eventClassNames}
        eventClick={(info) => onSelectEvent(info.event)}
      />
    </div>
  );
};

export default CalendarView;
