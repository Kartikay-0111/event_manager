import React, { useState } from 'react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-800">Event Organizer</h1>
          <div className="hidden md:flex space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <a href='/'>View Events</a>
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              <a href='/create'>Create Event</a>
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <button className="block text-gray-600 hover:text-gray-800 py-2">
            <a href='/'>View Events</a>
          </button>
          <button className="block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2">
            <a href='/create'>Create Event</a>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
