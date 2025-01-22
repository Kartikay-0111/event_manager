import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ events }) => {
  const id = Number(window.location.pathname.split('/').pop());
  const event = events.find((event) => event.id === id);
  // console.log(events);
  if (!event) {
    return <div className="bg-white rounded-lg shadow-md p-6">Event not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-6">{event.description}</p>
      <div className="space-y-2 text-gray-600">
        <p>📅 Date: {new Date(event.date).toLocaleDateString()}</p>
        <p>🕒 Time: {event.time}</p>
        <p>📍 Location: {event.location}</p>
      </div>
      <Link to={`/rsvp/${event.id}`}>
        <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          RSVP Now
        </button>
      </Link>
    </div>
  );
};

export default EventCard;
