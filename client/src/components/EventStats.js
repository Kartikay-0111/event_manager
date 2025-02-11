import React, { useEffect, useState } from 'react';
import { fetchTop5Events, fetchEventRegistrationStats, fetchRegistrationCountByVenue } from '../api';

const EventStats = () => {
  const [top5Events, setTop5Events] = useState([]);
  const [registrationStats, setRegistrationStats] = useState({});
  const [venueRegistrations, setVenueRegistrations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const top5EventsData = await fetchTop5Events();
      setTop5Events(top5EventsData);

      const registrationStatsData = await fetchEventRegistrationStats();
      setRegistrationStats(registrationStatsData);

      const venueRegistrationsData = await fetchRegistrationCountByVenue();
      setVenueRegistrations(venueRegistrationsData);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Top 5 Registered Events */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Top 5 Registered Events</h2>
        <ul>
          {top5Events.map(event => (
            <li key={event.id}>{event.title} - {event.registrations} registrations</li>
          ))}
        </ul>
      </div>

      {/* Registration Stats */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Registration Stats</h2>
        <p>Total Registrations: {registrationStats.totalRegistrations}</p>
        <p>Max Registrations: {registrationStats.maxRegistrations}</p>
        <p>Min Registrations: {registrationStats.minRegistrations}</p>
      </div>

      {/* Registrations by Venue */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Registrations by Venue</h2>
        <ul>
          {venueRegistrations.map(venue => (
            <li key={venue.location}>{venue.location} - {venue.registrations} registrations</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventStats;
