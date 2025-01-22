export const fetchEvents = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/events');
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
export const fetchEvent = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/events/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};
export const submitEvent = async (formData) => {
  const method = formData.id ? 'PUT' : 'POST';
  const url = formData.id
    ? `http://localhost:5000/api/events/${formData.id}`
    : 'http://localhost:5000/api/events';

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error submitting event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

