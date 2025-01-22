import { useEffect, useState } from 'react';
import { fetchEvents, submitEvent } from '../api';

const CreateOrUpdateEventForm = (props) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });

  useEffect(() => {
    if (props.update) {
      const fetchEventData = async () => {
        const events = await fetchEvents();
        const event = events.find((event) => event.id === Number(window.location.pathname.split('/').pop()));
        if (event) {
          setFormData({
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
          });
        }
      };
      fetchEventData();
    }
  }, [props.update]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitEvent(formData);
    setFormData({ id: '', title: '', description: '', date: '', time: '', location: '' });
    window.location.href = '/';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">{formData.id ? 'Update Event' : 'Create New Event'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {formData.id ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrUpdateEventForm;