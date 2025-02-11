import React, { useState, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import CreateOrUpdateEventForm from './components/form';
import Navigation from './components/Navigation';
import EventList from './components/EventList';
import EventCard from './components/EventCard';
import { fetchEvents } from './api';
import RSVPForm from './components/RSVPForm';
import EventStats from './components/EventStats';

const App = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };
    fetchData();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />}>
          <Route index element={<EventList events={events} />} />
          <Route path="/create" element={<CreateOrUpdateEventForm />} />
          <Route path="/update/:id" element={<CreateOrUpdateEventForm update={true} />} />
          <Route path="/details/:id" element={<EventCard events={events} />} />
          <Route path="/rsvp/:id" element={<RSVPForm/>} />
          <Route path="/stats" element={<EventStats />} />
        </Route>
      </>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50">
        <Navigation />
      </header>
      <div className="w-10/12 mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
