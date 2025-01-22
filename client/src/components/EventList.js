import React, { useState, useEffect } from 'react';
import { deleteEvent } from '../api';
const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'all'
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'date',
    direction: 'asc'
  });
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchLocations();
  }, [filters, sortConfig]);

  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.direction
      });
      const response = await fetch(`http://localhost:5000/api/events?${queryParams}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    deleteEvent(id);
    fetchEvents();

  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6 p-4">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>

          {/* Date Range Filters */}
          <div className="flex gap-2">
            <input
              type="date"
              className="flex-1 w-1/2 px-3 py-2 border rounded-lg"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <input
              type="date"
              className="flex-1 w-1/2 px-3 py-2 border rounded-lg"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          {/* Location Filter */}
          <div>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sort Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleSort('date')}
          className={`px-4 py-2 rounded-lg ${
            sortConfig.field === 'date'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Date {sortConfig.field === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('title')}
          className={`px-4 py-2 rounded-lg ${
            sortConfig.field === 'title'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Title {sortConfig.field === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button
          onClick={() => handleSort('location')}
          className={`px-4 py-2 rounded-lg ${
            sortConfig.field === 'location'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Location {sortConfig.field === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      {/* Events List */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => window.location.href = `/details/${event.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-2">
              {event.title}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {event.description}
            </p>
            
            <div className="space-y-2">
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>🕒 {event.time}</p>
              <p>📍 {event.location}</p>
            </div>
            
            <div className="mt-4 space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/details/${event.id}`;
                }}
                className="text-blue-500 hover:underline"
              >
                View
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/edit/${event.id}`;
                }}
                className="text-green-500 hover:underline"
              >
                Edit
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEvent(event.id);
                }}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;